import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { kvGet, kvSet } from "@/lib/teo/kv";

// Dan's admin page for the set-list pages (/admin/songs). One password, kept in the Vercel env var SETLIST_ADMIN_PASSWORD.
// The session cookie is signed with a key derived from the password, so rotating the password signs everyone out.
export const COOKIE = "sl_admin";
const SESSION_MS = 14 * 24 * 3600 * 1000;
const MAX_TRIES = 8; // per device per 15 minutes
const WINDOW_MS = 15 * 60 * 1000;

const password = () => process.env.SETLIST_ADMIN_PASSWORD ?? "";
export const adminConfigured = () => password().length >= 6;

const signKey = () => createHash("sha256").update(`setlist-admin:${password()}`).digest();
const sign = (exp: number) => createHmac("sha256", signKey()).update(String(exp)).digest("base64url");

export function sessionValue(now = Date.now()) {
  const exp = now + SESSION_MS;
  return { value: `${exp}.${sign(exp)}`, maxAge: SESSION_MS / 1000 };
}

export function validSession(value: string | undefined, now = Date.now()): boolean {
  if (!adminConfigured() || !value) return false;
  const [expRaw, sig] = value.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now || !sig) return false;
  const want = Buffer.from(sign(exp));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function passwordMatches(input: unknown): boolean {
  if (!adminConfigured() || typeof input !== "string") return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(password()).digest();
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  return validSession((await cookies()).get(COOKIE)?.value);
}

// Login attempts per device (IP + browser), kept in KV so every server instance sees them.
type Tries = { since: number; n: number };
const triesKey = (ipKey: string) => `setlist:admin:login:${createHash("sha256").update(ipKey).digest("hex").slice(0, 20)}`;

export async function loginAllowed(ipKey: string, now = Date.now()): Promise<boolean> {
  const t = await kvGet<Tries>(triesKey(ipKey));
  return !t || now - t.since > WINDOW_MS || t.n < MAX_TRIES;
}

export async function noteFailedLogin(ipKey: string, now = Date.now()) {
  const t = await kvGet<Tries>(triesKey(ipKey));
  const cur = !t || now - t.since > WINDOW_MS ? { since: now, n: 0 } : t;
  await kvSet(triesKey(ipKey), { ...cur, n: cur.n + 1 });
}

export const ipKeyOf = (req: Request) =>
  `${(req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"}|${req.headers.get("user-agent") ?? ""}`;
