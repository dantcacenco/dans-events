export const dynamic = "force-dynamic";

import { getAllDevices, getDeviceCount, resetSync } from "@/lib/pixel-mob/state";

export function GET() {
  return Response.json({
    devices: getAllDevices(),
    count: getDeviceCount(),
  });
}

export async function DELETE() {
  resetSync();
  return Response.json({ reset: true, syncVersion: 1 });
}
