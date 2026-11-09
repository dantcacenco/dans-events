import { NextResponse } from "next/server";
import { cleanInput } from "@/lib/christmas/logic";
import { submit } from "@/lib/christmas/store";
import { clientKey, noteHit, underLimit } from "@/lib/christmas/auth";

// Guest write endpoint. Write only: it never returns a list. No names or phones are logged.
const LIMIT = 100;
const WINDOW = 5 * 60 * 1000;
const noStore = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 4000) return NextResponse.json({ ok: false, error: "too-big" }, { status: 413, headers: noStore });
  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(text);
  } catch {}
  const id = typeof body?.id === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(body.id) ? body.id : null;
  if (!body || !id) return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400, headers: noStore });
  const parsed = cleanInput(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400, headers: noStore });

  const who = clientKey(req);
  if (!(await underLimit("xmas-submit", who, LIMIT, WINDOW))) return NextResponse.json({ ok: false, error: "rate" }, { status: 429, headers: noStore });
  await noteHit("xmas-submit", who, WINDOW);

  try {
    const r = await submit(id, parsed.value, body.update === true);
    if (r.status === "duplicate") {
      // Only what the "already registered" screen needs: first name and Santa choice. Never the phone.
      return NextResponse.json({ ok: true, status: "duplicate", existing: { first: r.existing.name.split(" ")[0], santa: r.existing.santa } }, { headers: noStore });
    }
    return NextResponse.json({ ok: true, status: r.status }, { headers: noStore });
  } catch {
    console.error("[christmas-checkin] store unavailable on submit");
    return NextResponse.json({ ok: false, error: "store" }, { status: 503, headers: noStore });
  }
}
