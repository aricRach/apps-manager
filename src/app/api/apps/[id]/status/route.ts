import { BadRequest, withApp, type AppRouteContext } from "@/lib/api";
import { findPr, findRun, getAnswer, getBranchSha, getPreview } from "@/lib/github";
import { BRANCH_PATTERN, REQUEST_ID_PATTERN, type StatusResponse } from "@/lib/types";

export async function GET(req: Request, ctx: AppRouteContext) {
  return withApp(ctx, async (app): Promise<StatusResponse> => {
    const params = new URL(req.url).searchParams;
    const requestId = params.get("requestId");
    const branch = params.get("branch");
    if (requestId && !REQUEST_ID_PATTERN.test(requestId)) throw new BadRequest("Invalid request id");
    if (branch && !BRANCH_PATTERN.test(branch)) throw new BadRequest("Invalid branch");

    const result: StatusResponse = { run: null, sha: null, pr: null, preview: null, answer: null };

    if (requestId) {
      const run = await findRun(app, requestId);
      if (run) {
        result.run = { status: run.status, conclusion: run.conclusion, url: run.url };
        if (params.get("mode") === "ask" && run.status === "completed" && run.conclusion === "success") {
          result.answer = await getAnswer(app, run.id, requestId);
        }
      }
    }

    if (branch) {
      result.sha = await getBranchSha(app, branch);
      if (result.sha) {
        result.pr = await findPr(app, branch);
        result.preview = await getPreview(app, branch, result.sha);
      }
    }

    return result;
  });
}
