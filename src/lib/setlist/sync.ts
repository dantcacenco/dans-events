import { emptyFlow } from "./store";
import type { FlowId, FlowState } from "./types";

// Merging the couple's progress from two phones (or a phone and the server): each person's walk and the shared
// marks/notes are separate units, and the newer copy of each unit wins.
const FLOWS: FlowId[] = ["reception", "ceremony"];

export function mergeFlow(a: FlowState | undefined, b: FlowState | undefined): FlowState {
  const x = a ?? emptyFlow();
  const y = b ?? emptyFlow();
  const people = { ...x.people };
  for (const [pid, p] of Object.entries(y.people ?? {})) if (!people[pid] || (p.at ?? 0) > (people[pid].at ?? 0)) people[pid] = p;
  const meta = (y.metaAt ?? 0) > (x.metaAt ?? 0) ? y : x;
  return { people, marks: meta.marks ?? {}, notes: meta.notes ?? "", sent: !!meta.sent, hidden: meta.hidden ?? [], metaAt: meta.metaAt };
}

export function mergeFlows(a: Partial<Record<FlowId, FlowState>> | undefined, b: Partial<Record<FlowId, FlowState>> | undefined): Record<FlowId, FlowState> {
  return Object.fromEntries(FLOWS.map((f) => [f, mergeFlow(a?.[f], b?.[f])])) as Record<FlowId, FlowState>;
}

// Stamp what changed between two versions of a flow (called on every local edit).
export function stampFlow(prev: FlowState, next: FlowState, now = Date.now()): FlowState {
  if (prev === next) return next;
  let people = next.people;
  for (const [pid, p] of Object.entries(next.people)) {
    if (p !== prev.people[pid]) people = { ...people, [pid]: { ...p, at: now } };
  }
  const metaChanged = next.marks !== prev.marks || next.notes !== prev.notes || next.hidden !== prev.hidden || next.sent !== prev.sent;
  return { ...next, people, metaAt: metaChanged ? now : next.metaAt };
}

// Light shape check for anything that arrives from a browser.
const ID = /^[a-z0-9-]{1,60}$/;
const PIDS = new Set(["a", "b", "solo"]);
const ANSWERS = new Set(["like", "skip", "love"]);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(v, Date.now() + 60_000) : 0);
const ids = (v: unknown, max: number) => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && ID.test(x)))].slice(0, max) : []);

export function cleanFlows(input: unknown): Record<FlowId, FlowState> {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out = {} as Record<FlowId, FlowState>;
  for (const flow of FLOWS) {
    const f = (src[flow] && typeof src[flow] === "object" ? src[flow] : {}) as Record<string, unknown>;
    const people: FlowState["people"] = {};
    const ps = (f.people && typeof f.people === "object" ? f.people : {}) as Record<string, Record<string, unknown>>;
    for (const [pid, p] of Object.entries(ps)) {
      if (!PIDS.has(pid) || !p || typeof p !== "object") continue;
      const answers: Record<string, "like" | "skip" | "love"> = {};
      const raw = (p.answers && typeof p.answers === "object" ? p.answers : {}) as Record<string, unknown>;
      for (const [id, a] of Object.entries(raw).slice(0, 600)) if (ID.test(id) && typeof a === "string" && ANSWERS.has(a)) answers[id] = a as "like";
      const deck = ids(p.deck, 600);
      const step = p.step === "swipe" || p.step === "done" ? p.step : "styles";
      people[pid] = { step, styles: ids(p.styles, 30), cleanOnly: p.cleanOnly !== false, deck, index: Math.max(0, Math.min(deck.length, Math.floor(num(p.index)))), answers, at: num(p.at) };
    }
    const marks: FlowState["marks"] = {};
    const rm = (f.marks && typeof f.marks === "object" ? f.marks : {}) as Record<string, unknown>;
    for (const [id, m] of Object.entries(rm).slice(0, 600)) if (ID.test(id) && (m === "must" || m === "never")) marks[id] = m;
    const hidden = Array.isArray(f.hidden) ? f.hidden.filter((x): x is string => typeof x === "string" && x.length <= 200).slice(0, 200) : [];
    out[flow] = { people, marks, notes: typeof f.notes === "string" ? f.notes.slice(0, 4000) : "", sent: f.sent === true, hidden, metaAt: num(f.metaAt) };
  }
  return out;
}
