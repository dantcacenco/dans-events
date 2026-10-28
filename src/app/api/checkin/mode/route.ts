import { NextResponse } from "next/server";
import { isMode } from "@/lib/checkin/config";
import { getMode, setMode } from "@/lib/checkin/store";
import { isStaff } from "@/lib/checkin/auth";

const noStore = { "Cache-Control": "no-store" };

// The iPads read the active mode from here (just the mode name, nothing personal).
export async function GET() {
  return NextResponse.json({ ok: true, mode: await getMode() }, { headers: noStore });
}

export async function POST(req: Request) {
  if (!(await isStaff())) return NextResponse.json({ ok: false }, { status: 401, headers: noStore });
  const body = (await req.json().catch(() => null)) as { mode?: unknown } | null;
  if (!isMode(body?.mode)) return NextResponse.json({ ok: false, error: "mode" }, { status: 400, headers: noStore });
  try {
    await setMode(body.mode);
    return NextResponse.json({ ok: true, mode: body.mode }, { headers: noStore });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: noStore });
  }
}
