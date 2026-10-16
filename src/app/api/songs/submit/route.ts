import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";

// Prototype stub. The couple tapped "Send my picks to Dan".
// TODO(real version): store the submission under the couple's token and notify Dan. A text is preferred
// (Quo/OpenPhone or similar) with an email fallback via Resend. Both need Dan's approval, so nothing is sent here.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string; flow?: string } | null;
  if (!body?.token || !TOKEN_RE.test(body.token)) return NextResponse.json({ ok: false }, { status: 400 });
  console.log(`[setlist] TODO notify Dan: couple ${body.token.slice(0, 6)}… finished the ${body.flow} picks (not sent in the prototype)`);
  return NextResponse.json({ ok: true, delivered: false });
}
