import "server-only";
import { NextResponse } from "next/server";
import { getApp, type AppConfig } from "@/config/apps";
import { GitHubError } from "@/lib/github";

export type AppRouteContext = { params: Promise<{ id: string }> };

/** Resolves the app from the route and turns thrown errors into JSON responses. */
export async function withApp(
  ctx: AppRouteContext,
  handler: (app: AppConfig) => Promise<unknown>
): Promise<NextResponse> {
  const { id } = await ctx.params;
  const app = getApp(id);
  if (!app) return NextResponse.json({ error: "Unknown app" }, { status: 404 });

  try {
    return NextResponse.json((await handler(app)) ?? { ok: true });
  } catch (err) {
    if (err instanceof BadRequest) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof GitHubError) {
      return NextResponse.json({ error: `GitHub: ${err.message}` }, { status: 502 });
    }
    throw err;
  }
}

export class BadRequest extends Error {}
