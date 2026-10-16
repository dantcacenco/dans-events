import { notFound } from "next/navigation";
import SetlistApp from "@/components/setlist/setlist-app";
import { getCouple, TOKEN_RE } from "@/lib/setlist/couples";
import { DESIGNS, parseDesign } from "@/lib/setlist/designs";

export default async function SongsPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ design?: string }>;
}) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) notFound();
  const design = parseDesign((await searchParams).design);
  return <SetlistApp token={token} couple={getCouple(token)} design={design ?? DESIGNS[0].id} />;
}
