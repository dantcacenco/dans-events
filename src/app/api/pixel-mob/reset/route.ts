export const dynamic = "force-dynamic";

import { resetSync } from "@/lib/pixel-mob/state";
import { isAdmin, unauthorized } from "@/lib/pixel-mob/auth";

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized();

  const syncVersion = await resetSync();
  console.log(`[pixel-mob/reset] All devices cleared, counter reset to 0, syncVersion=${syncVersion}`);

  return Response.json({ reset: true, syncVersion });
}
