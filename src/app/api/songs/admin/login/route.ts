import { NextResponse } from "next/server";
import { adminConfigured, COOKIE, ipKeyOf, loginAllowed, noteFailedLogin, passwordMatches, sessionValue } from "@/lib/setlist/admin/auth";

const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };

export async function POST(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  const ip = ipKeyOf(req);
  if (!(await loginAllowed(ip))) return NextResponse.json({ ok: false, error: "too-many" }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  if (!passwordMatches(body?.password)) {
    await noteFailedLogin(ip);
    return NextResponse.json({ ok: false, error: "wrong" }, { status: 401 });
  }
  const { value, maxAge } = sessionValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, value, { ...cookieOpts, maxAge });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { ...cookieOpts, maxAge: 0 });
  return res;
}
