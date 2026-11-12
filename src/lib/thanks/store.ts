import "server-only";
import { kvGet, kvGetOrThrow, kvSet, usingKv } from "@/lib/teo/kv";
import { DEFAULT_TEMPLATES, mergeYears, type Templates, type ThanksData, type ThanksState } from "./messages";

// Server-side store for the private thank-you tracker. Contacts (names, phones, emails) live only here,
// never in the repo or the JS bundle; every read goes through the admin-only API.
const K = { data: "thanks:data:v1", state: "thanks:state:v1", templates: "thanks:templates:v1" };

async function kv() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getData(): Promise<ThanksData | null> {
  return kvGetOrThrow<ThanksData>(K.data);
}

export async function importData(incoming: ThanksData, years: number[]): Promise<ThanksData> {
  const merged = mergeYears(await kvGetOrThrow<ThanksData>(K.data), incoming, years);
  await kvSet(K.data, merged);
  return merged;
}

/** Checked rows. A KV hash, so two quick taps on different rows can never overwrite each other. */
export async function getState(): Promise<ThanksState> {
  if (usingKv) {
    const h = await (await kv()).hgetall<Record<string, number>>(K.state);
    return h ?? {};
  }
  return (await kvGet<ThanksState>(K.state)) ?? {};
}

export async function setContacted(id: string, on: boolean, now = Date.now()): Promise<void> {
  if (usingKv) {
    const c = await kv();
    if (on) await c.hset(K.state, { [id]: now });
    else await c.hdel(K.state, id);
    return;
  }
  const s = (await kvGet<ThanksState>(K.state)) ?? {};
  if (on) s[id] = now;
  else delete s[id];
  await kvSet(K.state, s);
}

export async function getTemplates(): Promise<Templates> {
  const t = await kvGet<Templates>(K.templates);
  return { ...DEFAULT_TEMPLATES, ...(t ?? {}) };
}

export async function setTemplates(t: Templates): Promise<void> {
  await kvSet(K.templates, t);
}
