import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminConfigured, adminSession, loginAllowed, noteBadLogin, passwordMatches } from "@/lib/christmas/auth";

const noStore = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  if (!(await loginAllowed(req))) return NextResponse.json({ ok: false, error: "rate" }, { status: 429, headers: noStore });
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  if (!adminConfigured()) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503, headers: noStore });
  if (!passwordMatches(body?.password)) {
    await noteBadLogin(req);
    return NextResponse.json({ ok: false, error: "wrong" }, { status: 401, headers: noStore });
  }
  const s = adminSession();
  (await cookies()).set(ADMIN_COOKIE, s.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: s.maxAge });
  return NextResponse.json({ ok: true }, { headers: noStore });
}

export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true }, { headers: noStore });
}
