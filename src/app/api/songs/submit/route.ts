import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { activeCouple, markSubmitted } from "@/lib/setlist/couple-store";

// The couple tapped "Send my picks to Dan". Their picks are already on the server (synced as they go);
// this marks the flow as submitted so it shows up as new on the admin page.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string; flow?: string } | null;
  if (!body?.token || !TOKEN_RE.test(body.token) || (body.flow !== "reception" && body.flow !== "ceremony")) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    if (!(await activeCouple(body.token))) return NextResponse.json({ ok: false }, { status: 404 });
    await markSubmitted(body.token, body.flow);
    return NextResponse.json({ ok: true, delivered: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
