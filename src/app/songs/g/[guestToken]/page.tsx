import { notFound } from "next/navigation";
import SetlistApp from "@/components/setlist/setlist-app";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { coupleForGuestLink, getLibrary } from "@/lib/setlist/couple-store";

export const dynamic = "force-dynamic";

// The link the couple shares with their guests. It only opens the guest flow for that couple.
export default async function GuestSongsPage({ params }: { params: Promise<{ guestToken: string }> }) {
  const { guestToken } = await params;
  if (!TOKEN_RE.test(guestToken)) notFound();
  const [info, lib] = await Promise.all([coupleForGuestLink(guestToken), getLibrary()]);
  if (!info) notFound();
  return <SetlistApp token={guestToken} couple={{ names: info.names, lang: info.lang }} hidden={lib.hidden} clipBase={process.env.SETLIST_CLIP_BASE ?? ""} guest />;
}
