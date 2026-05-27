export const dynamic = "force-dynamic";

import { getScenes, setScenes } from "@/lib/pixel-mob/state";
import { isAdmin, unauthorized } from "@/lib/pixel-mob/auth";

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const scenes = await getScenes();
  return Response.json({ scenes });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json();
  const { scenes } = body;
  if (!Array.isArray(scenes)) {
    return Response.json({ error: "scenes must be an array" }, { status: 400 });
  }
  await setScenes(scenes);
  return Response.json({ saved: true, count: scenes.length });
}
