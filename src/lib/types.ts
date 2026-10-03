export type RunMode = "change" | "ask" | "review-comment";

export interface RunInfo {
  status: "queued" | "in_progress" | "completed";
  conclusion: string | null;
  url: string;
}

export interface PrInfo {
  number: number;
  title: string;
  url: string;
}

export interface PreviewInfo {
  url: string | null;
  state: "building" | "ready" | "failed";
}

export interface StatusResponse {
  run: RunInfo | null;
  sha: string | null;
  pr: PrInfo | null;
  preview: PreviewInfo | null;
  answer: string | null;
}

export interface DiffFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
}

export interface DiffResponse {
  commits: number;
  files: DiffFile[];
}

export interface AgentSession {
  branch: string;
  pr: PrInfo;
}

export interface CommentTarget {
  file: string;
  line: number;
}

export const AGENT_BRANCH_PREFIX = "agent-";
/** One fixed branch per app, so the preview URL (and its auth allow-list entry) never changes */
export const PREVIEW_BRANCH = "agent-preview";
export const BRANCH_PATTERN = /^agent-[a-z0-9-]{1,60}$/;
export const REQUEST_ID_PATTERN = /^[a-z0-9]{6,32}$/;
