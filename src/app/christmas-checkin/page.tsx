import Guest from "@/components/christmas/guest";
import { getDetails } from "@/lib/christmas/store";
import { EMPTY_DETAILS } from "@/lib/christmas/config";

export const dynamic = "force-dynamic";

export default async function ChristmasCheckinPage() {
  // The admin edits title, date and place; an unreachable store must never take the page down.
  const details = await getDetails().catch(() => EMPTY_DETAILS);
  return <Guest details={details} />;
}
