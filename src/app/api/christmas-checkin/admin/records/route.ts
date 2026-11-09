import { NextResponse } from "next/server";
import { headcounts } from "@/lib/christmas/logic";
import { adminEdit, deleteRecord, getDetails, listRecords, restoreRecord, setArrived } from "@/lib/christmas/store";
import { isAdmin } from "@/lib/christmas/auth";

const noStore = { "Cache-Control": "no-store" };
const denied = () => NextResponse.json({ ok: false }, { status: 401, headers: noStore });
const fail = () => NextResponse.json({ ok: false, error: "store" }, { status: 503, headers: noStore });

// Admin only: records, counts and the event details.
export async function GET() {
  if (!(await isAdmin())) return denied();
  try {
    const [records, details] = await Promise.all([listRecords(), getDetails()]);
    return NextResponse.json({ ok: true, records, stats: headcounts(records), details }, { headers: noStore });
  } catch {
    return fail();
  }
}

// Edit one record.
export async function PUT(req: Request) {
  if (!(await isAdmin())) return denied();
  const body = (await req.json().catch(() => null)) as { id?: unknown; record?: unknown } | null;
  if (typeof body?.id !== "string") return NextResponse.json({ ok: false }, { status: 400, headers: noStore });
  try {
    const r = await adminEdit(body.id, body.record);
    return NextResponse.json(r, { status: r.ok ? 200 : 400, headers: noStore });
  } catch {
    return fail();
  }
}

// Mark / unmark arrived.
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return denied();
  const body = (await req.json().catch(() => null)) as { id?: unknown; arrived?: unknown } | null;
  if (typeof body?.id !== "string" || typeof body.arrived !== "boolean") return NextResponse.json({ ok: false }, { status: 400, headers: noStore });
  try {
    const rec = await setArrived(body.id, body.arrived);
    return NextResponse.json({ ok: !!rec }, { status: rec ? 200 : 404, headers: noStore });
  } catch {
    return fail();
  }
}

// Delete one record.
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return denied();
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
  if (!(await isAdmin())) return denied();
  const body = (await req.json().catch(() => null)) as { restore?: unknown } | null;
  try {
    const ok = await restoreRecord(body?.restore as never);
    return NextResponse.json({ ok }, { status: ok ? 200 : 409, headers: noStore });
  } catch {
    return fail();
  }
}
