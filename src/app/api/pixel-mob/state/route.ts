export const dynamic = "force-dynamic";

import { getState, getDeviceCount, touchDevice } from "@/lib/pixel-mob/state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("deviceId");
  if (deviceId) touchDevice(deviceId);

  const state = getState();

  return Response.json({
    currentCue: state.currentCue,
    deviceCount: getDeviceCount(),
    showConfig: state.showConfig,
    syncVersion: state.syncVersion,
  });
}
