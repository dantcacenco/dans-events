import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/setlist/admin/auth";
import type { TemplateKind, Templates, ThanksData } from "@/lib/thanks/messages";
import { getData, getState, getTemplates, importData, setContacted, setTemplates } from "@/lib/thanks/store";

// Private thank-you tracker API. Every method needs Dan's admin session (same login as /admin/songs);
// without it the answer is a bare 401 with no data.
export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive", "Referrer-Policy": "no-referrer" };
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: PRIVATE_HEADERS });
const KINDS: TemplateKind[] = ["couple", "reviewed", "planner", "vendor", "venue"];

export async function GET() {
  if (!(await isAdmin())) return json({ ok: false, error: "unauthorized" }, 401);
  try {
    const [data, state, templates] = await Promise.all([getData(), getState(), getTemplates()]);
    return json({ ok: true, data, state, templates });
  } catch {
    return json({ ok: false, error: "store" }, 503);
  }
}

type Body =
  | { action: "contacted"; id?: unknown; on?: unknown }
  | { action: "templates"; templates?: unknown }
  | { action: "import"; data?: unknown; years?: unknown };

function validTemplates(t: unknown): t is Templates {
  if (!t || typeof t !== "object") return false;
  return KINDS.every((k) => {
    const list = (t as Record<string, unknown>)[k];
    if (list === undefined && k === "reviewed") return true; // saved before this kind existed
    return Array.isArray(list) && list.length <= 6 && list.every((s) => typeof s === "string" && s.length <= 1200);
  });
}

function validData(d: unknown): d is ThanksData {
  const x = d as ThanksData;
  return !!x && Array.isArray(x.couples) && Array.isArray(x.vendors) && Array.isArray(x.venues) && typeof x.reviewLinks?.google === "string";
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return json({ ok: false, error: "unauthorized" }, 401);
  const body = (await req.json().catch(() => null)) as Body | null;
  try {
    if (body?.action === "contacted") {
      if (typeof body.id !== "string" || !/^[a-z0-9-]{3,80}$/.test(body.id)) return json({ ok: false, error: "bad-id" }, 400);
      await setContacted(body.id, body.on === true);
      return json({ ok: true });
    }
    if (body?.action === "templates") {
      if (!validTemplates(body.templates)) return json({ ok: false, error: "bad-templates" }, 400);
      await setTemplates(body.templates);
      return json({ ok: true });
    }
    if (body?.action === "import") {
      const years = Array.isArray(body.years) ? body.years.filter((y): y is number => Number.isInteger(y) && y > 2000 && y < 2100) : [];
      if (!validData(body.data) || !years.length) return json({ ok: false, error: "bad-data" }, 400);
      const merged = await importData(body.data, years);
      return json({ ok: true, couples: merged.couples.length, vendors: merged.vendors.length, venues: merged.venues.length });
    }
  } catch {
    return json({ ok: false, error: "store" }, 503);
  }
  return json({ ok: false, error: "bad-action" }, 400);
}
