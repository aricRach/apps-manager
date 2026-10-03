import { randomBytes } from "node:crypto";
import { BadRequest, withApp, type AppRouteContext } from "@/lib/api";
import { dispatchRun } from "@/lib/github";
import { AGENT_BRANCH_PREFIX, BRANCH_PATTERN, type CommentTarget, type RunMode } from "@/lib/types";

interface RunRequest {
  mode: RunMode;
  instruction: string;
  branch?: string;
  comment?: CommentTarget;
}

const MODES: RunMode[] = ["change", "ask", "review-comment"];

export async function POST(req: Request, ctx: AppRouteContext) {
  return withApp(ctx, async (app) => {
    const body = (await req.json().catch(() => ({}))) as Partial<RunRequest>;
    const text = typeof body.instruction === "string" ? body.instruction.trim() : "";
    if (!text) throw new BadRequest("Instruction is empty");
    if (!body.mode || !MODES.includes(body.mode)) throw new BadRequest("Unknown mode");
    if (body.branch && !BRANCH_PATTERN.test(body.branch)) throw new BadRequest("Invalid branch");
    if (body.mode === "review-comment" && !body.branch) throw new BadRequest("Review comments need a branch");

    const requestId = randomBytes(6).toString("hex");
    const branch =
      body.branch ?? (body.mode === "ask" ? "" : `${AGENT_BRANCH_PREFIX}${requestId}`);

    let instruction = text;
    if (body.comment) {
      const where = `${body.comment.file}, line ${body.comment.line}`;
      instruction =
        body.mode === "ask"
          ? `Question about ${where}:\n\n${text}`
          : `Review comment on ${where}. Change only what this comment asks for:\n\n${text}`;
    }
    if (body.mode === "ask" && body.branch) {
      instruction +=
        `\n\nContext: this branch holds pending changes that are not on ${app.defaultBranch} yet. ` +
        `Inspect them with \`git diff origin/${app.defaultBranch}...HEAD\` if the question is about them.`;
    }

    await dispatchRun(app, {
      instruction,
      mode: body.mode,
      branch,
      title: Array.from(text.split("\n")[0]).slice(0, 72).join(""),
      request_id: requestId,
    });

    return { requestId, branch: branch || null };
  });
}
