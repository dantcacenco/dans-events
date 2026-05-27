export const dynamic = "force-dynamic";

import { getAllDevices, getDeviceCount, resetSync } from "@/lib/pixel-mob/state";
import { isAdmin, unauthorized } from "@/lib/pixel-mob/auth";

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const [devices, count] = await Promise.all([getAllDevices(), getDeviceCount()]);
  return Response.json({ devices, count });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return unauthorized();
  const syncVersion = await resetSync();
  return Response.json({ reset: true, syncVersion });
}
