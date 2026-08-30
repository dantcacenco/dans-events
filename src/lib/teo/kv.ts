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
  const data = await readFile();
  delete data[key];
  await writeFile(data);
}
