import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny key/value seam for the /teo feature.
 *
 * On Vercel (KV_REST_API_URL present) this is @vercel/kv, same as pixel-mob.
 * Locally there are no KV credentials, so it falls back to a JSON file under
 * .data/ — that keeps `npm run dev` and the admin builder usable with no setup.
 */

export const usingKv = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

const FILE = path.join(process.cwd(), ".data", "teo.json");

async function readFile(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeFile(data: Record<string, unknown>) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

/** Thrown when the store cannot be reached, so callers can report it. */
export class StoreUnavailableError extends Error {
  constructor(cause: unknown) {
    super(
      "Could not reach the content store. Check that the Vercel KV / Upstash database still exists and its KV_REST_API_* vars are current."
    );
    this.cause = cause;
  }
}

async function client() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

/**
 * Forgiving read for rendering: an unreachable store shows an empty card
 * rather than taking the whole page down with a 500.
 *
 * Do NOT use this before a write — see kvGetOrThrow.
 */
export async function kvGet<T>(key: string): Promise<T | null> {
  if (usingKv) {
    try {
      return await (await client()).get<T>(key);
    } catch (error) {
      console.error(`[teo/kv] read failed for ${key}:`, error);
      return null;
    }
  }
  const data = await readFile();
  return (data[key] as T) ?? null;
}

/**
 * Strict read for read-modify-write paths.
 *
 * kvGet() degrading to null is right for rendering but catastrophic before a
 * write: a failed read would look like "no drops yet", and the write that
 * followed would replace the real list with an empty one. Mutations use this
 * and abort instead.
 */
export async function kvGetOrThrow<T>(key: string): Promise<T | null> {
  if (usingKv) {
    try {
      return await (await client()).get<T>(key);
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
  }
  const data = await readFile();
  return (data[key] as T) ?? null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (usingKv) {
    try {
      await (await client()).set(key, value);
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
    return;
  }
  const data = await readFile();
  data[key] = value;
  await writeFile(data);
}

export async function kvDel(key: string): Promise<void> {
  if (usingKv) {
    try {
      await (await client()).del(key);
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
    return;
  }
  await mutateFile((data) => {
    delete data[key];
  });
}

/** Every key that starts with `prefix` (used to delete everything a record owns). */
export async function kvKeys(prefix: string): Promise<string[]> {
  if (usingKv) {
    try {
      const c = await client();
      const out: string[] = [];
      for await (const key of c.scanIterator({ match: `${prefix}*`, count: 500 })) out.push(key);
      return out;
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
  }
  return Object.keys(await readFile()).filter((key) => key.startsWith(prefix));
}

/** Fetch many keys in one round trip (missing keys come back as null). */
export async function kvMany<T>(keys: string[]): Promise<(T | null)[]> {
  if (!keys.length) return [];
  if (usingKv) {
    try {
      return await (await client()).mget<(T | null)[]>(...keys);
    } catch (error) {
      console.error(`[teo/kv] mget failed:`, error);
      return keys.map(() => null);
    }
  }
  const data = await readFile();
  return keys.map((key) => (data[key] as T) ?? null);
}

// ---- Atomic counters and expiring keys (login attempt limiting). Locally these use the same .data file. ----
type Expiring<T> = { v: T; exp: number };

// Local file fallback only: run read-modify-write steps one at a time so parallel requests don't overwrite each other.
let fileQueue: Promise<unknown> = Promise.resolve();
function mutateFile<R>(fn: (data: Record<string, unknown>) => R): Promise<R> {
  const run = fileQueue.then(async () => {
    const data = await readFile();
    const out = fn(data);
    await writeFile(data);
    return out;
  });
  fileQueue = run.catch(() => undefined);
  return run;
}

/** Atomic add of 1 (Upstash INCR). The key expires `ttlSeconds` after it was created. Returns the new count. Throws if the store is unreachable. */
export async function kvIncr(key: string, ttlSeconds: number): Promise<number> {
  if (usingKv) {
    try {
      const c = await client();
      const n = await c.incr(key);
      if (n === 1) await c.expire(key, ttlSeconds);
      return n;
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
  }
  return mutateFile((data) => {
    const cur = data[key] as Expiring<number> | undefined;
    const live = cur && cur.exp > Date.now() ? cur : { v: 0, exp: Date.now() + ttlSeconds * 1000 };
    const next = { v: live.v + 1, exp: live.exp };
    data[key] = next;
    return next.v;
  });
}

/** Subtract 1 from a counter (never below 0). */
export async function kvDecr(key: string): Promise<void> {
  if (usingKv) {
    try {
      const c = await client();
      if ((await c.decr(key)) < 0) await c.del(key);
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
    return;
  }
  await mutateFile((data) => {
    const cur = data[key] as Expiring<number> | undefined;
    if (cur && cur.exp > Date.now()) data[key] = { v: Math.max(0, cur.v - 1), exp: cur.exp };
  });
}

/** Set a value that disappears by itself after `ttlSeconds`. */
export async function kvSetEx<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (usingKv) {
    try {
      await (await client()).set(key, value, { ex: ttlSeconds });
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
    return;
  }
  await mutateFile((data) => {
    data[key] = { v: value, exp: Date.now() + ttlSeconds * 1000 } satisfies Expiring<T>;
  });
}

/** Read a key written by kvSetEx. Strict: throws if the store is unreachable (callers fail closed). */
export async function kvGetEx<T>(key: string): Promise<T | null> {
  if (usingKv) {
    try {
      return await (await client()).get<T>(key);
    } catch (error) {
      throw new StoreUnavailableError(error);
    }
  }
  const cur = (await readFile())[key] as Expiring<T> | undefined;
  return cur && cur.exp > Date.now() ? cur.v : null;
}
