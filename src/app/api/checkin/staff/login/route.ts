import { NextResponse } from "next/server";
import { STAFF_COOKIE, WINDOW_MS, MAX_TRIES, clientKey, noteHit, pinMatches, staffConfigured, staffSession, underLimit } from "@/lib/checkin/auth";
import { cookies } from "next/headers";

const noStore = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const who = clientKey(req);
  if (!(await underLimit("login", who, MAX_TRIES, WINDOW_MS))) return NextResponse.json({ ok: false, error: "rate" }, { status: 429, headers: noStore });
  const body = (await req.json().catch(() => null)) as { pin?: unknown } | null;
  if (!staffConfigured() || !pinMatches(body?.pin)) {
    await noteHit("login", who, WINDOW_MS);
    return NextResponse.json({ ok: false, error: "wrong" }, { status: 401, headers: noStore });
  }
  const s = staffSession();
  (await cookies()).set(STAFF_COOKIE, s.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: s.maxAge });
  return NextResponse.json({ ok: true }, { headers: noStore });
}

export async function DELETE() {
  (await cookies()).delete(STAFF_COOKIE);
  return NextResponse.json({ ok: true }, { headers: noStore });
}
