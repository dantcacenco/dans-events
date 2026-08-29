import { isAdmin, unauthorized } from "@/lib/teo/auth";
import { getGive, saveGive } from "@/lib/teo/store";
import { DEFAULT_GIVE, type GiveConfig } from "@/lib/teo/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ give: await getGive() });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const body = (await request.json()) as Partial<GiveConfig>;
  const give: GiveConfig = {
    venmo: (body.venmo ?? "").trim(),
    cashApp: (body.cashApp ?? "").trim(),
    zelle: (body.zelle ?? "").trim(),
    blurb: (body.blurb ?? "").trim() || DEFAULT_GIVE.blurb,
  };

  await saveGive(give);
  return Response.json({ give });
}
