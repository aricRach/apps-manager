import { BadRequest, withApp, type AppRouteContext } from "@/lib/api";
import { getDiff } from "@/lib/github";
import { BRANCH_PATTERN } from "@/lib/types";

export async function GET(req: Request, ctx: AppRouteContext) {
  return withApp(ctx, async (app) => {
    const branch = new URL(req.url).searchParams.get("branch") ?? "";
    if (!BRANCH_PATTERN.test(branch)) throw new BadRequest("Invalid branch");
    return getDiff(app, branch);
  });
}
