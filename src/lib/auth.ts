export const SESSION_COOKIE = "am_session";

// Uses Web Crypto so it runs in both middleware (edge) and route handlers.
async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Cookie value for a logged-in session, or null when no password is configured. */
export async function sessionToken(): Promise<string | null> {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;
  return sha256(`apps-manager:session:${password}`);
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = await sessionToken();
  if (!expected) return false;
  return (await sha256(`apps-manager:session:${candidate}`)) === expected;
}
