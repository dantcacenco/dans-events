import { getCurrentCue, getDeviceCount, getShowConfig, getSyncVersion } from "@/lib/pixel-mob/state";

export async function GET() {
  const [currentCue, deviceCount, showConfig, syncVersion] = await Promise.all([
    getCurrentCue(),
    getDeviceCount(),
    getShowConfig(),
    getSyncVersion(),
  ]);

  return Response.json(
    { currentCue, deviceCount, showConfig, syncVersion },
    { headers: { "Cache-Control": "s-maxage=1, stale-while-revalidate=2" } }
  );
}
