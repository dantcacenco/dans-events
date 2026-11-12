// Thank-you tracker (/admin/thanks): data shapes and the message templates. Pure functions, no server code,
// so the page can fill a template in the browser and the tests can run them directly.
// The contact data itself never lives in this repo (it is public): it sits in KV behind the admin login.

export type Person = { name: string | null; phone: string | null; email?: string | null; instagram?: string | null; src?: string[]; alt?: string | null; confirmed?: boolean };
export type WeddingRef = { date: string; couple: string };

export type Couple = {
  id: string;
  year: number;
  date: string; // YYYY-MM-DD
  couple: string; // "Joe & Vanessa"
  venue: string | null;
  town: string | null;
  role: string;
  bride: Person;
  groom: Person;
  reviewed?: string | null; // a Google review notification that probably came from this couple
  notes?: string[];
  notion?: string;
};

export type Vendor = {
  id: string;
  name: string | null;
  company: string | null;
  role: string | null;
  kind: string; // planner, coordinator, venue staff, DJ, photographer, ...
  phone: string | null;
  email: string | null;
  instagram: string | null;
  website?: string | null;
  weddings: WeddingRef[];
  src?: string[];
  notes?: string[];
};

export type Venue = {
  id: string;
  year: number;
  name: string;
  town: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  weddings: WeddingRef[];
  sources?: Record<string, string>;
  unverified?: string[];
  notes?: string | null;
};

export type ThanksData = { version: number; builtAt?: string | null; reviewLinks: { google: string }; couples: Couple[]; vendors: Vendor[]; venues: Venue[] };
export type ThanksState = Record<string, number>; // row id -> when it was checked (ms)
export type TemplateKind = "couple" | "reviewed" | "planner" | "vendor" | "venue";
export type Templates = Record<TemplateKind, string[]>;

export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ8VVnho38WGMRIcrGl4uIFGU";

// Dan's voice: short, warm, specific, one ask. {first} {couple} {date} {venue} {review} {weddings}
export const DEFAULT_TEMPLATES: Templates = {
  couple: [
    "Hi {first}! Still smiling about your wedding at {venue} on {date}. Thank you for trusting me with your day.\nIf you have a minute, a short Google review would mean a lot: {review}",
    "Hey {first}! Thank you again for having me at your wedding on {date}. It was one of my favorite days this year.\nWould you leave me a quick Google review? {review}",
    "Hi {first}, hope married life is treating you well! Thank you for a beautiful day at {venue}.\nA few words here would help me a lot: {review}",
  ],
  // Couples whose Google review already came in: just thank them (no second ask).
  reviewed: [
    "Hi {first}! Thank you again for having me at your wedding on {date}, and thank you so much for the kind review. It means a lot!",
    "Hey {first}, still smiling about your day at {venue}. Thank you for trusting me with it, and for the sweet review!",
  ],
  planner: [
    "Hi {first}! Thank you for being so great to work with at {couple}'s wedding on {date}. You made the whole day run smooth.\nIf you have a minute, a quick Google review would mean a lot: {review}\nHappy to leave you one too!",
    "Hey {first}, thanks for a great season! Working {couple}'s wedding with you was a joy.\nWould you mind leaving me a short review? {review}",
    "Hi {first}! Loved teaming up on {couple}'s wedding at {venue}. Hope we get to do more together next year.\nA quick review from you would help me a lot: {review}",
  ],
  vendor: [
    "Hi {first}! Great working with you at {couple}'s wedding on {date}. Thanks for a great season!\nIf you have a sec, a quick Google review would help me a lot: {review}\nGlad to return the favor.",
    "Hey {first}, thank you for being awesome at {couple}'s wedding. Hope we work together again soon!\nWould you leave me a quick review? {review}",
    "Hi {first}! It was a pleasure sharing {couple}'s day with you at {venue}.\nIf you have a minute, a short review would mean a lot: {review}",
  ],
  venue: [
    "Hi! Thank you for having me at {venue} this year ({weddings}). Your team made every event easy.\nA quick Google review would mean a lot: {review}\nHappy to leave one for you too!",
    "Hello {venue} team! Thanks for a great season. I loved working {couple}'s wedding with you.\nIf you have a minute, a short review would help me a lot: {review}",
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}`;
}

/** "Joe & Vanessa (lighting)" -> "Joe & Vanessa"; "Tobias (lighting)" -> "Tobias". */
export function coupleLabel(c: string): string {
  return c.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

const COMPANYISH = /\b(llc|inc|co\.?|company|events?|design|film|studio|rentals?|catering|floral|coffee|cart|glam|house|estate|manor|venue|ranch|church|photography|productions?|operations|team)\b/i;

/** First name to greet someone by, or "" when the name is a company or unknown. */
export function firstName(name: string | null | undefined): string {
  if (!name) return "";
  const n = name.replace(/\s*\([^)]*\)/g, "").replace(/[?'"]/g, "").trim();
  if (!n || COMPANYISH.test(n) || /^(unnamed|photographer|videographer|wedding coordinator)/i.test(n)) return "";
  return n.split(/[\s/]+/)[0];
}

/** Both partners' first names for the couple greeting: "Joe and Vanessa". */
export function coupleGreeting(c: Couple): string {
  const b = firstName(c.bride?.name);
  const g = firstName(c.groom?.name);
  if (b && g) return `${g} and ${b}`;
  return b || g || firstName(coupleLabel(c.couple).split(/\s*&\s*/)[0]);
}

export type FillVars = { first?: string; couple?: string; date?: string; venue?: string | null; weddings?: string; review: string };

/** Fill a template; empty pieces drop their little phrase ("at {venue}", "on {date}") instead of leaving gaps. */
export function fillTemplate(tpl: string, v: FillVars): string {
  let s = tpl;
  if (!v.venue) s = s.replace(/\s(at|in)\s\{venue\}/g, "").replace(/\{venue\}\s?team/g, "team");
  if (!v.date) s = s.replace(/\s(on)\s\{date\}/g, "");
  if (!v.couple) s = s.replace(/\{couple\}'s wedding/g, "the wedding").replace(/working \{couple\}'s/g, "working");
  if (!v.weddings) s = s.replace(/\s\(\{weddings\}\)/g, "");
  if (!v.first) s = s.replace(/\s\{first\}([!,])/g, "$1").replace(/^Hi\s\{first\}/, "Hi").replace(/^Hey\s\{first\}/, "Hey");
  s = s
    .replaceAll("{first}", v.first ?? "")
    .replaceAll("{couple}", v.couple ?? "")
    .replaceAll("{date}", v.date ?? "")
    .replaceAll("{venue}", v.venue ?? "")
    .replaceAll("{weddings}", v.weddings ?? "")
    .replaceAll("{review}", v.review);
  return s.replace(/[ \t]{2,}/g, " ").replace(/ ([,.!?])/g, "$1").trim();
}

/** Stable variant per row so neighbours read differently but the same row always copies the same text. */
export function pickVariant(id: string, count: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return count > 0 ? h % count : 0;
}

export function vendorKind(v: Vendor): TemplateKind {
  return /planner|coordinator|venue staff/.test(v.kind) ? "planner" : "vendor";
}

export function messageForCouple(c: Couple, t: Templates, review: string, variant?: number, kind: "couple" | "reviewed" = "couple"): string {
  const list = t[kind]?.length ? t[kind] : DEFAULT_TEMPLATES[kind];
  const tpl = list[(variant ?? pickVariant(c.id, list.length)) % list.length];
  return fillTemplate(tpl, { first: coupleGreeting(c), couple: coupleLabel(c.couple), date: shortDate(c.date), venue: c.venue, review });
}

export function messageForVendor(v: Vendor, t: Templates, review: string, venueOf: (date: string) => string | null, variant?: number): string {
  const kind = vendorKind(v);
  const list = t[kind].length ? t[kind] : DEFAULT_TEMPLATES[kind];
  const tpl = list[(variant ?? pickVariant(v.id, list.length)) % list.length];
  const w = v.weddings[v.weddings.length - 1];
  return fillTemplate(tpl, { first: firstName(v.name), couple: w ? coupleLabel(w.couple) : "", date: w ? shortDate(w.date) : "", venue: w ? venueOf(w.date) : null, review });
}

export function messageForVenue(v: Venue, t: Templates, review: string, variant?: number): string {
  const list = t.venue.length ? t.venue : DEFAULT_TEMPLATES.venue;
  const tpl = list[(variant ?? pickVariant(v.id, list.length)) % list.length];
  const w = v.weddings[v.weddings.length - 1];
  const weddings = v.weddings.map((x) => shortDate(x.date)).join(", ");
  return fillTemplate(tpl, { first: "", couple: w ? coupleLabel(w.couple) : "", date: w ? shortDate(w.date) : "", venue: v.name, weddings, review });
}

/** tel/sms friendly "+18645551234" -> "(864) 555-1234". */
export function prettyPhone(p: string | null | undefined): string {
  const d = (p ?? "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : p ?? "";
}

/** Merge a newly imported dataset into the stored one: the imported years replace those years, other years stay. */
export function mergeYears(current: ThanksData | null, incoming: ThanksData, years: number[]): ThanksData {
  if (!current) return incoming;
  const keep = <T extends { id: string }>(rows: T[], yearOf: (r: T) => number) => rows.filter((r) => !years.includes(yearOf(r)));
  const vYear = (v: Vendor) => Math.max(...v.weddings.map((w) => Number(w.date.slice(0, 4))));
  const byId = <T extends { id: string }>(rows: T[]) => [...new Map(rows.map((r) => [r.id, r])).values()];
  return {
    ...incoming,
    couples: byId([...keep(current.couples, (c) => c.year), ...incoming.couples]).sort((a, b) => b.date.localeCompare(a.date)),
    vendors: byId([...keep(current.vendors, vYear), ...incoming.vendors]),
    venues: byId([...keep(current.venues, (v) => v.year), ...incoming.venues]),
  };
}

export const yearsOf = (d: ThanksData): number[] =>
  [...new Set([...d.couples.map((c) => c.year), ...d.venues.map((v) => v.year), ...d.vendors.flatMap((v) => v.weddings.map((w) => Number(w.date.slice(0, 4))))])].sort((a, b) => b - a);
