export const dynamic = "force-dynamic";

import { registerDevice, getState } from "@/lib/pixel-mob/state";

export async function POST(request: Request) {
  const body = await request.json();
  const { deviceId } = body;

  if (!deviceId || typeof deviceId !== "string") {
    return Response.json({ error: "deviceId required" }, { status: 400 });
  }

  const reg = registerDevice(deviceId);
  const state = getState();

  return Response.json({
    index: reg.index,
    position: reg.position,
    syncVersion: state.syncVersion,
    showConfig: state.showConfig,
    registeredAt: reg.registeredAt,
  });
}
