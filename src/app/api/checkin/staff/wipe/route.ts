import { NextResponse } from "next/server";
import { wipeAll } from "@/lib/checkin/store";
import { isStaff } from "@/lib/checkin/auth";

// Delete every stored check-in for the event (after the camp).
export async function POST(req: Request) {
  if (!(await isStaff())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { confirm?: unknown } | null;
  if (body?.confirm !== "DELETE") return NextResponse.json({ ok: false, error: "confirm" }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, removed: await wipeAll() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
