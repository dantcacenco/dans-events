export const dynamic = "force-dynamic";

import { updateDevicePosition, getAllDevices, getSyncVersion } from "@/lib/pixel-mob/state";
import { kv } from "@vercel/kv";
import { isAdmin, unauthorized } from "@/lib/pixel-mob/auth";

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const body = await request.json();
  const { mappings } = body;

  if (!Array.isArray(mappings)) {
    return Response.json({ error: "mappings must be an array" }, { status: 400 });
  }

  const devices = await getAllDevices();
  const byIndex = new Map(devices.map(d => [d.index, d.deviceId]));

  let updated = 0;
  for (const m of mappings) {
    const deviceId = byIndex.get(m.deviceIndex);
    if (!deviceId) continue;
    const ok = await updateDevicePosition(deviceId, {
      nx: m.nx,
      nz: m.nz,
      side: m.side ?? (m.nx < 0.5 ? 0 : 1),
    });
    if (ok) updated++;
  }

  // Bump sync version so phones re-register and pick up new positions
  if (updated > 0) {
    await kv.incr("pixelmob:sync_version");
  }
  const syncVersion = await getSyncVersion();
  console.log(`[pixel-mob/map] Updated ${updated}/${mappings.length} positions, syncVersion=${syncVersion}`);

  return Response.json({ updated, total: mappings.length, syncVersion });
}
