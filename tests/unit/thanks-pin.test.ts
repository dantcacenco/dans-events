import { beforeEach, describe, expect, it, vi } from "vitest";

// In-memory stand-in for the KV helpers (same contract, with expiry on the fake clock below).
const store = new Map<string, { v: unknown; exp: number }>();
let clock = 1_700_000_000_000;
const live = (k: string) => {
  const e = store.get(k);
  return e && e.exp > clock ? e : undefined;
};
vi.mock("@/lib/teo/kv", () => ({
  kvIncr: async (k: string, ttl: number) => {
    const e = live(k) ?? { v: 0, exp: clock + ttl * 1000 };
    e.v = (e.v as number) + 1;
    store.set(k, e);
    return e.v as number;
  },
  kvDecr: async (k: string) => {
    const e = live(k);
    if (e) e.v = Math.max(0, (e.v as number) - 1);
  },
  kvDel: async (k: string) => void store.delete(k),
  kvSetEx: async (k: string, v: unknown, ttl: number) => void store.set(k, { v, exp: clock + ttl * 1000 }),
  kvGetEx: async (k: string) => (live(k)?.v as never) ?? null,
}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

import { attemptLogin, hashPin, lockSeconds, pinMatches, sessionValue, validSession } from "@/lib/thanks/auth";
import { randomPin, weak } from "../../scripts/thanks-pin.mjs";

const PIN = "482917";
const hash = hashPin(PIN);

beforeEach(() => {
  store.clear();
  process.env.THANKS_PIN_HASH = hash;
});

describe("PIN hash and compare", () => {
  it("accepts only the right 6 digits", () => {
    expect(pinMatches(PIN)).toBe(true);
    expect(pinMatches("482918")).toBe(false);
    expect(pinMatches("48291")).toBe(false);
    expect(pinMatches("4829170")).toBe(false);
    expect(pinMatches(482917)).toBe(false);
    expect(pinMatches(undefined)).toBe(false);
    expect(pinMatches("000000")).toBe(false);
  });
  it("is salted and never contains the PIN", () => {
    expect(hashPin(PIN)).not.toBe(hashPin(PIN));
    expect(hash).toMatch(/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
    expect(hash).not.toContain(PIN);
  });
});

describe("session cookie", () => {
  it("is valid, expires, and dies when the PIN changes", () => {
    const { value } = sessionValue(clock);
    expect(validSession(value, clock)).toBe(true);
    expect(validSession(value, clock + 15 * 24 * 3600 * 1000)).toBe(false);
    expect(validSession(value + "x", clock)).toBe(false);
    expect(validSession(undefined, clock)).toBe(false);
    expect(validSession(value, clock, hashPin("907153"))).toBe(false);
  });
});

describe("attempt limiting", () => {
  it("counts wrong tries, then locks the IP for 15 min, then longer", async () => {
    for (let i = 1; i <= 4; i++) {
      const r = await attemptLogin("1.1.1.1", "111222", clock);
      expect(r).toEqual({ ok: false, reason: "wrong", left: 5 - i });
    }
    const fifth = await attemptLogin("1.1.1.1", "111222", clock);
    expect(fifth).toEqual({ ok: false, reason: "locked", retryAfter: 900 });
    // even the right PIN is refused while locked
    expect(await attemptLogin("1.1.1.1", PIN, clock)).toMatchObject({ ok: false, reason: "locked" });
    // another IP is unaffected
    expect(await attemptLogin("2.2.2.2", PIN, clock)).toEqual({ ok: true });
    // after 15 min the IP can try again; the next lockout is 30 min
    clock += 901_000;
    for (let i = 0; i < 4; i++) await attemptLogin("1.1.1.1", "111222", clock);
    expect(await attemptLogin("1.1.1.1", "111222", clock)).toEqual({ ok: false, reason: "locked", retryAfter: 1800 });
    expect(lockSeconds(10, 24 * 3600)).toBe(24 * 3600);
  });

  it("a right PIN opens and clears that IP's count", async () => {
    await attemptLogin("3.3.3.3", "111222", clock);
    await attemptLogin("3.3.3.3", "111222", clock);
    expect(await attemptLogin("3.3.3.3", PIN, clock)).toEqual({ ok: true });
    expect(await attemptLogin("3.3.3.3", "111222", clock)).toEqual({ ok: false, reason: "wrong", left: 4 });
  });

  it("guesses sent at the same moment still hit the limit", async () => {
    const results = await Promise.all(Array.from({ length: 12 }, (_, i) => attemptLogin("4.4.4.4", String(100000 + i), clock)));
    expect(results.filter((r) => r.ok)).toHaveLength(0);
    expect(results.filter((r) => r.ok === false && r.reason === "wrong").length).toBeLessThanOrEqual(4);
  });

  it("all IPs together are limited too", async () => {
    let last;
    for (let i = 0; i < 15; i++) last = await attemptLogin(`9.9.9.${i}`, "111222", clock);
    expect(last).toEqual({ ok: false, reason: "locked", retryAfter: 900 });
    expect(await attemptLogin("8.8.8.8", PIN, clock)).toMatchObject({ ok: false, reason: "locked" });
  });

  it("refuses everything when no PIN is configured", async () => {
    process.env.THANKS_PIN_HASH = "";
    expect(await attemptLogin("5.5.5.5", PIN, clock)).toEqual({ ok: false, reason: "not-configured" });
  });
});

describe("PIN generator", () => {
  it("never makes patterned or date-like PINs", () => {
    for (const p of ["123456", "654321", "111111", "121212", "123123", "123321", "110624", "241106", "200426", "202611", "112233"]) expect(weak(p)).not.toBeNull();
    for (let i = 0; i < 300; i++) expect(weak(randomPin())).toBeNull();
  });
});
