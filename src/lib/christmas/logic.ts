import { EVENT_ID, PARTY_MAX, PARTY_MIN } from "./config";
// Phone and party rules are the same as the Youth Camp check-in: reuse them, do not copy them.
import { clampParty, displayPhone, formatPhone, normalizePhone, validParty } from "../checkin/logic";

export { clampParty, displayPhone, formatPhone, normalizePhone, validParty, PARTY_MAX, PARTY_MIN };

export const phonesForTexting = (records: { phone: string }[]) => records.map((r) => `+1${r.phone}`).join(", ");

export type XmasRecord = {
  id: string; // made on the guest's phone, so a retry never creates a second record
  name: string;
  party: number; // people in the group, including the guest
  phone: string; // 10 digits, no formatting
  santa: boolean; // wants to take part in Secret Santa (the guest named above)
  arrived: boolean; // admin marked them as here
  at: number; // first registration
  updatedAt: number;
};

export type XmasInput = Pick<XmasRecord, "name" | "party" | "phone" | "santa">;

export type ValidationError = "name" | "party" | "phone";

export function cleanInput(raw: unknown): { ok: true; value: XmasInput } | { ok: false; error: ValidationError } {
  const b = (raw ?? {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.replace(/\s+/g, " ").trim().slice(0, 80) : "";
  if (name.length < 2) return { ok: false, error: "name" };
  if (!validParty(b.party)) return { ok: false, error: "party" };
  const phone = normalizePhone(b.phone);
  if (!phone) return { ok: false, error: "phone" };
  return { ok: true, value: { name, party: b.party, phone, santa: b.santa === true } };
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

export type Stats = { parties: number; people: number; santa: number; arrivedPeople: number; arrivedParties: number };

export function headcounts(records: XmasRecord[]): Stats {
  let people = 0;
  let santa = 0;
  let arrivedPeople = 0;
  let arrivedParties = 0;
  for (const r of records) {
    people += r.party;
    if (r.santa) santa += 1;
    if (r.arrived) {
      arrivedPeople += r.party;
      arrivedParties += 1;
    }
  }
  return { parties: records.length, people, santa, arrivedPeople, arrivedParties };
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
    return r.name.toLowerCase().includes(text) || (digits.length >= 3 && r.phone.includes(digits));
  });
}

const csvCell = (v: string | number) => {
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // spreadsheet formula guard
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function recordsToCsv(records: XmasRecord[]): string {
  const head = ["Name", "People", "Phone", "Secret Santa", "Arrived", "Registered", "Updated"];
  const rows = records.map((r) => [r.name, r.party, displayPhone(r.phone), r.santa ? "yes" : "", r.arrived ? "yes" : "", new Date(r.at).toISOString(), new Date(r.updatedAt).toISOString()]);
  return "﻿" + [head, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
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
