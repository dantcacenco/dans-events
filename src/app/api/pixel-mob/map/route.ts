export const dynamic = "force-dynamic";

import { updateDevicePosition, getAllDevices } from "@/lib/pixel-mob/state";
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

  return Response.json({ updated, total: mappings.length });
}
