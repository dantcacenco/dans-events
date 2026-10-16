import { SONGS } from "./catalog";

// "Sweet Home Alabama (feat. X)" and "sweet home  alabama" are the same song.
export const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, " ")
    .replace(/\b(feat|ft|featuring)\b.*$/, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export const extraKey = (title: string, artist: string) => `${norm(title)}|${norm(artist)}`;

// A suggestion that is really a catalog song counts as a like on that song.
export function catalogMatch(title: string, artist: string): string | undefined {
  const t = norm(title);
  const a = norm(artist);
  if (!t) return undefined;
  return SONGS.find((s) => s.flow === "reception" && norm(s.title) === t && (!a || norm(s.artist).includes(a) || a.includes(norm(s.artist).split(" ")[0])))?.id;
}
