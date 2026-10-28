import { EVENT, MEALS, MODES, MODE_RULES, PARTY_MAX, PARTY_MIN, isMode, type MealId, type ModeId } from "./config";

export type CheckinRecord = {
  id: string; // made on the iPad, so a retry never creates a second record
  name: string;
  party: number;
  phone: string; // 10 digits, no formatting
  overnight: boolean | null; // null = not asked in this mode
  meals: MealId[];
  mode: ModeId;
  at: number; // first check-in
  updatedAt: number;
};

export type CheckinInput = Pick<CheckinRecord, "name" | "party" | "phone" | "overnight" | "meals" | "mode">;

// ---------- questions per mode ----------
export function questionsFor(mode: ModeId) {
  const r = MODE_RULES[mode];
  return { overnight: r.overnight, meals: [...r.meals] as MealId[] };
}

// ---------- phone ----------
// US numbers only: allows +, spaces, dashes, dots and parentheses. Returns the 10 digits or null.
export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!/^[\d\s()+\-.]*$/.test(raw)) return null;
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (d[0] === "0" || d[0] === "1") return null; // no US area code starts with 0 or 1
  return d;
}

// Typing helper: "8285551234" -> "(828) 555-1234", keeps partial input tidy.
export function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const displayPhone = (digits: string) => formatPhone(digits);

// ---------- party ----------
export const validParty = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= PARTY_MIN && n <= PARTY_MAX;
export const clampParty = (n: number) => Math.min(PARTY_MAX, Math.max(PARTY_MIN, Math.round(n) || PARTY_MIN));

// ---------- validation / cleaning (used on the iPad and again on the server) ----------
export type ValidationError = "name" | "party" | "phone" | "overnight" | "mode";

export function cleanInput(raw: unknown): { ok: true; value: CheckinInput } | { ok: false; error: ValidationError } {
  const b = (raw ?? {}) as Record<string, unknown>;
  if (!isMode(b.mode)) return { ok: false, error: "mode" };
  const mode: ModeId = b.mode;
  const name = typeof b.name === "string" ? b.name.replace(/\s+/g, " ").trim().slice(0, 80) : "";
  if (name.length < 2) return { ok: false, error: "name" };
  if (!validParty(b.party)) return { ok: false, error: "party" };
  const phone = normalizePhone(b.phone);
  if (!phone) return { ok: false, error: "phone" };
  const q = questionsFor(mode);
  let overnight: boolean | null = null;
  if (q.overnight) {
    if (typeof b.overnight !== "boolean") return { ok: false, error: "overnight" };
    overnight = b.overnight;
  }
  const asked = new Set<MealId>(q.meals);
  const meals = Array.isArray(b.meals) ? MEALS.filter((m) => asked.has(m) && (b.meals as unknown[]).includes(m)) : [];
  return { ok: true, value: { name, party: b.party, phone, overnight, meals, mode } };
}

// ---------- duplicates ----------
// One record per phone for the event. The index key is what the store looks up.
export const phoneIndexKey = (phone: string) => `checkin:${EVENT.id}:phone:${phone}`;
export const recordKey = (id: string) => `checkin:${EVENT.id}:rec:${id}`;

export type Duplicate = { duplicate: false } | { duplicate: true; existing: CheckinRecord; sameSubmission: boolean };

// `id` is the submission's own id: the same id again is a retry of the same check-in, not a duplicate person.
export function detectDuplicate(records: CheckinRecord[], phone: string, id: string): Duplicate {
  const hit = records.find((r) => r.phone === phone);
  if (!hit) return { duplicate: false };
  return { duplicate: true, existing: hit, sameSubmission: hit.id === id };
}

// ---------- head counts ----------
export type Stats = {
  parties: number;
  people: number;
  overnightParties: number;
  overnightPeople: number;
  meals: Record<MealId, number>; // people, not forms
};

export function headcounts(records: CheckinRecord[]): Stats {
  const meals = Object.fromEntries(MEALS.map((m) => [m, 0])) as Record<MealId, number>;
  let people = 0;
  let overnightParties = 0;
  let overnightPeople = 0;
  for (const r of records) {
    people += r.party;
    if (r.overnight) {
      overnightParties += 1;
      overnightPeople += r.party;
    }
    for (const m of r.meals) if (m in meals) meals[m] += r.party;
  }
  return { parties: records.length, people, overnightParties, overnightPeople, meals };
}

// ---------- staff helpers ----------
export function searchRecords(records: CheckinRecord[], q: string): CheckinRecord[] {
  const text = q.trim().toLowerCase();
  if (!text) return records;
  const digits = text.replace(/\D/g, "");
  return records.filter((r) => r.name.toLowerCase().includes(text) || (digits.length >= 3 && r.phone.includes(digits)));
}

export const phonesForTexting = (records: CheckinRecord[]) => records.map((r) => `+1${r.phone}`).join(", ");

const csvCell = (v: string | number) => {
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // spreadsheet formula guard
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function recordsToCsv(records: CheckinRecord[]): string {
  const head = ["Name", "People", "Phone", "Overnight", ...MEALS, "Mode", "Checked in", "Updated"];
  const rows = records.map((r) => [
    r.name,
    r.party,
    displayPhone(r.phone),
    r.overnight === null ? "" : r.overnight ? "yes" : "no",
    ...MEALS.map((m) => (r.meals.includes(m) ? "yes" : "")),
    r.mode,
    new Date(r.at).toISOString(),
    new Date(r.updatedAt).toISOString(),
  ]);
  return "﻿" + [head, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export const ALL_MODES = MODES;
