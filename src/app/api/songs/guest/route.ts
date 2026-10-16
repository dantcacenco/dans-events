import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { coupleForGuestLink, RateLimited, saveGuestVote } from "@/lib/setlist/guest-store";

const SESSION_RE = /^[a-z0-9]{8,40}$/;
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.length < 60).slice(0, 200) : []);

// A guest's answers. The guest token is only good for this; it never reads the couple's picks, notes or lists.
export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > 20_000) return NextResponse.json({ ok: false }, { status: 413 });
  let body: { guestToken?: string; sessionId?: string; name?: unknown; likes?: unknown; skips?: unknown; extras?: unknown } | null = null;
  try {
    body = JSON.parse(raw);
  } catch {}
  if (!body?.guestToken || !TOKEN_RE.test(body.guestToken) || !body.sessionId || !SESSION_RE.test(body.sessionId)) return NextResponse.json({ ok: false }, { status: 400 });
  const extras = Array.isArray(body.extras)
    ? body.extras.flatMap((x) => (x && typeof x === "object" ? [{ title: String((x as { title?: unknown }).title ?? ""), artist: String((x as { artist?: unknown }).artist ?? "") }] : []))
    : [];
  try {
    const couple = await coupleForGuestLink(body.guestToken);
    if (!couple) return NextResponse.json({ ok: false }, { status: 404 });
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    await saveGuestVote(couple, `${ip}|${req.headers.get("user-agent") ?? ""}`, {
      sessionId: body.sessionId,
      name: String(body.name ?? ""),
      likes: strings(body.likes),
      skips: strings(body.skips),
      extras,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: e instanceof RateLimited ? 429 : 503 });
  }
}
