import { NextResponse } from "next/server";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { saveCouplePicks } from "@/lib/setlist/guest-store";
import type { CouplePicks } from "@/lib/setlist/types";

const ids = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.length < 60).slice(0, 200) : []);

// The couple's own picks, so guests can see the combined counts. Only the couple's private token can write them.
export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string; partners?: Record<string, unknown>; must?: unknown; never?: unknown } | null;
  if (!body?.token || !TOKEN_RE.test(body.token)) return NextResponse.json({ ok: false }, { status: 400 });
  const partners: CouplePicks["partners"] = {};
  for (const pid of ["a", "b", "solo"]) if (body.partners && pid in body.partners) partners[pid] = ids(body.partners[pid]);
  try {
    await saveCouplePicks(body.token, { partners, must: ids(body.must), never: ids(body.never) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
