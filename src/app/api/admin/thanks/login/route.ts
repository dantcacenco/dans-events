import { NextResponse } from "next/server";
import { attemptLogin, clientIp, PIN_COOKIE, sessionValue } from "@/lib/thanks/auth";

// PIN login for the private thank-you tracker. Never cached, never indexed, no referrer.
export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive", "Referrer-Policy": "no-referrer" };
const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) => NextResponse.json(body, { status, headers: { ...PRIVATE_HEADERS, ...extra } });

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { pin?: unknown } | null;
  let result;
  try {
    result = await attemptLogin(clientIp(req), body?.pin);
  } catch {
    return json({ ok: false, error: "store" }, 503); // can't count tries, so nobody gets in
  }
  if (result.ok) {
    const { value, maxAge } = sessionValue();
    const res = json({ ok: true });
    res.cookies.set(PIN_COOKIE, value, { ...cookieOpts, maxAge });
    return res;
  }
  if (result.reason === "not-configured") return json({ ok: false, error: "not-configured" }, 503);
  if (result.reason === "locked") return json({ ok: false, error: "locked", retryAfter: result.retryAfter }, 429, { "Retry-After": String(result.retryAfter) });
  return json({ ok: false, error: "wrong", left: result.left }, 401);
}

export async function DELETE() {
  const res = json({ ok: true });
  res.cookies.set(PIN_COOKIE, "", { ...cookieOpts, maxAge: 0 });
  return res;
}
