export const dynamic = "force-dynamic";

import { setCue, clearCue, getState } from "@/lib/pixel-mob/state";

export async function POST(request: Request) {
  const body = await request.json();
  const { animation, speed, width, palette, duration } = body;

  if (!animation) {
    return Response.json({ error: "animation required" }, { status: 400 });
  }

  const cue = {
    id: `cue_${Date.now()}`,
    animation,
    params: {
      speed: speed ?? 1,
      width: width ?? 1,
      palette: palette ?? "white",
    },
    startAt: Date.now() + 5000,
    duration: duration ?? 30000,
  };

  setCue(cue);
  return Response.json({ cue });
}

export async function DELETE() {
  clearCue();
  const state = getState();
  return Response.json({
    stopped: true,
    deviceCount: state.devices.size,
  });
}
