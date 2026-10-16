import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { activeCouple, coupleForGuestLink } from "@/lib/setlist/couple-store";
import { masterFor } from "@/lib/setlist/guest-store";

// Counts only: how many partners and guests liked each song, plus the songs guests added. No names, notes or never-play list.
// Readable with the couple's token or the guest token.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const token = q.get("token");
  const guestToken = q.get("guestToken");
  try {
    const info = token && TOKEN_RE.test(token) ? await activeCouple(token) : guestToken && TOKEN_RE.test(guestToken) ? await coupleForGuestLink(guestToken) : null;
    const couple = info?.token;
    if (!couple) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, master: await masterFor(couple) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
