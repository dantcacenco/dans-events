import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
// Rate-limit buckets live in KV (shared by every server instance); reuse the Youth Camp helpers.
import { clientKey, noteHit, underLimit } from "../checkin/auth";

// Christmas admin login. The password is only ever in the env var CHRISTMAS_ADMIN_PASSWORD (never in source).
// It is deliberately NOT the Youth Camp PIN or the set-list admin password: this admin is separate.
export const ADMIN_COOKIE = "xmas_admin";
const SESSION_MS = 7 * 24 * 3600 * 1000;
export const MAX_TRIES = 6; // wrong tries per IP ...
export const WINDOW_MS = 15 * 60 * 1000; // ... per 15 minutes
export const GLOBAL_MAX = 120; // wrong tries from everywhere per hour (stops a spread-out guessing run)
export const GLOBAL_WINDOW_MS = 60 * 60 * 1000;

const secret = () => {
  const s = process.env.CHRISTMAS_ADMIN_PASSWORD ?? "";
  return s.length >= 4 ? s : "";
};
export const adminConfigured = () => secret() !== "";

const signKey = () => createHash("sha256").update(`christmas-admin:${secret()}`).digest();
const sign = (exp: number) => createHmac("sha256", signKey()).update(String(exp)).digest("base64url");

export function adminSession(now = Date.now()) {
  const exp = now + SESSION_MS;
  return { value: `${exp}.${sign(exp)}`, maxAge: SESSION_MS / 1000 };
}

export function validAdminSession(value: string | undefined, now = Date.now()): boolean {
  if (!adminConfigured() || !value) return false;
  const [expRaw, sig] = value.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now || !sig) return false;
  const want = Buffer.from(sign(exp));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

// Hash both sides first so length never leaks, then compare in constant time.
export function passwordMatches(input: unknown): boolean {
  const s = secret();
  if (!s || typeof input !== "string" || !input) return false;
  const a = createHash("sha256").update(input.trim()).digest();
  return timingSafeEqual(a, createHash("sha256").update(s).digest());
}

export async function isAdmin(): Promise<boolean> {
  return validAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function loginAllowed(req: Request): Promise<boolean> {
  return (await underLimit("xmas-login", clientKey(req), MAX_TRIES, WINDOW_MS)) && (await underLimit("xmas-login-all", "all", GLOBAL_MAX, GLOBAL_WINDOW_MS));
}
export async function noteBadLogin(req: Request) {
  await noteHit("xmas-login", clientKey(req), WINDOW_MS);
  await noteHit("xmas-login-all", "all", GLOBAL_WINDOW_MS);
}
export { clientKey, noteHit, underLimit };
