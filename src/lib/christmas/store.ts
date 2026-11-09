import "server-only";
import { kvDel, kvGet, kvGetOrThrow, kvKeys, kvMany, kvSet } from "@/lib/teo/kv";
import { EVENT_ID, EMPTY_DETAILS, cleanDetails, type EventDetails } from "./config";
import { cleanInput, detectDuplicate, phoneIndexKey, recordKey, withSantaDefaults, type XmasInput, type XmasRecord } from "./logic";

// Storage: the same KV store the rest of the site uses (Vercel KV; a JSON file under .data/ when run locally).
// One key per record (two phones never overwrite each other), one phone-index key per record (duplicate check).
const PREFIX = `xmas:${EVENT_ID}:`;
const DETAILS_KEY = `${PREFIX}details`;

export async function getDetails(): Promise<EventDetails> {
  const raw = await kvGet<unknown>(DETAILS_KEY);
  return raw ? cleanDetails(raw) : EMPTY_DETAILS;
}
export async function setDetails(raw: unknown): Promise<EventDetails> {
  const d = cleanDetails(raw);
  await kvSet(DETAILS_KEY, d);
  return d;
}

export async function listRecords(): Promise<XmasRecord[]> {
  const keys = await kvKeys(`${PREFIX}rec:`);
  const rows = await kvMany<XmasRecord>(keys);
  return rows
    .filter((r): r is XmasRecord => !!r && typeof r === "object")
    .map(withSantaDefaults)
    .sort((a, b) => b.at - a.at);
}

export const getRecord = (id: string) => kvGetOrThrow<XmasRecord>(recordKey(id));

async function byPhone(phone: string): Promise<XmasRecord | null> {
  const id = await kvGetOrThrow<string>(phoneIndexKey(phone));
  return id ? await getRecord(id) : null;
}

export type SubmitResult = { status: "created" | "updated" | "retry"; record: XmasRecord } | { status: "duplicate"; existing: XmasRecord };

// A guest submission. `id` comes from the guest's phone (so a retry is recognised). `update` = they chose to change the existing record.
export async function submit(id: string, input: XmasInput, update: boolean, now = Date.now()): Promise<SubmitResult> {
  const found = await byPhone(input.phone);
  const dup = detectDuplicate(found ? [found] : [], input.phone, id);
  if (dup.duplicate) {
    if (dup.sameSubmission) return { status: "retry", record: dup.existing };
    if (!update) return { status: "duplicate", existing: dup.existing };
    const next: XmasRecord = { ...dup.existing, ...input, id: dup.existing.id, at: dup.existing.at, updatedAt: now };
    await kvSet(recordKey(next.id), next);
    return { status: "updated", record: next };
  }
  const rec: XmasRecord = { ...input, id, arrived: false, at: now, updatedAt: now };
  await kvSet(recordKey(id), rec);
  await kvSet(phoneIndexKey(input.phone), id);
  return { status: "created", record: rec };
}

// Admin edit: may change the phone, as long as no one else owns the new number.
export async function adminEdit(id: string, raw: unknown, now = Date.now()): Promise<{ ok: true; record: XmasRecord } | { ok: false; error: string }> {
  const cur = await getRecord(id);
  if (!cur) return { ok: false, error: "missing" };
  // The admin screen only edits name, phone, party and the Santa switch: keep the likes and gift ideas the guest gave.
  const body = (raw ?? {}) as Record<string, unknown>;
  const parsed = cleanInput({ ...body, likes: body.likes ?? cur.likes, gifts: body.gifts ?? cur.gifts }, false);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  if (parsed.value.phone !== cur.phone) {
    const other = await byPhone(parsed.value.phone);
    if (other && other.id !== id) return { ok: false, error: "phone-taken" };
    await kvDel(phoneIndexKey(cur.phone));
    await kvSet(phoneIndexKey(parsed.value.phone), id);
  }
  const arrived = typeof (raw as { arrived?: unknown })?.arrived === "boolean" ? (raw as { arrived: boolean }).arrived : cur.arrived;
  const next: XmasRecord = { ...cur, ...parsed.value, arrived, updatedAt: now };
  await kvSet(recordKey(id), next);
  return { ok: true, record: next };
}

export async function setArrived(id: string, arrived: boolean, now = Date.now()): Promise<XmasRecord | null> {
  const cur = await getRecord(id);
  if (!cur) return null;
  const next = { ...cur, arrived, updatedAt: now };
  await kvSet(recordKey(id), next);
  return next;
}

export async function deleteRecord(id: string) {
  const cur = await getRecord(id);
  if (!cur) return;
  await kvDel(recordKey(id));
  if ((await kvGet<string>(phoneIndexKey(cur.phone))) === id) await kvDel(phoneIndexKey(cur.phone));
}

// Undo of an admin delete: put the exact record back (unless that phone has since registered again).
export async function restoreRecord(rec: XmasRecord): Promise<boolean> {
  const check = cleanInput(rec, false);
  if (!check.ok || !rec.id || typeof rec.id !== "string") return false;
  const clash = await byPhone(check.value.phone);
  if (clash && clash.id !== rec.id) return false;
  const clean: XmasRecord = { ...check.value, id: rec.id.slice(0, 64), arrived: rec.arrived === true, at: Number(rec.at) || Date.now(), updatedAt: Date.now() };
  await kvSet(recordKey(clean.id), clean);
  await kvSet(phoneIndexKey(clean.phone), clean.id);
  return true;
}

// Delete every check-in and phone index for the event. Event details stay.
export async function wipeAll(): Promise<number> {
  const keys = (await kvKeys(PREFIX)).filter((k) => k !== DETAILS_KEY);
  for (const k of keys) await kvDel(k);
  return keys.length;
}
