import { CardExperience } from "@/components/teo/card-experience";
import { getGive, getPublishedDrops } from "@/lib/teo/store";

// The whole point is that this changes without a redeploy.
export const dynamic = "force-dynamic";

export default async function TeoPage() {
  const [drops, give] = await Promise.all([getPublishedDrops(), getGive()]);
  return <CardExperience drops={drops} give={give} />;
}
