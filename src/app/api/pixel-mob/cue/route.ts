export const dynamic = "force-dynamic";

import { setCue, clearCue } from "@/lib/pixel-mob/state";
import { isAdmin, unauthorized } from "@/lib/pixel-mob/auth";

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const body = await request.json();
  const { animation, speed, width, palette, duration, type, detectedIndices } = body;

  if (!animation && type !== "blink_register") {
    return Response.json({ error: "animation required" }, { status: 400 });
  }

  const cue: {
    id: string;
    animation: string;
    params: { speed: number; width: number; palette: string };
    startAt: number;
    duration: number;
    type: "play" | "blink_register";
    detectedIndices?: number[];
  } = {
    id: `cue_${Date.now()}`,
    animation: animation ?? "all_on",
    params: {
      speed: speed ?? 1,
      width: width ?? 1,
      palette: palette ?? "white",
    },
    startAt: Date.now() + (type === "blink_register" ? 3000 : 500),
    duration: type === "blink_register" ? 6000 : (duration ?? 30000),
    type: type ?? "play",
  };

  if (Array.isArray(detectedIndices) && detectedIndices.length > 0) {
    cue.detectedIndices = detectedIndices;
  }

  console.log(`[pixel-mob/cue] Created: id=${cue.id} type=${cue.type} startAt=${cue.startAt} duration=${cue.duration}`);

  await setCue(cue);
  return Response.json({ cue });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  await clearCue();
  return Response.json({ stopped: true });
}
