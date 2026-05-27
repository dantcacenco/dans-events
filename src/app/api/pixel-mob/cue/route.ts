export const dynamic = "force-dynamic";

import { setCue, clearCue } from "@/lib/pixel-mob/state";
import { isAdmin, unauthorized } from "@/lib/pixel-mob/auth";

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const body = await request.json();
  const { animation, speed, width, palette, duration, type } = body;

  if (!animation && type !== "blink_register") {
    return Response.json({ error: "animation required" }, { status: 400 });
  }

  const cue = {
    id: `cue_${Date.now()}`,
    animation: animation ?? "all_on",
    params: {
      speed: speed ?? 1,
      width: width ?? 1,
      palette: palette ?? "white",
    },
    startAt: Date.now() + 5000,
    duration: duration ?? 30000,
    type: type ?? "play",
  };

  await setCue(cue);
  return Response.json({ cue });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  await clearCue();
  return Response.json({ stopped: true });
}
