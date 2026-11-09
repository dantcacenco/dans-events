// Christmas check-in: everything that changes between events lives here or (title, date, place) in the admin screen.
// Same flow as the Youth Camp check-in (src/lib/checkin), but its own dataset, its own admin and no modes.

export const EVENT_ID = "xmas-2026"; // groups the stored records; change it for a new event

export const LANGS = ["en", "ru", "uk"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);
export const LANG_LABEL: Record<Lang, string> = { en: "EN", ru: "RU", uk: "UK" };

export const PARTY_MIN = 1;
export const PARTY_MAX = 20;

// What the admin can edit. Empty title = the translated default below.
export type EventDetails = {
  title: Record<Lang, string>;
  date: string; // yyyy-mm-dd or ""
  time: string; // HH:MM (24 h) or ""
  place: string; // free text or ""
};

export const DEFAULT_TITLE: Record<Lang, string> = {
  en: "Christmas Celebration",
  ru: "Рождественский праздник",
  uk: "Різдвяне свято",
};

export const EMPTY_DETAILS: EventDetails = { title: { en: "", ru: "", uk: "" }, date: "", time: "", place: "" };

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");

// Accepts anything from the admin form or the store and returns a safe EventDetails.
export function cleanDetails(raw: unknown): EventDetails {
  const b = (raw ?? {}) as Record<string, unknown>;
  const t = (b.title ?? {}) as Record<string, unknown>;
  const date = clip(b.date, 10);
  const time = clip(b.time, 5);
  return {
    title: { en: clip(t.en, 80), ru: clip(t.ru, 80), uk: clip(t.uk, 80) },
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ? date : "",
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : "",
    place: clip(b.place, 120),
  };
}

export const titleFor = (d: EventDetails, lang: Lang) => d.title[lang] || DEFAULT_TITLE[lang];
