import { notFound } from "next/navigation";
import SetlistApp from "@/components/setlist/setlist-app";
import { getCouple, TOKEN_RE } from "@/lib/setlist/couples";
import { coupleForGuestLink } from "@/lib/setlist/guest-store";

// The link the couple shares with their guests. It only opens the guest flow for that couple.
export default async function GuestSongsPage({ params }: { params: Promise<{ guestToken: string }> }) {
  const { guestToken } = await params;
  if (!TOKEN_RE.test(guestToken)) notFound();
  const couple = await coupleForGuestLink(guestToken);
  if (!couple) notFound();
  return <SetlistApp token={guestToken} couple={getCouple(couple)} guest />;
}
