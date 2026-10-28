import { VENUES_DATA } from "./venues-data";

// Venue guide pages (/venues/[slug]). Content is researched from each venue's own published pages
// (sources listed on every page). "worked" venues are ones Dan's Events has actually worked, per
// Dan's booking records; nothing on a "guide" page claims we have performed there.

export type VenueSection = { h2: string; p: string[] };
export type Venue = {
  slug: string;
  name: string;
  citySlug: string;
  tier: "worked" | "guide";
  town: string;
  state: string;
  address: string | null;
  title: string;
  description: string;
  h1: string;
  lede: string;
  facts: { label: string; value: string }[];
  sections: VenueSection[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  asOf: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const VENUES: Venue[] = VENUES_DATA;

export function venueBySlug(slug: string): Venue | undefined {
  return VENUES.find((v) => v.slug === slug);
}

export function venuesInCity(citySlug: string): Venue[] {
  return VENUES.filter((v) => v.citySlug === citySlug);
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(the|venue|events?|wedding|and|at|a|luxury collection hotel)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Finds the venue page for a venue name as written in the city lists ("Biltmore Estate — Antler Hill Barn",
// "The Omni Grove Park Inn"...). Matches when the page's name is contained in the listed name or vice versa.
export function venueForName(name: string): Venue | undefined {
  const n = norm(name);
  if (!n) return undefined;
  return VENUES.find((v) => {
    const m = norm(v.name);
    return m.length > 3 && (n === m || n.startsWith(m + " ") || m.startsWith(n + " ") || n.includes(` ${m} `) || n.startsWith(m));
  });
}
