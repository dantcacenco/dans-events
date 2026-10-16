import type { Extra, FlowId, FlowState, MasterData } from "./types";

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

type Flows = Record<FlowId, FlowState>;

export async function pullCoupleState(token: string): Promise<Flows | null> {
  try {
    const r = await fetch(`/api/songs/state?${new URLSearchParams({ token })}`, { cache: "no-store" });
    return r.ok ? ((await r.json()) as { state: { flows: Flows } | null }).state?.flows ?? null : null;
  } catch {
    return null;
  }
}

export async function pushCoupleState(token: string, flows: Flows): Promise<Flows | null> {
  try {
    const r = await fetch("/api/songs/state", { method: "PUT", ...json({ token, flows }) });
    return r.ok ? ((await r.json()) as { state: { flows: Flows } }).state.flows : null;
  } catch {
    return null;
  }
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
