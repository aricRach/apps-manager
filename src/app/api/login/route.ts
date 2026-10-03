import { NextResponse } from "next/server";
import { SESSION_COOKIE, passwordMatches, sessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const token = await sessionToken();
  if (!token) {
    return NextResponse.json({ error: "DASHBOARD_PASSWORD is not set on the server" }, { status: 500 });
  }
  if (typeof password !== "string" || !(await passwordMatches(password))) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
