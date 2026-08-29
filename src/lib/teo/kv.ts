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

export async function kvGet<T>(key: string): Promise<T | null> {
  if (usingKv) {
    const { kv } = await import("@vercel/kv");
    return await kv.get<T>(key);
  }
  const data = await readFile();
  return (data[key] as T) ?? null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (usingKv) {
    const { kv } = await import("@vercel/kv");
    await kv.set(key, value);
    return;
  }
  const data = await readFile();
  data[key] = value;
  await writeFile(data);
}

export async function kvDel(key: string): Promise<void> {
  if (usingKv) {
    const { kv } = await import("@vercel/kv");
    await kv.del(key);
    return;
  }
  const data = await readFile();
  delete data[key];
  await writeFile(data);
}
