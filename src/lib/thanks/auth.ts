import "server-only";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { kvDecr, kvDel, kvGetEx, kvIncr, kvSetEx } from "@/lib/teo/kv";

// Login for the private thank-you tracker (/admin/thanks): a 6-digit PIN typed on a number keypad.
// The PIN itself is never stored anywhere. The Vercel env var THANKS_PIN_HASH holds "scrypt$<salt hex>$<hash hex>".
// The session cookie is signed with a key derived from that hash, so changing the PIN signs everyone out.
// The old /admin/songs password and its cookie do not work here.
export const PIN_COOKIE = "th_pin";
export const PIN_LENGTH = 6;
const SESSION_MS = 14 * 24 * 3600 * 1000;

// Attempt limits. Per IP: 5 wrong tries lock that IP for 15 min, and every further lockout doubles (30, 60 ... up to 24 h).
// Across all IPs: 15 wrong tries in 15 min lock everyone out for 15 min, doubling up to 6 h.
export const IP_MAX = 5;
export const GLOBAL_MAX = 15;
const WINDOW_S = 15 * 60;
const BASE_LOCK_S = 15 * 60;
const IP_LOCK_CAP_S = 24 * 3600;
const GLOBAL_LOCK_CAP_S = 6 * 3600;
const LEVEL_MEMORY_S = 7 * 24 * 3600; // how long a lockout counts toward the next, longer one

const pinHash = () => process.env.THANKS_PIN_HASH ?? "";
export const pinConfigured = () => /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/.test(pinHash());

/** The value to store in THANKS_PIN_HASH (scripts/thanks-pin.mjs makes the same format). */
export function hashPin(pin: string, salt: Buffer = randomBytes(16)): string {
  return `scrypt$${salt.toString("hex")}$${scryptSync(pin, salt, 64).toString("hex")}`;
}

const SIX_DIGITS = /^\d{6}$/;

export function pinMatches(input: unknown, stored: string = pinHash()): boolean {
  // Same work whatever the input looks like, so timing says nothing.
  const [, saltHex = "", hashHex = ""] = stored.split("$");
  const salt = Buffer.from(saltHex, "hex");
  const want = Buffer.from(hashHex, "hex");
  const wellFormed = typeof input === "string" && SIX_DIGITS.test(input);
  const got = scryptSync(wellFormed ? input : "000000", salt, 64);
  const same = want.length === got.length && timingSafeEqual(want, got);
  return same && wellFormed;
}

const signKey = (stored: string) => createHash("sha256").update(`thanks-pin-session:${stored}`).digest();
const sign = (exp: number, stored: string) => createHmac("sha256", signKey(stored)).update(String(exp)).digest("base64url");

export function sessionValue(now = Date.now(), stored: string = pinHash()) {
  const exp = now + SESSION_MS;
  return { value: `${exp}.${sign(exp, stored)}`, maxAge: SESSION_MS / 1000 };
}

export function validSession(value: string | undefined, now = Date.now(), stored: string = pinHash()): boolean {
  if (!stored || !value) return false;
  const [expRaw, sig] = value.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now || !sig) return false;
  const want = Buffer.from(sign(exp, stored));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

export async function isThanksAdmin(): Promise<boolean> {
  return pinConfigured() && validSession((await cookies()).get(PIN_COOKIE)?.value);
}

// ---- attempt limiting (state lives in KV so every server instance sees it) ----
const h = (s: string) => createHash("sha256").update(`thanks-pin-ip:${s}`).digest("hex").slice(0, 24);
export const clientIp = (req: Request) =>
  (req.headers.get("x-vercel-forwarded-for") ?? req.headers.get("x-real-ip") ?? (req.headers.get("x-forwarded-for") ?? "").split(",")[0]).trim() || "unknown";

const keys = (ip: string) => ({
  ipTries: `thanks:pin:tries:${h(ip)}`,
  ipLock: `thanks:pin:lock:${h(ip)}`,
  ipLevel: `thanks:pin:level:${h(ip)}`,
  gTries: "thanks:pin:g:tries",
  gLock: "thanks:pin:g:lock",
  gLevel: "thanks:pin:g:level",
});

export const lockSeconds = (level: number, cap: number) => Math.min(cap, BASE_LOCK_S * 2 ** Math.max(0, level - 1));

async function lockRemaining(key: string, now: number): Promise<number> {
  const until = await kvGetEx<number>(key);
  return until && until > now ? Math.ceil((until - now) / 1000) : 0;
}

async function applyLock(lockKey: string, levelKey: string, triesKey: string, cap: number, now: number) {
  const level = await kvIncr(levelKey, LEVEL_MEMORY_S);
  const secs = lockSeconds(level, cap);
  await kvSetEx(lockKey, now + secs * 1000, secs);
  await kvDel(triesKey);
  return secs;
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "locked"; retryAfter: number }
  | { ok: false; reason: "wrong"; left: number }
  | { ok: false; reason: "not-configured" };

/**
 * One login attempt. The attempt is counted BEFORE the PIN is checked, so many guesses sent at the same
 * moment still hit the limit. A correct PIN gives the attempt back. Throws if the store is unreachable
 * (the caller answers 503 and nobody gets in).
 */
export async function attemptLogin(ip: string, pin: unknown, now = Date.now()): Promise<LoginResult> {
  if (!pinConfigured()) return { ok: false, reason: "not-configured" };
  const k = keys(ip);
  const [lockIp, lockG] = await Promise.all([lockRemaining(k.ipLock, now), lockRemaining(k.gLock, now)]);
  if (lockIp || lockG) return { ok: false, reason: "locked", retryAfter: Math.max(lockIp, lockG) };

  const [nIp, nG] = await Promise.all([kvIncr(k.ipTries, WINDOW_S), kvIncr(k.gTries, WINDOW_S)]);
  if (nIp > IP_MAX || nG > GLOBAL_MAX) {
    const secs = nIp > IP_MAX ? await applyLock(k.ipLock, k.ipLevel, k.ipTries, IP_LOCK_CAP_S, now) : await applyLock(k.gLock, k.gLevel, k.gTries, GLOBAL_LOCK_CAP_S, now);
    return { ok: false, reason: "locked", retryAfter: secs };
  }

  if (pinMatches(pin)) {
    await Promise.all([kvDel(k.ipTries), kvDecr(k.gTries)]);
    return { ok: true };
  }
  if (nIp >= IP_MAX) return { ok: false, reason: "locked", retryAfter: await applyLock(k.ipLock, k.ipLevel, k.ipTries, IP_LOCK_CAP_S, now) };
  if (nG >= GLOBAL_MAX) return { ok: false, reason: "locked", retryAfter: await applyLock(k.gLock, k.gLevel, k.gTries, GLOBAL_LOCK_CAP_S, now) };
  return { ok: false, reason: "wrong", left: IP_MAX - nIp };
}
