import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { ensureGuestLink } from "@/lib/setlist/guest-store";

// The couple asks for their guest link (same one every time). The guest token only opens /songs/g/<guestToken>.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  if (!body?.token || !TOKEN_RE.test(body.token)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    return NextResponse.json({ ok: true, guestToken: await ensureGuestLink(body.token) });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
