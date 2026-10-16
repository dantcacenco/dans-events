import "server-only";
import { createHash } from "node:crypto";
import { kvGetOrThrow, kvSet } from "@/lib/teo/kv";
import { songById } from "./catalog";
import { cleanText, exclusive, getCoupleState, guestVotes, keys } from "./couple-store";
import { couplePicks } from "./master";
import { catalogMatch, extraKey, norm } from "./norm";
import type { GuestVote, MasterData, MasterExtra, StoredGuestVote } from "./types";

// Guest votes for one couple. Storage and key layout: see couple-store.ts.
const MAX_SESSIONS_PER_COUPLE = 400;
const MAX_NEW_SESSIONS_PER_IP_DAY = 10;
const MAX_POSTS_PER_IP_DAY = 60;

type Limit = { day: string; sessions: string[]; posts: number };

export class RateLimited extends Error {}

export async function saveGuestVote(coupleToken: string, ipKey: string, input: GuestVote): Promise<void> {
  const ip = createHash("sha256").update(ipKey).digest("hex").slice(0, 16);
  // Only real catalog songs count, each at most once, and a song cannot be both liked and skipped.
  const likes = [...new Set(input.likes)].filter((id) => songById(id)?.flow === "reception").slice(0, 80);
  const skips = [...new Set(input.skips)].filter((id) => songById(id)?.flow === "reception" && !likes.includes(id)).slice(0, 80);
  const extras = input.extras
    .map((x) => ({ title: cleanText(x.title, 80), artist: cleanText(x.artist, 80) }))
    .filter((x) => norm(x.title))
    .slice(0, 5);
  const vote: StoredGuestVote = { sessionId: input.sessionId, name: cleanText(input.name, 40), likes, skips, extras, at: Date.now() };
  await exclusive(async () => {
    const day = new Date().toISOString().slice(0, 10);
    const sessions = (await kvGetOrThrow<string[]>(keys.sessions(coupleToken))) ?? [];
    const isNew = !sessions.includes(vote.sessionId);
    // Light abuse protection: a device (IP + browser) can open only a few sessions and send a limited number of updates per day;
    // the same session id replaces its earlier answers instead of adding to them.
    const lim = (await kvGetOrThrow<Limit>(keys.limit(coupleToken, ip))) ?? { day, sessions: [], posts: 0 };
    const cur: Limit = lim.day === day ? lim : { day, sessions: [], posts: 0 };
    if (cur.posts >= MAX_POSTS_PER_IP_DAY) throw new RateLimited("posts");
    if (isNew && (cur.sessions.length >= MAX_NEW_SESSIONS_PER_IP_DAY || sessions.length >= MAX_SESSIONS_PER_COUPLE)) throw new RateLimited("sessions");
    if (isNew && !cur.sessions.includes(vote.sessionId)) cur.sessions.push(vote.sessionId);
    cur.posts += 1;
    await kvSet(keys.limit(coupleToken, ip), cur);
    await kvSet(keys.vote(coupleToken, vote.sessionId), vote);
    if (isNew) await kvSet(keys.sessions(coupleToken), [...sessions, vote.sessionId]);
  });
}

// Counts only (no guest names): what the couple's master list and the guests' live list are built from.
export async function masterFor(coupleToken: string): Promise<MasterData> {
  const [state, votes] = await Promise.all([getCoupleState(coupleToken), guestVotes(coupleToken)]);
  return masterFromData(state ? couplePicks(state.flows.reception) : null, votes);
}

export function masterFromData(picks: { partners: Record<string, string[]>; never: string[] } | null, votes: StoredGuestVote[]): MasterData {
  const never = new Set(picks?.never ?? []);
  const coupleLikes: Record<string, number> = {};
  for (const ids of Object.values(picks?.partners ?? {})) for (const id of new Set(ids)) if (!never.has(id)) coupleLikes[id] = (coupleLikes[id] ?? 0) + 1;
  const guestLikes: Record<string, number> = {};
  const extras = new Map<string, MasterExtra>();
  let guests = 0;
  for (const v of votes) {
    const liked = new Set(v.likes);
    const seen = new Set<string>(); // one person counts once per song and per suggestion
    for (const x of v.extras) {
      const hit = catalogMatch(x.title, x.artist);
      if (hit) liked.add(hit);
      else {
        const key = extraKey(x.title, x.artist);
        if (seen.has(key)) continue;
        seen.add(key);
        const e = extras.get(key);
        if (e) e.count += 1;
        else extras.set(key, { key, title: x.title, artist: x.artist, count: 1 });
      }
    }
    if (liked.size || v.skips.length || v.extras.length) guests += 1;
    for (const id of liked) if (!never.has(id)) guestLikes[id] = (guestLikes[id] ?? 0) + 1;
  }
  return { guests, coupleLikes, guestLikes, extras: [...extras.values()] };
}
