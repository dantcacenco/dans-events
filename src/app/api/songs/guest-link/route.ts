import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { activeCouple } from "@/lib/setlist/couple-store";

// The couple asks for their guest link (made together with the couple). The guest token only opens /songs/g/<guestToken>.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  if (!body?.token || !TOKEN_RE.test(body.token)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const info = await activeCouple(body.token);
    if (!info) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, guestToken: info.guestToken });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
