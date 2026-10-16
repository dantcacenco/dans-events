import { notFound } from "next/navigation";
import SetlistApp from "@/components/setlist/setlist-app";
import { TOKEN_RE } from "@/lib/setlist/couples";
import { activeCouple, getLibrary } from "@/lib/setlist/couple-store";

export const dynamic = "force-dynamic";

export default async function SongsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) notFound();
  const [info, lib] = await Promise.all([activeCouple(token), getLibrary()]);
  if (!info) notFound();
  return <SetlistApp token={token} couple={{ names: info.names, lang: info.lang }} hidden={lib.hidden} />;
}
