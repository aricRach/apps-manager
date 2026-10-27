import "server-only";
import { strFromU8, unzipSync } from "fflate";
import type { AppConfig, Platform } from "@/config/apps";
import {
  AGENT_BRANCH_PREFIX,
  type AgentSession,
  type DiffResponse,
  type PreviewInfo,
  type PrInfo,
  type RunInfo,
} from "@/lib/types";

const API = "https://api.github.com";

export class GitHubError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function gh(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new GitHubError(500, "GITHUB_TOKEN is not set");

  const res = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });
  return res;
}

async function ghJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await gh(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new GitHubError(res.status, body?.message ?? `GitHub request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function dispatchRun(
  app: AppConfig,
  inputs: { instruction: string; mode: string; branch: string; title: string; request_id: string }
): Promise<void> {
  await ghJson(`/repos/${app.repo}/actions/workflows/${app.workflowFile}/dispatches`, {
    method: "POST",
    body: JSON.stringify({ ref: app.defaultBranch, inputs }),
  });
}

interface WorkflowRun {
  id: number;
  name: string;
  display_title: string;
  status: string;
  conclusion: string | null;
  html_url: string;
}

// workflow_dispatch doesn't return the run it created, so the caller workflow
// puts the request id in its run-name and we match on that.
export async function findRun(
  app: AppConfig,
  requestId: string
): Promise<(RunInfo & { id: number }) | null> {
  const data = await ghJson<{ workflow_runs: WorkflowRun[] }>(
    `/repos/${app.repo}/actions/workflows/${app.workflowFile}/runs?event=workflow_dispatch&per_page=30`
  );
  const run = data.workflow_runs.find((r) => `${r.display_title} ${r.name}`.includes(requestId));
  if (!run) return null;
  return {
    id: run.id,
    status:
      run.status === "completed" ? "completed" : run.status === "in_progress" ? "in_progress" : "queued",
    conclusion: run.conclusion,
    url: run.html_url,
  };
}

export async function getAnswer(
  app: AppConfig,
  runId: number,
  requestId: string
): Promise<string | null> {
  const data = await ghJson<{ artifacts: { name: string; archive_download_url: string }[] }>(
    `/repos/${app.repo}/actions/runs/${runId}/artifacts`
  );
  const artifact = data.artifacts.find((a) => a.name === `answer-${requestId}`);
  if (!artifact) return null;

  const res = await gh(artifact.archive_download_url);
  if (!res.ok) return null;
  const files = unzipSync(new Uint8Array(await res.arrayBuffer()));
  const first = Object.values(files)[0];
  return first ? strFromU8(first) : null;
}

export async function getBranchSha(app: AppConfig, branch: string): Promise<string | null> {
  const res = await gh(`/repos/${app.repo}/branches/${branch}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new GitHubError(res.status, `Could not read branch ${branch}`);
  const data = await res.json();
  return data.commit.sha;
}

interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  head: { ref: string };
}

function toPrInfo(pr: PullRequest): PrInfo {
  return { number: pr.number, title: pr.title, url: pr.html_url };
}

export async function findPr(app: AppConfig, branch: string): Promise<PrInfo | null> {
  const owner = app.repo.split("/")[0];
  const prs = await ghJson<PullRequest[]>(
    `/repos/${app.repo}/pulls?state=open&head=${owner}:${branch}`
  );
  return prs[0] ? toPrInfo(prs[0]) : null;
}

export async function listSessions(app: AppConfig): Promise<AgentSession[]> {
  const prs = await ghJson<PullRequest[]>(`/repos/${app.repo}/pulls?state=open&per_page=50`);
  return prs
    .filter((pr) => pr.head.ref.startsWith(AGENT_BRANCH_PREFIX))
    .map((pr) => ({ branch: pr.head.ref, pr: toPrInfo(pr) }));
}

type PreviewResolver = (app: AppConfig, branch: string, sha: string) => Promise<PreviewInfo>;

const building: PreviewInfo = { url: null, state: "building" };

function previewFromState(state: string | undefined, url: string | null): PreviewInfo {
  if (state === "success" && url) return { url, state: "ready" };
  if (state === "failure" || state === "error") return { url: null, state: "failed" };
  return building;
}

async function getCommitStatuses(app: AppConfig, sha: string) {
  const combined = await ghJson<{ statuses: { context: string; state: string; target_url: string | null }[] }>(
    `/repos/${app.repo}/commits/${sha}/status`
  );
  return combined.statuses;
}

// Vercel (and Netlify, when its GitHub app is installed) report a GitHub
// deployment for each pushed commit. Returns null when there is none yet.
async function deploymentPreview(
  app: AppConfig,
  sha: string,
  preferredUrl: string | null = null
): Promise<PreviewInfo | null> {
  const deployments = await ghJson<{ id: number }[]>(
    `/repos/${app.repo}/deployments?sha=${sha}&per_page=5`
  );
  if (!deployments[0]) return null;
  const statuses = await ghJson<{ state: string; environment_url?: string; target_url?: string }[]>(
    `/repos/${app.repo}/deployments/${deployments[0].id}/statuses?per_page=1`
  );
  const latest = statuses[0];
  return previewFromState(
    latest?.state,
    preferredUrl || latest?.environment_url || latest?.target_url || null
  );
}

async function vercelPreview(app: AppConfig, _branch: string, sha: string): Promise<PreviewInfo> {
  return (await deploymentPreview(app, sha)) ?? building;
}

async function netlifyPreview(app: AppConfig, branch: string, sha: string): Promise<PreviewInfo> {
  // Netlify serves a branch deploy at a stable URL, unlike its per-PR deploy previews.
  const branchUrl = app.netlifySite ? `https://${branch}--${app.netlifySite}.netlify.app` : null;
  const fromDeployment = await deploymentPreview(app, sha, branchUrl);
  if (fromDeployment) return fromDeployment;
  if (!branchUrl) return building;

  // No GitHub deployment, so read the build state from commit statuses.
  const statuses = await getCommitStatuses(app, sha);
  const netlify = statuses.find((s) => /netlify/i.test(s.context));
  return previewFromState(netlify?.state, branchUrl);
}

// Firebase has no git integration. The app's agent.yml deploys a preview channel
// and reports it as a "firebase" commit status whose target is the channel URL.
async function firebasePreview(app: AppConfig, _branch: string, sha: string): Promise<PreviewInfo> {
  const statuses = await getCommitStatuses(app, sha);
  const firebase = statuses.find((s) => s.context === "firebase");
  // Firebase serves pages with max-age=3600, so a browser that loaded the channel
  // before (even its "Site Not Found" page) keeps showing that copy. A per-commit
  // query string makes each change a fresh URL.
  const url = firebase?.target_url ? `${firebase.target_url}?v=${sha.slice(0, 7)}` : null;
  return previewFromState(firebase?.state, url);
}

// Keyed by Platform, so adding a platform without a resolver fails to compile.
const previewResolvers: Record<Platform, PreviewResolver> = {
  vercel: vercelPreview,
  netlify: netlifyPreview,
  firebase: firebasePreview,
};

export function getPreview(app: AppConfig, branch: string, sha: string): Promise<PreviewInfo> {
  return previewResolvers[app.platform](app, branch, sha);
}

export async function getDiff(app: AppConfig, branch: string): Promise<DiffResponse> {
  const data = await ghJson<{
    total_commits: number;
    files?: { filename: string; status: string; additions: number; deletions: number; patch?: string }[];
  }>(`/repos/${app.repo}/compare/${app.defaultBranch}...${branch}`);
  return {
    commits: data.total_commits,
    files: (data.files ?? []).map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch ?? null,
    })),
  };
}

export async function deleteBranch(app: AppConfig, branch: string): Promise<void> {
  // The repo may already auto-delete merged branches, so a failure here is fine.
  await gh(`/repos/${app.repo}/git/refs/heads/${branch}`, { method: "DELETE" });
}

export async function mergeSession(app: AppConfig, branch: string): Promise<void> {
  const pr = await findPr(app, branch);
  if (!pr) throw new GitHubError(404, `No open pull request for ${branch}`);
  await ghJson(`/repos/${app.repo}/pulls/${pr.number}/merge`, {
    method: "PUT",
    body: JSON.stringify({ merge_method: "squash", commit_title: `${pr.title} (#${pr.number})` }),
  });
  await deleteBranch(app, branch);
}

export async function discardSession(app: AppConfig, branch: string): Promise<void> {
  const pr = await findPr(app, branch);
  if (pr) {
    await ghJson(`/repos/${app.repo}/pulls/${pr.number}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed" }),
    });
  }
  await deleteBranch(app, branch);
}
