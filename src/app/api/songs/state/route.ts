import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { activeCouple, getCoupleState, mergeCoupleState } from "@/lib/setlist/couple-store";

const noStore = { "Cache-Control": "no-store" };

// The couple's progress, shared between their phones. Only the couple's private token reads or writes it.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!TOKEN_RE.test(token)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    if (!(await activeCouple(token))) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, state: await getCoupleState(token) }, { headers: noStore });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function PUT(req: Request) {
  const raw = await req.text();
  if (raw.length > 400_000) return NextResponse.json({ ok: false }, { status: 413 });
  let body: { token?: string; flows?: unknown } | null = null;
  try {
    body = JSON.parse(raw);
  } catch {}
  if (!body?.token || !TOKEN_RE.test(body.token)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    if (!(await activeCouple(body.token))) return NextResponse.json({ ok: false }, { status: 404 });
    const state = await mergeCoupleState(body.token, body.flows);
    return NextResponse.json({ ok: true, state }, { headers: noStore });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
