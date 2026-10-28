import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { kvGet, kvSet } from "@/lib/teo/kv";

// Staff screen login: a PIN kept in the env var CHECKIN_STAFF_PIN, or Dan's existing admin password (SETLIST_ADMIN_PASSWORD).
// Same signed-cookie idea as /admin/songs; rotating the PIN signs everyone out.
export const STAFF_COOKIE = "ci_staff";
const SESSION_MS = 3 * 24 * 3600 * 1000;
const MAX_TRIES = 8;
const WINDOW_MS = 15 * 60 * 1000;

const secrets = () => [process.env.CHECKIN_STAFF_PIN ?? "", process.env.SETLIST_ADMIN_PASSWORD ?? ""].filter((s) => s.length >= 4);
export const staffConfigured = () => secrets().length > 0;

const signKey = () => createHash("sha256").update(`checkin-staff:${secrets().join("|")}`).digest();
const sign = (exp: number) => createHmac("sha256", signKey()).update(String(exp)).digest("base64url");

export function staffSession(now = Date.now()) {
  const exp = now + SESSION_MS;
  return { value: `${exp}.${sign(exp)}`, maxAge: SESSION_MS / 1000 };
}

export function validStaffSession(value: string | undefined, now = Date.now()): boolean {
  if (!staffConfigured() || !value) return false;
  const [expRaw, sig] = value.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now || !sig) return false;
  const want = Buffer.from(sign(exp));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function pinMatches(input: unknown): boolean {
  if (typeof input !== "string" || !input) return false;
  const a = createHash("sha256").update(input.trim()).digest();
  return secrets().some((s) => timingSafeEqual(a, createHash("sha256").update(s).digest()));
}

export async function isStaff(): Promise<boolean> {
  return validStaffSession((await cookies()).get(STAFF_COOKIE)?.value);
}

// ---------- rate limiting (shared through KV so every server instance sees it) ----------
type Bucket = { since: number; n: number };
const hash = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 20);

export async function underLimit(scope: string, who: string, max: number, windowMs: number, now = Date.now()): Promise<boolean> {
  const b = await kvGet<Bucket>(`checkin:rl:${scope}:${hash(who)}`);
  return !b || now - b.since > windowMs || b.n < max;
}

export async function noteHit(scope: string, who: string, windowMs: number, now = Date.now()) {
  const key = `checkin:rl:${scope}:${hash(who)}`;
  const b = await kvGet<Bucket>(key);
  const cur = !b || now - b.since > windowMs ? { since: now, n: 0 } : b;
  await kvSet(key, { ...cur, n: cur.n + 1 });
}

export const clientKey = (req: Request) => (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
export { WINDOW_MS, MAX_TRIES };
