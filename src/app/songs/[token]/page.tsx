import { notFound } from "next/navigation";
import SetlistApp from "@/components/setlist/setlist-app";
import { getCouple, TOKEN_RE } from "@/lib/setlist/couples";

export default async function SongsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) notFound();
  return <SetlistApp token={token} couple={getCouple(token)} />;
}
