import data from "@/data/setlist-songs.json";
import type { FlowId, Song, Style } from "./types";

export const STYLES = data.styles as Style[];
export const SONGS = data.songs as Song[];

const songIndex = new Map(SONGS.map((s) => [s.id, s]));

// Songs Dan hid on the admin page (library tab). The page passes the list in before the first render.
let hiddenSongs = new Set<string>();
export const setHiddenSongs = (ids: string[]) => {
  hiddenSongs = new Set(ids);
};

// Where the clips live: "" = this site (public/setlist/clips), or a storage URL such as an R2 public bucket
// (env SETLIST_CLIP_BASE; the pages pass it to the browser). Clip paths in the manifest stay relative.
let clipBase = "";
export const setClipBase = (base: string | undefined) => {
  const next = (base ?? "").replace(/\/+$/, "");
  if (next === clipBase) return;
  for (const s of SONGS) s.clip = next + s.clip.slice(clipBase.length);
  clipBase = next;
};
if (typeof window === "undefined") setClipBase(process.env.SETLIST_CLIP_BASE);

export const songById = (id: string) => songIndex.get(id);
export const stylesFor = (flow: FlowId) => STYLES.filter((s) => s.flow === flow && SONGS.some((x) => x.style === s.id && !hiddenSongs.has(x.id)));
export const styleById = (id: string) => STYLES.find((s) => s.id === id);
export const songsInStyle = (styleId: string, cleanOnly: boolean) =>
  SONGS.filter((s) => s.style === styleId && !hiddenSongs.has(s.id) && (!cleanOnly || (!s.explicit && s.explicitStatus !== "unverified")));

// The style card plays the first song's hook (first clean song when clean-only is on).
export const sampleFor = (styleId: string, cleanOnly: boolean) => songsInStyle(styleId, cleanOnly)[0];
