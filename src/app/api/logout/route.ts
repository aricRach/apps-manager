import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Same attributes as at login, or the browser won't clear a partitioned cookie.
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
