import { withApp, type AppRouteContext } from "@/lib/api";
import { listSessions } from "@/lib/github";

export async function GET(_req: Request, ctx: AppRouteContext) {
  return withApp(ctx, async (app) => ({ sessions: await listSessions(app) }));
}
