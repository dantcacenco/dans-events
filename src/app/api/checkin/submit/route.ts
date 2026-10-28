import { NextResponse } from "next/server";
import { cleanInput } from "@/lib/checkin/logic";
import { submit } from "@/lib/checkin/store";
import { clientKey, noteHit, underLimit } from "@/lib/checkin/auth";

// Kiosk write endpoint. Write only: it never returns a list. No names or phones are logged.
// One church Wi-Fi shares one IP, so the limit is per IP but generous.
const LIMIT = 150;
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
  if (!(await underLimit("submit", who, LIMIT, WINDOW))) return NextResponse.json({ ok: false, error: "rate" }, { status: 429, headers: noStore });
  await noteHit("submit", who, WINDOW);

  try {
    const r = await submit(id, parsed.value, body.update === true);
    if (r.status === "duplicate") {
      // Only what the "already checked in" screen needs: first name and party size. Never the phone.
      return NextResponse.json({ ok: true, status: "duplicate", existing: { first: r.existing.name.split(" ")[0], party: r.existing.party } }, { headers: noStore });
    }
    return NextResponse.json({ ok: true, status: r.status }, { headers: noStore });
  } catch {
    console.error("[checkin] store unavailable on submit");
    return NextResponse.json({ ok: false, error: "store" }, { status: 503, headers: noStore });
  }
}
