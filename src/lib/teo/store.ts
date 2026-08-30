import { kvGet, kvGetOrThrow, kvSet } from "./kv";
import { DEFAULT_GIVE, type Drop, type GiveConfig, type Subscriber } from "./types";

const P = "teo";
const k = {
  drops: `${P}:drops`,
  give: `${P}:give`,
  subscribers: `${P}:subscribers`,
};

/* ---------------------------------- drops --------------------------------- */

export async function getDrops(): Promise<Drop[]> {
  const drops = (await kvGet<Drop[]>(k.drops)) ?? [];
  return [...drops].sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPublishedDrops(): Promise<Drop[]> {
  return (await getDrops()).filter((d) => d.published);
}

export async function saveDrop(drop: Drop): Promise<Drop> {
  // Strict read: a degraded read here would wipe every existing drop.
  const drops = (await kvGetOrThrow<Drop[]>(k.drops)) ?? [];
  const index = drops.findIndex((d) => d.id === drop.id);
  if (index >= 0) drops[index] = drop;
  else drops.push(drop);
  await kvSet(k.drops, drops);
  return drop;
}

export async function deleteDrop(id: string): Promise<void> {
  const drops = (await kvGetOrThrow<Drop[]>(k.drops)) ?? [];
  await kvSet(
    k.drops,
    drops.filter((d) => d.id !== id)
  );
}

/* ----------------------------------- give ---------------------------------- */

export async function getGive(): Promise<GiveConfig> {
  return (await kvGet<GiveConfig>(k.give)) ?? DEFAULT_GIVE;
}

export async function saveGive(config: GiveConfig): Promise<GiveConfig> {
  await kvSet(k.give, config);
  return config;
}

/* -------------------------------- subscribers ------------------------------ */

export async function getSubscribers(): Promise<Subscriber[]> {
  return (await kvGet<Subscriber[]>(k.subscribers)) ?? [];
}

/** Returns false when the email was already on the list. */
export async function addSubscriber(
  email: string,
  source: string
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  // Strict read: a degraded read here would wipe the whole email list.
  const subscribers = (await kvGetOrThrow<Subscriber[]>(k.subscribers)) ?? [];
  if (subscribers.some((s) => s.email === normalized)) return false;

  subscribers.push({ email: normalized, createdAt: Date.now(), source });
  await kvSet(k.subscribers, subscribers);
  return true;
}
