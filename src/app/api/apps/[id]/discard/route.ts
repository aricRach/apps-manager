import { BadRequest, withApp, type AppRouteContext } from "@/lib/api";
import { discardSession } from "@/lib/github";
import { BRANCH_PATTERN } from "@/lib/types";

export async function POST(req: Request, ctx: AppRouteContext) {
  return withApp(ctx, async (app) => {
    const { branch } = await req.json().catch(() => ({ branch: "" }));
    if (typeof branch !== "string" || !BRANCH_PATTERN.test(branch)) throw new BadRequest("Invalid branch");
    await discardSession(app, branch);
  });
}
