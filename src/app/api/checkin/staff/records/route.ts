import { NextResponse } from "next/server";
import { headcounts } from "@/lib/checkin/logic";
import { deleteRecord, getMode, listRecords, restoreRecord, staffEdit } from "@/lib/checkin/store";
import { isStaff } from "@/lib/checkin/auth";

const noStore = { "Cache-Control": "no-store" };
const denied = () => NextResponse.json({ ok: false }, { status: 401, headers: noStore });
const fail = () => NextResponse.json({ ok: false, error: "store" }, { status: 503, headers: noStore });

// Staff only: records + head counts + the active mode.
export async function GET() {
  if (!(await isStaff())) return denied();
  try {
    const records = await listRecords();
    return NextResponse.json({ ok: true, records, stats: headcounts(records), mode: await getMode() }, { headers: noStore });
  } catch {
    return fail();
  }
}

// Edit one record.
export async function PUT(req: Request) {
  if (!(await isStaff())) return denied();
  const body = (await req.json().catch(() => null)) as { id?: unknown; record?: unknown } | null;
  if (typeof body?.id !== "string") return NextResponse.json({ ok: false }, { status: 400, headers: noStore });
  try {
    const r = await staffEdit(body.id, body.record);
    return NextResponse.json(r, { status: r.ok ? 200 : 400, headers: noStore });
  } catch {
    return fail();
  }
}

// Delete one record.
export async function DELETE(req: Request) {
  if (!(await isStaff())) return denied();
  const body = (await req.json().catch(() => null)) as { id?: unknown } | null;
  if (typeof body?.id !== "string") return NextResponse.json({ ok: false }, { status: 400, headers: noStore });
  try {
    await deleteRecord(body.id);
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch {
    return fail();
  }
}

// Undo a delete: put the record back.
export async function POST(req: Request) {
  if (!(await isStaff())) return denied();
  const body = (await req.json().catch(() => null)) as { restore?: unknown } | null;
  try {
    const ok = await restoreRecord(body?.restore as never);
    return NextResponse.json({ ok }, { status: ok ? 200 : 409, headers: noStore });
  } catch {
    return fail();
  }
}
