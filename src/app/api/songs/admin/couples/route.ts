import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/setlist/admin/auth";
import { adminCouples } from "@/lib/setlist/admin/data";
import { createCouple } from "@/lib/setlist/couple-store";

const noStore = { "Cache-Control": "no-store" };
const denied = () => NextResponse.json({ ok: false }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return denied();
  try {
    return NextResponse.json({ ok: true, couples: await adminCouples() }, { headers: noStore });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

// New couple: names + optional wedding date + language. Makes both links (couple + guests).
export async function POST(req: Request) {
  if (!(await isAdmin())) return denied();
  const body = (await req.json().catch(() => null)) as { names?: unknown; date?: unknown; lang?: unknown } | null;
  const names = Array.isArray(body?.names) ? body.names.map((n) => String(n ?? "").trim()) : [];
  if (!names[0] || !names[1]) return NextResponse.json({ ok: false, error: "names" }, { status: 400 });
  try {
    const info = await createCouple({ names: [names[0], names[1]], date: String(body?.date ?? ""), lang: body?.lang === "ru" ? "ru" : "en" });
    return NextResponse.json({ ok: true, couple: info });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
