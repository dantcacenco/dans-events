import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/setlist/admin/auth";
import { adminCouple } from "@/lib/setlist/admin/data";
import { cleanText, deleteCouple, deleteGuestVote, getCoupleInfo, updateCouple } from "@/lib/setlist/couple-store";
import { TOKEN_RE } from "@/lib/setlist/couples";
import type { CoupleInfo } from "@/lib/setlist/types";

type Ctx = { params: Promise<{ token: string }> };
const noStore = { "Cache-Control": "no-store" };
const fail = (status: number) => NextResponse.json({ ok: false }, { status });

async function guard(ctx: Ctx) {
  if (!(await isAdmin())) return { error: fail(401) };
  const { token } = await ctx.params;
  if (!TOKEN_RE.test(token)) return { error: fail(400) };
  return { token };
}

export async function GET(_req: Request, ctx: Ctx) {
  const g = await guard(ctx);
  if (g.error) return g.error;
  try {
    const info = await getCoupleInfo(g.token);
    if (!info) return fail(404);
    return NextResponse.json({ ok: true, detail: await adminCouple(info) }, { headers: noStore });
  } catch {
    return fail(503);
  }
}

// Edit names / date / language, mark reviewed, private notes, switch the links off or on.
export async function PATCH(req: Request, ctx: Ctx) {
  const g = await guard(ctx);
  if (g.error) return g.error;
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return fail(400);
  const patch: Partial<CoupleInfo> = {};
  if (Array.isArray(b.names) && b.names.length === 2) patch.names = [cleanText(b.names[0], 40), cleanText(b.names[1], 40)];
  if (typeof b.date === "string" && (b.date === "" || /^\d{4}-\d{2}-\d{2}$/.test(b.date))) patch.date = b.date;
  if (b.lang === "en" || b.lang === "ru") patch.lang = b.lang;
  if (typeof b.active === "boolean") patch.active = b.active;
  if (typeof b.reviewed === "boolean") patch.reviewed = b.reviewed;
  if (typeof b.adminNotes === "string") patch.adminNotes = b.adminNotes.slice(0, 8000);
  try {
    const info = await updateCouple(g.token, patch);
    return info ? NextResponse.json({ ok: true, couple: info }) : fail(404);
  } catch {
    return fail(503);
  }
}

// Delete the couple and everything they and their guests sent. `?vote=<sessionId>` deletes one guest's answers instead.
export async function DELETE(req: Request, ctx: Ctx) {
  const g = await guard(ctx);
  if (g.error) return g.error;
  const vote = new URL(req.url).searchParams.get("vote");
  try {
    if (vote) {
      if (!/^[a-z0-9]{8,40}$/.test(vote)) return fail(400);
      await deleteGuestVote(g.token, vote);
      return NextResponse.json({ ok: true });
    }
    return (await deleteCouple(g.token)) ? NextResponse.json({ ok: true }) : fail(404);
  } catch {
    return fail(503);
  }
}
