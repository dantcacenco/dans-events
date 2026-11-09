// Client-side outbox: a registration is written here before it is sent, so a dropped connection never loses it.
import type { XmasInput } from "./logic";

export type QueueItem = XmasInput & { id: string; update?: boolean; queuedAt: number };

const KEY = "xm_queue_v1";

export function readQueue(): QueueItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function write(q: QueueItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(q));
  } catch {}
}
export function enqueue(item: QueueItem) {
  write([...readQueue().filter((x) => x.id !== item.id), item]);
}
export function dequeue(id: string) {
  write(readQueue().filter((x) => x.id !== id));
}

export type SendOutcome = "ok" | "duplicate" | "retry" | "drop";
export type SendResult = { outcome: SendOutcome; existing?: { first: string; party: number; santa: boolean }; status?: string };

export async function send(item: Omit<QueueItem, "queuedAt">, timeoutMs = 8000): Promise<SendResult> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch("/api/christmas-checkin/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item), signal: ctl.signal, cache: "no-store" });
    if (res.status === 400 || res.status === 413) return { outcome: "drop" }; // will never succeed
    if (!res.ok) return { outcome: "retry" }; // 429, 5xx
    const data = await res.json();
    if (data.status === "duplicate") return { outcome: "duplicate", existing: data.existing };
    return { outcome: "ok", status: data.status };
  } catch {
    return { outcome: "retry" };
  } finally {
    clearTimeout(timer);
  }
}

// Send everything waiting. Returns how many are still waiting.
export async function flush(): Promise<number> {
  for (const item of readQueue()) {
    const r = await send(item);
    if (r.outcome === "retry") break;
    dequeue(item.id);
  }
  return readQueue().length;
}

export { newId } from "../checkin/queue";
