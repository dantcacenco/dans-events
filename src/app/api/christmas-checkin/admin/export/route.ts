import { listRecords } from "@/lib/christmas/store";
import { recordsToCsv } from "@/lib/christmas/logic";
import { isAdmin } from "@/lib/christmas/auth";
import { EVENT_ID } from "@/lib/christmas/config";

// ?santa=1 exports only the Secret Santa opt-ins.
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const santaOnly = new URL(req.url).searchParams.get("santa") === "1";
  const rows = (await listRecords()).filter((r) => !santaOnly || r.santa);
  return new Response(recordsToCsv(rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${EVENT_ID}${santaOnly ? "-secret-santa" : "-checkins"}.csv"`, "Cache-Control": "no-store" } });
}
