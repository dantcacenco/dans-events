import { songById } from "./catalog";
import { resultFor } from "./store";
import type { CouplePicks, FlowState, MasterData } from "./types";

export type MasterItem = {
  id: string; // catalog song id, or the suggestion key for extras
  extra: boolean;
  title: string;
  artist: string;
  count: number; // people who liked or added it (each partner and each guest counts once)
  coupleLiked: boolean;
  must: boolean;
  clip?: string;
  explicit?: boolean;
};

const byTitle = (a: MasterItem, b: MasterItem) => a.title.localeCompare(b.title);
const ranked = (a: MasterItem, b: MasterItem) => b.count - a.count || Number(b.coupleLiked) - Number(a.coupleLiked) || byTitle(a, b);

// The couple sees their own live picks (`local`); guests see the couple's picks as the server stored them.
// Never-play songs are left out everywhere. Must-play songs are pinned on top of the first section (couple only).
export function buildMaster(data: MasterData | null, local?: FlowState): { songs: MasterItem[]; extras: MasterItem[] } {
  let coupleLikes = data?.coupleLikes ?? {};
  let never = new Set<string>();
  let must = new Set<string>();
  if (local) {
    const r = resultFor(local);
    coupleLikes = {};
    for (const pid of r.pids) for (const id of r.approved[pid]) coupleLikes[id] = (coupleLikes[id] ?? 0) + 1;
    never = new Set(r.never);
    must = new Set(r.must);
  }
  const guestLikes = data?.guestLikes ?? {};
  const ids = new Set([...Object.keys(coupleLikes), ...Object.keys(guestLikes), ...must]);
  const songs: MasterItem[] = [];
  for (const id of ids) {
    const s = songById(id);
    if (!s || s.flow !== "reception" || never.has(id)) continue;
    const count = (coupleLikes[id] ?? 0) + (guestLikes[id] ?? 0);
    songs.push({ id, extra: false, title: s.title, artist: s.artist, count, coupleLiked: (coupleLikes[id] ?? 0) > 0, must: must.has(id), clip: s.clip, explicit: s.explicit });
  }
  songs.sort((a, b) => Number(b.must) - Number(a.must) || ranked(a, b));
  const hidden = new Set(local?.hidden ?? []);
  const extras: MasterItem[] = (data?.extras ?? [])
    .filter((x) => !hidden.has(x.key))
    .map((x) => ({ id: x.key, extra: true, title: x.title, artist: x.artist, count: x.count, coupleLiked: false, must: false }))
    .sort(ranked);
  return { songs, extras };
}

// What the couple's partners approved and marked, in the shape the server keeps for the guests' live list.
export function couplePicks(f: FlowState): CouplePicks {
  const r = resultFor(f);
  return { partners: Object.fromEntries(r.pids.map((pid) => [pid, r.approved[pid]])), must: r.must, never: r.never };
}
