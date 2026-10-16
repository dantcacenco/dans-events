import "server-only";
import { randomBytes } from "node:crypto";
import { kvDel, kvGet, kvGetOrThrow, kvKeys, kvMany, kvSet } from "@/lib/teo/kv";
import { cleanFlows, mergeFlows } from "./sync";
import type { CoupleInfo, CoupleState, FlowId, Lang, StoredGuestVote } from "./types";

// Production data for the set-list pages lives in the site's Vercel KV (Upstash Redis), next to /teo.
//   setlist:couples                      -> [couple token, ...]               the admin's index
//   setlist:couple:<ct>:info             -> CoupleInfo                         names, date, status, notes
//   setlist:couple:<ct>:state            -> CoupleState                        both flows, merged from every phone
//   setlist:couple:<ct>:guest-link       -> guest token     setlist:guest-link:<gt> -> couple token
//   setlist:couple:<ct>:sessions         -> [guest session id, ...]
//   setlist:couple:<ct>:vote:<sid>       -> StoredGuestVote
//   setlist:couple:<ct>:limit:<iphash>   -> guest rate-limit counters (per day)
//   setlist:library                      -> { hidden: [song id], flagged: [song id] }
export const keys = {
  index: "setlist:couples",
  info: (ct: string) => `setlist:couple:${ct}:info`,
  state: (ct: string) => `setlist:couple:${ct}:state`,
  link: (ct: string) => `setlist:couple:${ct}:guest-link`,
  owner: (gt: string) => `setlist:guest-link:${gt}`,
  sessions: (ct: string) => `setlist:couple:${ct}:sessions`,
  vote: (ct: string, sid: string) => `setlist:couple:${ct}:vote:${sid}`,
  limit: (ct: string, ip: string) => `setlist:couple:${ct}:limit:${ip}`,
  library: "setlist:library",
};

export const newToken = () => Array.from(randomBytes(20), (b) => (b % 36).toString(36)).join("");

// One write at a time per server instance, so two requests that land together do not overwrite each other.
let chain: Promise<unknown> = Promise.resolve();
export const exclusive = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
};

export const cleanText = (s: unknown, max: number) =>
  String(s ?? "")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f<>]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);

export const getCoupleInfo = (token: string) => kvGet<CoupleInfo>(keys.info(token));

// The couple page and the guest page only open for couples Dan created and has not switched off.
export async function activeCouple(token: string): Promise<CoupleInfo | null> {
  const info = await getCoupleInfo(token);
  return info?.active ? info : null;
}

export async function coupleForGuestLink(guestToken: string): Promise<CoupleInfo | null> {
  const ct = await kvGet<string>(keys.owner(guestToken));
  return ct ? activeCouple(ct) : null;
}

export async function createCouple(input: { names: [string, string]; date?: string; lang?: Lang }): Promise<CoupleInfo> {
  return exclusive(async () => {
    const token = newToken();
    const guestToken = newToken();
    const date = /^\d{4}-\d{2}-\d{2}$/.test(input.date ?? "") ? input.date! : "";
    const info: CoupleInfo = {
      token,
      guestToken,
      names: [cleanText(input.names[0], 40) || "Partner 1", cleanText(input.names[1], 40) || "Partner 2"],
      date,
      lang: input.lang === "ru" ? "ru" : "en",
      active: true,
      reviewed: false,
      adminNotes: "",
      createdAt: Date.now(),
      submitted: {},
    };
    const index = (await kvGetOrThrow<string[]>(keys.index)) ?? [];
    await kvSet(keys.info(token), info);
    await kvSet(keys.owner(guestToken), token);
    await kvSet(keys.link(token), guestToken);
    await kvSet(keys.index, [...index.filter((t) => t !== token), token]);
    return info;
  });
}

export async function updateCouple(token: string, patch: Partial<Pick<CoupleInfo, "names" | "date" | "lang" | "active" | "reviewed" | "adminNotes" | "submitted">>) {
  return exclusive(async () => {
    const info = await kvGetOrThrow<CoupleInfo>(keys.info(token));
    if (!info) return null;
    const next: CoupleInfo = { ...info, ...patch };
    await kvSet(keys.info(token), next);
    return next;
  });
}

// Removes the couple and everything that belongs to them (picks, guest link, guest votes, rate-limit counters).
export async function deleteCouple(token: string): Promise<boolean> {
  return exclusive(async () => {
    const info = await kvGetOrThrow<CoupleInfo>(keys.info(token));
    if (!info) return false;
    for (const key of await kvKeys(`setlist:couple:${token}:`)) await kvDel(key);
    await kvDel(keys.owner(info.guestToken));
    const index = (await kvGetOrThrow<string[]>(keys.index)) ?? [];
    await kvSet(keys.index, index.filter((t) => t !== token));
    return true;
  });
}

export async function listCouples(): Promise<CoupleInfo[]> {
  const index = (await kvGetOrThrow<string[]>(keys.index)) ?? [];
  return (await kvMany<CoupleInfo>(index.map(keys.info))).filter((c): c is CoupleInfo => !!c);
}

export const getCoupleState = (token: string) => kvGet<CoupleState>(keys.state(token));

// A phone sends its copy; the server keeps the newer copy of each person and of the shared marks/notes, and returns the result.
export async function mergeCoupleState(token: string, incoming: unknown): Promise<CoupleState> {
  return exclusive(async () => {
    const cur = await kvGetOrThrow<CoupleState>(keys.state(token));
    const state: CoupleState = { flows: mergeFlows(cur?.flows, cleanFlows(incoming)), at: Date.now() };
    await kvSet(keys.state(token), state);
    return state;
  });
}

export async function markSubmitted(token: string, flow: FlowId) {
  const info = await getCoupleInfo(token);
  if (!info) return null;
  // A fresh submission needs Dan's eyes again.
  return updateCouple(token, { submitted: { ...info.submitted, [flow]: Date.now() }, reviewed: false });
}

export async function guestVotes(token: string): Promise<StoredGuestVote[]> {
  const sessions = (await kvGet<string[]>(keys.sessions(token))) ?? [];
  return (await kvMany<StoredGuestVote>(sessions.map((sid) => keys.vote(token, sid)))).filter((v): v is StoredGuestVote => !!v);
}

export async function deleteGuestVote(token: string, sessionId: string) {
  return exclusive(async () => {
    const sessions = (await kvGetOrThrow<string[]>(keys.sessions(token))) ?? [];
    await kvDel(keys.vote(token, sessionId));
    await kvSet(keys.sessions(token), sessions.filter((s) => s !== sessionId));
  });
}

export type Library = { hidden: string[]; flagged: string[] };
export const getLibrary = async (): Promise<Library> => (await kvGet<Library>(keys.library)) ?? { hidden: [], flagged: [] };
export const saveLibrary = (lib: Library) => kvSet(keys.library, lib);
