import { NextResponse } from "next/server";
import { wipeAll } from "@/lib/christmas/store";
import { isAdmin } from "@/lib/christmas/auth";

// Delete every stored registration for the event (after Christmas). Event details stay.
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { confirm?: unknown } | null;
  if (body?.confirm !== "DELETE") return NextResponse.json({ ok: false, error: "confirm" }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, removed: await wipeAll() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
