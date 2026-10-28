import "server-only";
import { kvDel, kvGet, kvGetOrThrow, kvKeys, kvMany, kvSet } from "@/lib/teo/kv";
import { DEFAULT_MODE, EVENT, isMode, type ModeId } from "./config";
import { detectDuplicate, phoneIndexKey, recordKey, cleanInput, type CheckinInput, type CheckinRecord } from "./logic";

// Storage: the same KV store the rest of the site uses (Vercel KV / Upstash; a JSON file under .data/ when run locally).
// One key per record (so two iPads never overwrite each other), one phone-index key per record (duplicate check).
const MODE_KEY = `checkin:${EVENT.id}:mode`;
const PREFIX = `checkin:${EVENT.id}:`;

export async function getMode(): Promise<ModeId> {
  const m = await kvGet<string>(MODE_KEY);
  return isMode(m) ? m : DEFAULT_MODE;
}
export const setMode = (m: ModeId) => kvSet(MODE_KEY, m);

export async function listRecords(): Promise<CheckinRecord[]> {
  const keys = await kvKeys(`${PREFIX}rec:`);
  const rows = await kvMany<CheckinRecord>(keys);
  return rows.filter((r): r is CheckinRecord => !!r && typeof r === "object").sort((a, b) => b.at - a.at);
}

export const getRecord = (id: string) => kvGetOrThrow<CheckinRecord>(recordKey(id));

async function byPhone(phone: string): Promise<CheckinRecord | null> {
  const id = await kvGetOrThrow<string>(phoneIndexKey(phone));
  return id ? await getRecord(id) : null;
}

export type SubmitResult =
  | { status: "created" | "updated" | "retry"; record: CheckinRecord }
  | { status: "duplicate"; existing: CheckinRecord };

// A kiosk submission. `id` comes from the iPad (so a retry is recognised). `update` = the guest chose to change the existing record.
export async function submit(id: string, input: CheckinInput, update: boolean, now = Date.now()): Promise<SubmitResult> {
  const found = await byPhone(input.phone);
  const dup = detectDuplicate(found ? [found] : [], input.phone, id);
  if (dup.duplicate) {
    if (dup.sameSubmission) return { status: "retry", record: dup.existing }; // lost the reply, sent again
    if (!update) return { status: "duplicate", existing: dup.existing };
    const next: CheckinRecord = { ...dup.existing, ...input, id: dup.existing.id, at: dup.existing.at, updatedAt: now };
    await kvSet(recordKey(next.id), next);
    return { status: "updated", record: next };
  }
  const rec: CheckinRecord = { ...input, id, at: now, updatedAt: now };
  await kvSet(recordKey(id), rec);
  await kvSet(phoneIndexKey(input.phone), id);
  return { status: "created", record: rec };
}

// Staff edit: may change the phone, as long as no one else owns the new number.
export async function staffEdit(id: string, raw: unknown, now = Date.now()): Promise<{ ok: true; record: CheckinRecord } | { ok: false; error: string }> {
  const cur = await getRecord(id);
  if (!cur) return { ok: false, error: "missing" };
  const parsed = cleanInput(raw);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  if (parsed.value.phone !== cur.phone) {
    const other = await byPhone(parsed.value.phone);
    if (other && other.id !== id) return { ok: false, error: "phone-taken" };
    await kvDel(phoneIndexKey(cur.phone));
    await kvSet(phoneIndexKey(parsed.value.phone), id);
  }
  const next: CheckinRecord = { ...cur, ...parsed.value, updatedAt: now };
  await kvSet(recordKey(id), next);
  return { ok: true, record: next };
}

export async function deleteRecord(id: string) {
  const cur = await getRecord(id);
  if (!cur) return;
  await kvDel(recordKey(id));
  if ((await kvGet<string>(phoneIndexKey(cur.phone))) === id) await kvDel(phoneIndexKey(cur.phone));
}

// Undo of a staff delete: put the exact record back (unless that phone has since checked in again).
export async function restoreRecord(rec: CheckinRecord): Promise<boolean> {
  const check = cleanInput(rec);
  if (!check.ok || !rec.id || typeof rec.id !== "string") return false;
  const clash = await byPhone(check.value.phone);
  if (clash && clash.id !== rec.id) return false;
  const clean: CheckinRecord = { ...check.value, id: rec.id.slice(0, 64), at: Number(rec.at) || Date.now(), updatedAt: Date.now() };
  await kvSet(recordKey(clean.id), clean);
  await kvSet(phoneIndexKey(clean.phone), clean.id);
  return true;
}

// Delete everything this feature stored for the event (records, phone index, mode). Rate-limit counters are not personal data and expire on their own.
export async function wipeAll(): Promise<number> {
  const keys = (await kvKeys(PREFIX)).filter((k) => k !== MODE_KEY);
  for (const k of keys) await kvDel(k);
  return keys.length;
}
