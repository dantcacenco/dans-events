import { EVENT_ID } from "./config";
import { cleanGifts, cleanLikes, optionFor, type Gift, type SantaError } from "./santa";
// Phone rules are the same as the Youth Camp check-in: reuse them, do not copy them.
import { displayPhone, formatPhone, normalizePhone } from "../checkin/logic";

export { displayPhone, formatPhone, normalizePhone };

export const phonesForTexting = (records: { phone: string }[]) => records.map((r) => `+1${r.phone}`).join(", ");

export type XmasRecord = {
  id: string; // made on the guest's phone, so a retry never creates a second record
  name: string;
  phone: string; // 10 digits, no formatting
  santa: boolean; // wants to take part in Secret Santa (the guest named above)
  likes: string[]; // Secret Santa only: ids of what they like (see santa.ts)
  gifts: Gift[]; // Secret Santa only: 3 to 5 gift ideas, $20 max each
  arrived: boolean; // admin marked them as here
  at: number; // first registration
  updatedAt: number;
};

export type XmasInput = Pick<XmasRecord, "name" | "phone" | "santa" | "likes" | "gifts">;

export type ValidationError = "name" | "phone" | SantaError;

// Records saved before the Secret Santa questions existed have no likes or gifts: give them empty lists.
// Records saved when the form still asked "how many people" carry a `party` number: drop it, it is no longer used anywhere.
export const withSantaDefaults = (r: Omit<XmasRecord, "likes" | "gifts"> & Partial<Pick<XmasRecord, "likes" | "gifts">> & { party?: unknown }): XmasRecord => {
  const rest: Record<string, unknown> = { ...r };
  delete rest.party;
  return { ...(rest as Omit<XmasRecord, "likes" | "gifts">), likes: Array.isArray(r.likes) ? r.likes : [], gifts: Array.isArray(r.gifts) ? r.gifts : [] };
};

// strictSanta (guests): someone in Secret Santa must give 3 to 5 gift ideas, $20 max each.
// Lenient (admin edit, undo): keep whatever is valid, so the admin can fix a name without retyping gifts.
export function cleanInput(raw: unknown, strictSanta = true): { ok: true; value: XmasInput } | { ok: false; error: ValidationError } {
  const b = (raw ?? {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.replace(/\s+/g, " ").trim().slice(0, 80) : "";
  if (name.length < 2) return { ok: false, error: "name" };
  const phone = normalizePhone(b.phone);
  if (!phone) return { ok: false, error: "phone" };
  const santa = b.santa === true;
  if (!santa) return { ok: true, value: { name, phone, santa, likes: [], gifts: [] } };
  const gifts = cleanGifts(b.gifts, strictSanta);
  if (!gifts.ok) return gifts;
  return { ok: true, value: { name, phone, santa, likes: cleanLikes(b.likes), gifts: gifts.value } };
}

// One record per phone for the event.
export const phoneIndexKey = (phone: string) => `xmas:${EVENT_ID}:phone:${phone}`;
export const recordKey = (id: string) => `xmas:${EVENT_ID}:rec:${id}`;

export type Duplicate = { duplicate: false } | { duplicate: true; existing: XmasRecord; sameSubmission: boolean };

export function detectDuplicate(records: XmasRecord[], phone: string, id: string): Duplicate {
  const hit = records.find((r) => r.phone === phone);
  if (!hit) return { duplicate: false };
  return { duplicate: true, existing: hit, sameSubmission: hit.id === id };
}

// One registration = one person.
export type Stats = { registered: number; santa: number; arrived: number };

export function headcounts(records: XmasRecord[]): Stats {
  return { registered: records.length, santa: records.filter((r) => r.santa).length, arrived: records.filter((r) => r.arrived).length };
}

export type Filter = "all" | "santa" | "arrived" | "waiting";

export function searchRecords(records: XmasRecord[], q: string, filter: Filter = "all"): XmasRecord[] {
  const text = q.trim().toLowerCase();
  const digits = text.replace(/\D/g, "");
  return records.filter((r) => {
    if (filter === "santa" && !r.santa) return false;
    if (filter === "arrived" && !r.arrived) return false;
    if (filter === "waiting" && r.arrived) return false;
    if (!text) return true;
    return r.name.toLowerCase().includes(text) || (digits.length >= 3 && r.phone.includes(digits)) || r.gifts.some((g) => g.text.toLowerCase().includes(text));
  });
}

const csvCell = (v: string | number) => {
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // spreadsheet formula guard
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const priceText = (g: Gift) => (g.price === null ? g.text : `${g.text} ($${g.price})`);
const likeLabels = (ids: string[]) => ids.map((id) => optionFor(id)?.label.en ?? id).join("; ");

export function recordsToCsv(records: XmasRecord[]): string {
  const head = ["Name", "Phone", "Secret Santa", "Likes", "Gift 1", "Gift 2", "Gift 3", "Gift 4", "Gift 5", "Arrived", "Registered", "Updated"];
  const rows = records.map((r) => [r.name, displayPhone(r.phone), r.santa ? "yes" : "", likeLabels(r.likes), ...Array.from({ length: 5 }, (_, i) => (r.gifts[i] ? priceText(r.gifts[i]) : "")), r.arrived ? "yes" : "", new Date(r.at).toISOString(), new Date(r.updatedAt).toISOString()]);
  return "\uFEFF" + [head, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

// Plain list of Secret Santa names, one per line, for pasting into a draw tool.
export const santaNames = (records: XmasRecord[]) =>
  records
    .filter((r) => r.santa)
    .map((r) => r.name)
    .join("\n");

// "2026-12-20" + "17:00" in the guest's language. Date-only and time-only both work; "" when neither is set.
const LOCALE = { en: "en-US", ru: "ru-RU", uk: "uk-UA" } as const;
export function formatWhen(date: string, time: string, lang: keyof typeof LOCALE): string {
  const parts: string[] = [];
  if (date) {
    const [y, m, d] = date.split("-").map(Number);
    parts.push(new Intl.DateTimeFormat(LOCALE[lang], { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d))));
  }
  if (time) {
    const [h, mi] = time.split(":").map(Number);
    parts.push(new Intl.DateTimeFormat(LOCALE[lang], { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2000, 0, 1, h, mi))));
  }
  return parts.join(" · ");
}
