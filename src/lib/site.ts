// Shared site facts for navigation, hub pages, structured data and llms.txt.
// Every number here is real and dated; update the date when the number changes.

export const BASE_URL = "https://dans-events.com";

// Last content update for the SEO pages (used as sitemap lastmod).
export const SEO_UPDATED = "2026-10-28";

export type CityRegion = "wnc" | "upstate-sc" | "piedmont" | "east-tn";

export type City = {
  slug: string;
  name: string;
  stateAbbr: string;
  state: string;
  region: CityRegion;
};

export const CITIES: City[] = [
  { slug: "asheville", name: "Asheville", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "hendersonville", name: "Hendersonville", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "brevard", name: "Brevard", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "waynesville", name: "Waynesville", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "lake-lure", name: "Lake Lure", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "highlands", name: "Highlands", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "boone", name: "Boone", stateAbbr: "NC", state: "North Carolina", region: "wnc" },
  { slug: "greenville-sc", name: "Greenville", stateAbbr: "SC", state: "South Carolina", region: "upstate-sc" },
  { slug: "spartanburg", name: "Spartanburg", stateAbbr: "SC", state: "South Carolina", region: "upstate-sc" },
  { slug: "columbia-sc", name: "Columbia", stateAbbr: "SC", state: "South Carolina", region: "upstate-sc" },
  { slug: "charlotte", name: "Charlotte", stateAbbr: "NC", state: "North Carolina", region: "piedmont" },
  { slug: "winston-salem", name: "Winston-Salem", stateAbbr: "NC", state: "North Carolina", region: "piedmont" },
  { slug: "greensboro", name: "Greensboro", stateAbbr: "NC", state: "North Carolina", region: "piedmont" },
  { slug: "knoxville", name: "Knoxville", stateAbbr: "TN", state: "Tennessee", region: "east-tn" },
  { slug: "gatlinburg", name: "Gatlinburg", stateAbbr: "TN", state: "Tennessee", region: "east-tn" },
  { slug: "johnson-city", name: "Johnson City", stateAbbr: "TN", state: "Tennessee", region: "east-tn" },
];

export const REGIONS: { id: CityRegion; name: string }[] = [
  { id: "wnc", name: "Western North Carolina" },
  { id: "upstate-sc", name: "South Carolina" },
  { id: "piedmont", name: "Charlotte and the NC Piedmont" },
  { id: "east-tn", name: "East Tennessee" },
];

export function cityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function nearbyCities(slug: string, max = 4): City[] {
  const city = cityBySlug(slug);
  if (!city) return [];
  return CITIES.filter((c) => c.region === city.region && c.slug !== slug).slice(0, max);
}

export function cityLabel(c: City): string {
  return `${c.name}, ${c.stateAbbr}`;
}

// Main navigation (header) and the larger link hub in the footer.
export const NAV_LINKS: [string, string][] = [
  ["/mc", "MC & Host"],
  ["/dj", "DJ"],
  ["/lighting", "Lighting"],
  ["/special-effects", "Effects"],
  ["/venues", "Venues"],
  ["/areas", "Areas"],
  ["/reviews", "Reviews"],
  ["/pricing", "Pricing"],
];

export const SERVICE_LINKS: [string, string][] = [
  ["/mc", "Wedding MC & host"],
  ["/dj", "Wedding DJ"],
  ["/lighting", "Wedding lighting"],
  ["/wedding-uplighting", "Uplighting & dance floor lighting"],
  ["/low-fog", "Low fog: dancing on a cloud"],
  ["/cold-sparklers", "Cold sparklers"],
  ["/special-effects", "All special effects"],
  ["/pricing", "Pricing"],
  ["/2027", "2027 package"],
];

export const ABOUT_LINKS: [string, string][] = [
  ["/about", "About Dan's Events"],
  ["/reviews", "Google reviews"],
  ["/faq", "Questions couples ask"],
  ["/venues", "Wedding venues"],
  ["/areas", "Areas we serve"],
  ["/ru", "По-русски"],
];

// The verified business facts that copy, structured data and llms.txt quote.
export const FACTS = {
  name: "Dan's Events",
  owner: "Dan Tcacenco",
  base: "Asheville, North Carolina",
  languages: ["English", "Russian"],
  // From Dan's booking records (Notion wedding pages), checked 2026-10-28.
  season2026Events: 20,
  season2026Range: "April to October 2026",
  season2026States: "North Carolina, South Carolina, Tennessee, Georgia and Florida",
  googleProfileUrl: "https://www.google.com/maps?cid=7283596630493153825",
};
