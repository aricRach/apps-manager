"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  FileDiff,
  GitPullRequest,
  Loader2,
  MessageCircleQuestion,
  MonitorPlay,
  Pencil,
  RotateCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import type { AppConfig } from "@/config/apps";
import type {
  AgentSession,
  CommentTarget,
  DiffResponse,
  RunMode,
  StatusResponse,
} from "@/lib/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/loading-state";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal-dialog";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatusBadge } from "@/components/ui/status-badge";
import { TabContent, TabList, Tabs, TabTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DiffView } from "@/components/workspace/diff-view";

interface ActiveRun {
  requestId: string;
  mode: RunMode;
  branch: string | null;
  startedAt: number;
}

const POLL_MS = 5000;
/** How long to wait for GitHub to register a dispatched run before giving up */
const START_TIMEOUT_MS = 120_000;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Not signed in");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data as T;
}

const modeOptions = [
  { value: "change" as const, label: "Change", icon: Pencil },
  { value: "ask" as const, label: "Ask", icon: MessageCircleQuestion },
];

export function Workspace({ app }: { app: AppConfig }) {
  const storageKey = `apps-manager:${app.id}`;
  const base = `/api/apps/${app.id}`;

  const [mode, setMode] = useState<"change" | "ask">("change");
  const [instruction, setInstruction] = useState("");
  const [comment, setComment] = useState<CommentTarget | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [run, setRun] = useState<ActiveRun | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [diff, setDiff] = useState<DiffResponse | null>(null);
  const [tab, setTab] = useState("preview");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"submit" | "merge" | "discard" | null>(null);
  const [confirmMerge, setConfirmMerge] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  /* Restore the in-flight session, or pick up an open agent PR from GitHub */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let stored: { branch: string | null; run: ActiveRun | null } | null = null;
      try {
        stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      } catch {
        /* ignore unreadable storage */
      }
      if (stored?.branch || stored?.run) {
        setBranch(stored.branch);
        setRun(stored.run);
      } else {
        try {
          const data = await api<{ sessions: AgentSession[] }>(`${base}/sessions`);
          if (!cancelled && data.sessions[0]) setBranch(data.sessions[0].branch);
        } catch (err) {
          if (!cancelled) setError((err as Error).message);
        }
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [base, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ branch, run }));
    } catch {
      /* ignore unwritable storage */
    }
  }, [loaded, storageKey, branch, run]);

  /* Poll while the agent is running or the preview is still building */
  const previewState = status?.preview?.state;
  const shouldPoll =
    loaded && (!!run || (!!branch && previewState !== "ready" && previewState !== "failed"));

  useEffect(() => {
    if (!shouldPoll) return;
    let cancelled = false;
    let inFlight = false;

    async function tick() {
      if (inFlight) return;
      inFlight = true;
      try {
        const params = new URLSearchParams();
        if (run) {
          params.set("requestId", run.requestId);
          params.set("mode", run.mode);
        }
        if (branch) params.set("branch", branch);
        const data = await api<StatusResponse>(`${base}/status?${params}`);
        if (cancelled) return;
        setStatus(data);

        let finished = !run;
        if (run && data.run?.status === "completed") {
          finished = true;
          if (data.run.conclusion !== "success") {
            setError(`The agent run ended with "${data.run.conclusion}". Open the run log for details.`);
          } else if (run.mode === "ask") {
            setAnswer(data.answer ?? "The run finished but returned no answer.");
            setTab("answer");
          }
          setRun(null);
        } else if (run && !data.run && Date.now() - run.startedAt > START_TIMEOUT_MS) {
          finished = true;
          setError(
            `The workflow run never started. Check that ${app.workflowFile} exists on ${app.defaultBranch} of ${app.repo}.`
          );
          setRun(null);
        }
        // The branch is gone (merged or deleted elsewhere, or the first run never pushed)
        if (finished && branch && data.sha === null) setBranch(null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        inFlight = false;
      }
    }

    tick();
    const timer = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [shouldPoll, run, branch, base, app]);

  /* Reload the diff whenever the branch head moves */
  const sha = status?.sha ?? null;
  useEffect(() => {
    if (!branch || !sha) {
      setDiff(null);
      return;
    }
    let cancelled = false;
    api<DiffResponse>(`${base}/diff?branch=${branch}`)
      .then((data) => !cancelled && setDiff(data))
      .catch((err: Error) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [base, branch, sha]);

  const submit = useCallback(async () => {
    const sendMode: RunMode = mode === "ask" ? "ask" : comment ? "review-comment" : "change";
    setBusy("submit");
    setError(null);
    try {
      const data = await api<{ requestId: string; branch: string | null }>(`${base}/runs`, {
        method: "POST",
        body: JSON.stringify({
          mode: sendMode,
          instruction,
          branch: branch ?? undefined,
          comment: comment ?? undefined,
        }),
      });
      setRun({ requestId: data.requestId, mode: sendMode, branch: data.branch, startedAt: Date.now() });
      if (sendMode !== "ask") setBranch(data.branch);
      setStatus((prev) => (prev ? { ...prev, run: null } : prev));
      setInstruction("");
      setComment(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }, [base, branch, comment, instruction, mode]);

  async function endSession(action: "merge" | "discard") {
    if (!branch) return;
    setBusy(action);
    setError(null);
    try {
      await api(`${base}/${action}`, { method: "POST", body: JSON.stringify({ branch }) });
      setBranch(null);
      setStatus(null);
      setDiff(null);
      setComment(null);
      setConfirmMerge(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const running = !!run;
  const hasSession = !!branch && !!sha;
  const canAct = hasSession && !running && busy === null;

  const badge: { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" } = running
    ? status?.run?.status === "in_progress"
      ? { label: "Agent working", variant: "info" }
      : { label: "Starting", variant: "neutral" }
    : hasSession
      ? previewState === "ready"
        ? { label: "Ready for review", variant: "success" }
        : previewState === "failed"
          ? { label: "Preview failed", variant: "error" }
          : { label: "Building preview", variant: "warning" }
      : { label: "No pending change", variant: "neutral" };

  const submitLabel = mode === "ask" ? "Ask" : comment ? "Send comment" : hasSession ? "Request fix" : "Run change";
  const placeholder =
    mode === "ask"
      ? "Ask about the app. Nothing is changed."
      : hasSession
        ? "Describe what to fix. The agent adds a commit to the same branch."
        : "Describe the change in your own words.";
  const previewUrl = status?.preview?.url ?? null;

  return (
    <>
      <PageHeader
        title={app.name}
        description={app.repo}
        actions={
          <>
            <Button variant="outline" asChild>
              <a href={app.productionUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Production
              </a>
            </Button>
            {hasSession && (
              <>
                <Button variant="outline" disabled={!canAct} onClick={() => endSession("discard")}>
                  {busy === "discard" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-5 w-5" />
                  )}
                  Discard
                </Button>
                <Button disabled={!canAct} onClick={() => setConfirmMerge(true)}>
                  <Check className="mr-2 h-5 w-5" />
                  Approve
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
        {error && (
          <div className="flex items-start justify-between gap-4 rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error">
            <span>{error}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setError(null)}
              className="flex-shrink-0 rounded-sm transition-colors duration-75 hover:text-fg-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Composer + status */}
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-border bg-bg-primary p-5">
              <SegmentedControl
                aria-label="Mode"
                options={modeOptions}
                value={mode}
                onValueChange={setMode}
                disabled={running}
              />

              {comment && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-md bg-accent-subtle px-3 py-2 text-sm text-accent">
                  <span className="truncate font-mono text-xs" dir="ltr">
                    {comment.file}:{comment.line}
                  </span>
                  <button
                    type="button"
                    aria-label="Remove line reference"
                    onClick={() => setComment(null)}
                    className="flex-shrink-0 rounded-sm transition-colors duration-75 hover:text-accent-hover"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <Textarea
                dir="auto"
                className="mt-3 min-h-32"
                placeholder={placeholder}
                value={instruction}
                disabled={running}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && instruction.trim()) submit();
                }}
              />

              <Button
                className="mt-3 w-full"
                disabled={running || busy !== null || !loaded || !instruction.trim()}
                onClick={submit}
              >
                {busy === "submit" || running ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {running ? "Agent is running" : submitLabel}
              </Button>
            </div>

            <div className="rounded-md border border-border bg-bg-primary p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-medium text-fg-primary">Status</h2>
                {loaded ? (
                  <StatusBadge label={badge.label} variant={badge.variant} />
                ) : (
                  <Skeleton className="h-6 w-24" />
                )}
              </div>

              <dl className="mt-2 text-sm">
                {branch && (
                  <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
                    <dt className="text-fg-secondary">Branch</dt>
                    <dd className="truncate font-mono text-fg-primary">{branch}</dd>
                  </div>
                )}
                {status?.pr && hasSession && (
                  <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
                    <dt className="text-fg-secondary">Pull request</dt>
                    <dd>
                      <a
                        href={status.pr.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent transition-colors duration-75 hover:text-accent-hover"
                      >
                        <GitPullRequest className="h-4 w-4" />#{status.pr.number}
                      </a>
                    </dd>
                  </div>
                )}
                {status?.run && (
                  <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
                    <dt className="text-fg-secondary">Last run</dt>
                    <dd>
                      <a
                        href={status.run.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent transition-colors duration-75 hover:text-accent-hover"
                      >
                        Run log
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {!branch && !status?.run && (
                <p className="mt-2 text-sm text-fg-muted">
                  Runs usually take one to two minutes. A change opens a branch and a live preview;
                  nothing reaches {app.defaultBranch} until you approve.
                </p>
              )}
            </div>
          </div>

          {/* Preview / changes / answer */}
          <div className="min-w-0 lg:col-span-2">
            <Tabs defaultValue="preview" value={tab} onValueChange={setTab}>
              <TabList>
                <TabTrigger value="preview">Preview</TabTrigger>
                <TabTrigger value="changes">
                  Changes{diff && diff.files.length > 0 ? ` (${diff.files.length})` : ""}
                </TabTrigger>
                <TabTrigger value="answer">Answer</TabTrigger>
              </TabList>

              <TabContent value="preview">
                {!hasSession ? (
                  <div className="rounded-md border border-border">
                    <EmptyState
                      icon={MonitorPlay}
                      title="No preview yet"
                      description="Run a change and the live preview of the branch shows up here."
                    />
                  </div>
                ) : previewState === "ready" && previewUrl ? (
                  <div className="overflow-hidden rounded-md border border-border">
                    <div className="flex items-center gap-2 border-b border-border bg-bg-secondary px-4 py-2">
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-fg-secondary">
                        {previewUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Reload preview"
                        onClick={() => setFrameKey((k) => k + 1)}
                      >
                        <RotateCw className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={previewUrl} target="_blank" rel="noreferrer" aria-label="Open preview in a new tab">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                    <iframe
                      key={`${sha}-${frameKey}`}
                      src={previewUrl}
                      title={`${app.name} preview`}
                      className="h-[70vh] w-full bg-white"
                    />
                  </div>
                ) : previewState === "failed" ? (
                  <div className="rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error">
                    The preview deployment failed. Check the deployment on{" "}
                    {app.platform === "vercel" ? "Vercel" : "Netlify"}, or ask the agent to fix the build.
                  </div>
                ) : (
                  <div className="rounded-md border border-border p-4">
                    <p className="text-sm text-fg-secondary">Building the preview…</p>
                    <Skeleton className="mt-4 h-[50vh] w-full" />
                  </div>
                )}
              </TabContent>

              <TabContent value="changes">
                {diff && diff.files.length > 0 ? (
                  <>
                    <p className="mb-4 text-sm text-fg-secondary">
                      {diff.files.length} file{diff.files.length === 1 ? "" : "s"} changed against{" "}
                      {app.defaultBranch}. Click the comment icon next to a line to send the agent a
                      note about it.
                    </p>
                    <DiffView
                      files={diff.files}
                      activeComment={comment}
                      onComment={(target) => setComment(target)}
                    />
                  </>
                ) : (
                  <div className="rounded-md border border-border">
                    <EmptyState
                      icon={FileDiff}
                      title="No changes to review"
                      description="The code diff of the pending change appears here before you approve it."
                    />
                  </div>
                )}
              </TabContent>

              <TabContent value="answer">
                {answer ? (
                  <div
                    dir="auto"
                    className="whitespace-pre-wrap rounded-md border border-border bg-bg-primary p-5 text-base text-fg-primary"
                  >
                    {answer}
                  </div>
                ) : (
                  <div className="rounded-md border border-border">
                    <EmptyState
                      icon={MessageCircleQuestion}
                      title="No answer yet"
                      description="Switch to Ask and send a question. The agent reads the code and replies here."
                    />
                  </div>
                )}
              </TabContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={confirmMerge} onOpenChange={setConfirmMerge}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Approve and merge?</DialogTitle>
            <DialogDescription>
              This squash-merges {branch} into {app.defaultBranch} of {app.repo}.{" "}
              {app.platform === "vercel" ? "Vercel" : "Netlify"} then publishes it to production.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="min-w-24" disabled={busy !== null} onClick={() => endSession("merge")}>
              {busy === "merge" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Merge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
