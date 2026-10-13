import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** True when a write to the API was sent from a page on another site. */
function isCrossSiteWrite(req: NextRequest): boolean {
  if (SAFE_METHODS.has(req.method) || !req.nextUrl.pathname.startsWith("/api/")) return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host !== req.headers.get("host");
  } catch {
    return true;
  }
}

export async function middleware(req: NextRequest) {
  if (isCrossSiteWrite(req)) {
    return NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 });
  }

  const expected = await sessionToken();
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (expected && cookie === expected) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|api/login).*)"],
};
