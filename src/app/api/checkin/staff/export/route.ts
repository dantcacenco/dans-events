import { listRecords } from "@/lib/checkin/store";
import { recordsToCsv } from "@/lib/checkin/logic";
import { isStaff } from "@/lib/checkin/auth";
import { EVENT } from "@/lib/checkin/config";

export async function GET() {
  if (!(await isStaff())) return new Response("Unauthorized", { status: 401 });
  const csv = recordsToCsv(await listRecords());
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${EVENT.id}-checkins.csv"`, "Cache-Control": "no-store" } });
}
