export const dynamic = "force-dynamic";

import { registerDevice, getSyncVersion, getShowConfig } from "@/lib/pixel-mob/state";

export async function POST(request: Request) {
  const body = await request.json();
  const { deviceId, zone } = body;

  if (!deviceId || typeof deviceId !== "string") {
    return Response.json({ error: "deviceId required" }, { status: 400 });
  }

  const [reg, syncVersion, showConfig] = await Promise.all([
    registerDevice(deviceId, zone),
    getSyncVersion(),
    getShowConfig(),
  ]);

  return Response.json({
    index: reg.index,
    position: reg.position,
    syncVersion,
    showConfig,
    registeredAt: reg.registeredAt,
  });
}
