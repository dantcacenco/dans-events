import { NextResponse } from "next/server";
import { setDetails } from "@/lib/christmas/store";
import { isAdmin } from "@/lib/christmas/auth";

// Admin edits the title, date, time and place shown on the guest page.
export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { details?: unknown } | null;
  if (!body?.details) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, details: await setDetails(body.details) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "store" }, { status: 503 });
  }
}
