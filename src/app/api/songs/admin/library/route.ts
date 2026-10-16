import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/setlist/admin/auth";
import { SONGS } from "@/lib/setlist/catalog";
import { getLibrary, saveLibrary } from "@/lib/setlist/couple-store";

const known = new Set(SONGS.map((s) => s.id));
const ids = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && known.has(x)))] : []);

// Songs hidden everywhere (left out of every deck) and songs flagged for Dan to fix later.
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, library: await getLibrary() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = (await req.json().catch(() => null)) as { hidden?: unknown; flagged?: unknown } | null;
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });
  const lib = { hidden: ids(b.hidden), flagged: ids(b.flagged) };
  try {
    await saveLibrary(lib);
    return NextResponse.json({ ok: true, library: lib });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
