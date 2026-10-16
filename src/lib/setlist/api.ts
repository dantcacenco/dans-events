import type { CouplePicks, Extra, MasterData } from "./types";

// Browser side of the guest-link API. Every call fails soft: the page keeps working from what is saved on the phone.
const json = (body: unknown) => ({ headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export async function createGuestLink(token: string): Promise<string | null> {
  try {
    const r = await fetch("/api/songs/guest-link", { method: "POST", ...json({ token }) });
    return r.ok ? ((await r.json()) as { guestToken: string }).guestToken : null;
  } catch {
    return null;
  }
}

export async function syncCouplePicks(token: string, picks: CouplePicks): Promise<void> {
  await fetch("/api/songs/couple-picks", { method: "PUT", ...json({ token, ...picks }) }).catch(() => {});
}

export async function sendGuestVote(guestToken: string, v: { sessionId: string; name: string; likes: string[]; skips: string[]; extras: Extra[] }): Promise<boolean> {
  try {
    return (await fetch("/api/songs/guest", { method: "POST", ...json({ guestToken, ...v }) })).ok;
  } catch {
    return false;
  }
}

export async function fetchMaster(who: { token: string } | { guestToken: string }): Promise<MasterData | null> {
  try {
    const r = await fetch(`/api/songs/master?${new URLSearchParams(who)}`, { cache: "no-store" });
    return r.ok ? ((await r.json()) as { master: MasterData }).master : null;
  } catch {
    return null;
  }
}
