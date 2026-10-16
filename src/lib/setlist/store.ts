import { SONGS, songById, stylesFor, songsInStyle } from "./catalog";
import type { Answer, FlowId, FlowState, Mark, Person, Store, View } from "./types";

const KEY = (token: string) => `setlist:${token}`;

export const emptyFlow = (): FlowState => ({ people: {}, marks: {}, notes: "", sent: false });
export const emptyPerson = (): Person => ({ step: "styles", styles: [], cleanOnly: true, deck: [], index: 0, answers: {} });

export const initialStore = (): Store => ({
  v: 2,
  lang: "en",
  view: { screen: "home" },
  flows: { reception: emptyFlow(), ceremony: emptyFlow() },
});

export function loadStore(token: string): Store {
  try {
    const raw = window.localStorage.getItem(KEY(token));
    if (!raw) return initialStore();
    const s = JSON.parse(raw) as Store;
    if (s?.v !== 2) return initialStore();
    return s;
  } catch {
    return initialStore();
  }
}

export function saveStore(token: string, s: Store) {
  try {
    window.localStorage.setItem(KEY(token), JSON.stringify(s));
  } catch {
    // private mode or full storage: the page still works, it just can't resume
  }
}

// Round-robin across the chosen styles so each card changes genre.
export function buildDeck(flow: FlowId, styles: string[], cleanOnly: boolean, skipIds: Set<string>): string[] {
  const order = stylesFor(flow).map((s) => s.id).filter((id) => styles.includes(id));
  const lists = order.map((id) => songsInStyle(id, cleanOnly).filter((s) => !skipIds.has(s.id)).map((s) => s.id));
  const out: string[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

export function startDeck(p: Person, flow: FlowId): Person {
  const answered = p.deck.slice(0, p.index);
  const fresh = buildDeck(flow, p.styles, p.cleanOnly, new Set(answered));
  const deck = [...answered, ...fresh];
  return { ...p, deck, index: answered.length, step: fresh.length ? "swipe" : "done" };
}

export function applyAnswer(f: FlowState, pid: string, answer: Answer): FlowState {
  const p = f.people[pid];
  const id = p?.deck[p.index];
  if (!p || !id) return f;
  const marks = { ...f.marks };
  if (answer === "love" && marks[id] !== "never") marks[id] = "must";
  const index = p.index + 1;
  const np: Person = { ...p, answers: { ...p.answers, [id]: answer }, index, step: index >= p.deck.length ? "done" : "swipe" };
  return { ...f, marks, people: { ...f.people, [pid]: np } };
}

export function undoAnswer(f: FlowState, pid: string): FlowState {
  const p = f.people[pid];
  if (!p || p.index <= 0) return f;
  const id = p.deck[p.index - 1];
  const answers = { ...p.answers };
  const was = answers[id];
  delete answers[id];
  const marks = { ...f.marks };
  if (was === "love" && marks[id] === "must") delete marks[id];
  return { ...f, marks, people: { ...f.people, [pid]: { ...p, answers, index: p.index - 1, step: "swipe" } } };
}

export function toggleLike(f: FlowState, pid: string, songId: string): FlowState {
  const p = f.people[pid];
  if (!p) return f;
  const cur = p.answers[songId];
  const next: Answer = cur === "like" || cur === "love" ? "skip" : "like";
  const marks = { ...f.marks };
  if (next === "skip" && marks[songId] === "must") delete marks[songId];
  return { ...f, marks, people: { ...f.people, [pid]: { ...p, answers: { ...p.answers, [songId]: next } } } };
}

export function toggleMark(f: FlowState, songId: string, mark: Mark): FlowState {
  const marks = { ...f.marks };
  if (marks[songId] === mark) delete marks[songId];
  else marks[songId] = mark;
  return { ...f, marks };
}

export const isApproved = (p: Person | undefined, id: string) => p?.answers[id] === "like" || p?.answers[id] === "love";

// ---- results ----
export type ResultView = {
  pids: string[];            // people who have answered something
  both: string[];            // song ids both partners like (only when two partners)
  approved: Record<string, string[]>; // per pid: approved song ids, deck order, never excluded
  skipped: Record<string, string[]>;
  must: string[];
  never: string[];
};

export function resultFor(f: FlowState): ResultView {
  const pids = Object.keys(f.people).filter((pid) => Object.keys(f.people[pid].answers).length > 0);
  const approved: Record<string, string[]> = {};
  const skipped: Record<string, string[]> = {};
  for (const pid of pids) {
    const p = f.people[pid];
    approved[pid] = p.deck.filter((id) => isApproved(p, id) && f.marks[id] !== "never");
    skipped[pid] = p.deck.filter((id) => p.answers[id] === "skip" && f.marks[id] !== "never");
  }
  const partners = pids.filter((p) => p === "a" || p === "b");
  const both = partners.length === 2 ? approved[partners[0]].filter((id) => approved[partners[1]].includes(id)) : [];
  const order = new Map(SONGS.map((s, i) => [s.id, i]));
  const sortSongs = (ids: string[]) => [...new Set(ids)].sort((x, y) => (order.get(x) ?? 0) - (order.get(y) ?? 0));
  const must = sortSongs(Object.keys(f.marks).filter((id) => f.marks[id] === "must"));
  const never = sortSongs(Object.keys(f.marks).filter((id) => f.marks[id] === "never"));
  return { pids, both, approved, skipped, must, never };
}

export const flowProgress = (f: FlowState): "none" | "partial" | "done" => {
  const ps = Object.values(f.people);
  if (!ps.length) return "none";
  if (ps.some((p) => p.step === "done")) return "done";
  return "partial";
};

export function setView(s: Store, view: View): Store {
  return { ...s, view };
}

export const songTitle = (id: string) => songById(id)?.title ?? id;
