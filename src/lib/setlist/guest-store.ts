import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { kvGet, kvGetOrThrow, kvSet } from "@/lib/teo/kv";
import { songById } from "./catalog";
import { catalogMatch, extraKey, norm } from "./norm";
import type { CouplePicks, GuestVote, MasterData, MasterExtra } from "./types";

// Prototype storage for guest links and votes. Same seam as /teo: Vercel KV when its env vars exist, otherwise a JSON file in
// .data/. TODO(real version): move to a database. Tables: guest_links (guest_token pk, couple_token), guest_sessions
// (couple_token, session_id pk, name, created_at, ip_hash), guest_votes (session_id, song_id, vote), guest_extras
// (session_id, title, artist, key), couple_picks (couple_token, person, song_id), couple_marks (couple_token, song_id, must|never),
// and a rate_limits table (ip_hash, day, count).

const MAX_SESSIONS_PER_COUPLE = 400;
const MAX_NEW_SESSIONS_PER_IP_DAY = 10;
const MAX_POSTS_PER_IP_DAY = 60;

const k = {
  link: (ct: string) => `setlist:couple:${ct}:guest-link`,
  owner: (gt: string) => `setlist:guest-link:${gt}`,
  picks: (ct: string) => `setlist:couple:${ct}:picks`,
  sessions: (ct: string) => `setlist:couple:${ct}:sessions`,
  vote: (ct: string, sid: string) => `setlist:couple:${ct}:vote:${sid}`,
  limit: (ct: string, ip: string) => `setlist:couple:${ct}:limit:${ip}`,
};

type StoredVote = GuestVote & { at: number };
type Limit = { day: string; sessions: string[]; posts: number };

export class RateLimited extends Error {}

// One write at a time per process, so two guests finishing together do not overwrite each other's index entry.
let chain: Promise<unknown> = Promise.resolve();
const exclusive = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
};

export async function ensureGuestLink(coupleToken: string): Promise<string> {
  return exclusive(async () => {
    const have = await kvGetOrThrow<string>(k.link(coupleToken));
    if (have) return have;
    const guestToken = Array.from(randomBytes(20), (b) => (b % 36).toString(36)).join("");
    await kvSet(k.owner(guestToken), coupleToken);
    await kvSet(k.link(coupleToken), guestToken);
    return guestToken;
  });
}

export const coupleForGuestLink = (guestToken: string) => kvGet<string>(k.owner(guestToken));

export const saveCouplePicks = (coupleToken: string, picks: CouplePicks) => kvSet(k.picks(coupleToken), picks);

const clean = (s: unknown, max: number) =>
  String(s ?? "")
    .replace(/[\u0000-\u001f\u007f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export async function saveGuestVote(coupleToken: string, ipKey: string, input: GuestVote): Promise<void> {
  const ip = createHash("sha256").update(ipKey).digest("hex").slice(0, 16);
  // Only real catalog songs count, each at most once, and a song cannot be both liked and skipped.
  const likes = [...new Set(input.likes)].filter((id) => songById(id)?.flow === "reception").slice(0, 80);
  const skips = [...new Set(input.skips)].filter((id) => songById(id)?.flow === "reception" && !likes.includes(id)).slice(0, 80);
  const extras = input.extras
    .map((x) => ({ title: clean(x.title, 80), artist: clean(x.artist, 80) }))
    .filter((x) => norm(x.title))
    .slice(0, 5);
  const vote: StoredVote = { sessionId: input.sessionId, name: clean(input.name, 40), likes, skips, extras, at: Date.now() };
  await exclusive(async () => {
    const day = new Date().toISOString().slice(0, 10);
    const sessions = (await kvGetOrThrow<string[]>(k.sessions(coupleToken))) ?? [];
    const isNew = !sessions.includes(vote.sessionId);
    // Light abuse protection: a device (IP) can open only a few sessions and send a limited number of updates per day;
    // the same session id replaces its earlier answers instead of adding to them.
    const lim = (await kvGetOrThrow<Limit>(k.limit(coupleToken, ip))) ?? { day, sessions: [], posts: 0 };
    const cur: Limit = lim.day === day ? lim : { day, sessions: [], posts: 0 };
    if (cur.posts >= MAX_POSTS_PER_IP_DAY) throw new RateLimited("posts");
    if (isNew && (cur.sessions.length >= MAX_NEW_SESSIONS_PER_IP_DAY || sessions.length >= MAX_SESSIONS_PER_COUPLE)) throw new RateLimited("sessions");
    if (isNew && !cur.sessions.includes(vote.sessionId)) cur.sessions.push(vote.sessionId);
    cur.posts += 1;
    await kvSet(k.limit(coupleToken, ip), cur);
    await kvSet(k.vote(coupleToken, vote.sessionId), vote);
    if (isNew) await kvSet(k.sessions(coupleToken), [...sessions, vote.sessionId]);
  });
}

export async function masterFor(coupleToken: string): Promise<MasterData> {
  const picks = await kvGet<CouplePicks>(k.picks(coupleToken));
  const never = new Set(picks?.never ?? []);
  const sessions = (await kvGet<string[]>(k.sessions(coupleToken))) ?? [];
  const votes = (await Promise.all(sessions.map((sid) => kvGet<StoredVote>(k.vote(coupleToken, sid))))).filter((v): v is StoredVote => !!v);
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
