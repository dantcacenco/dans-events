import "server-only";
import { getCoupleState, guestVotes, listCouples } from "../couple-store";
import { masterFromData } from "../guest-store";
import { buildMaster, couplePicks, type MasterItem } from "../master";
import { flowProgress, resultFor } from "../store";
import type { CoupleInfo, CoupleState, FlowId, FlowState, StoredGuestVote } from "../types";

// What the admin page shows. Song ids are resolved to titles in the browser (the catalog ships with the page).
export type FlowSummary = {
  progress: "none" | "partial" | "done";
  people: { pid: string; step: string; styles: string[]; answered: number; liked: string[]; loved: string[] }[];
  both: string[];
  must: string[];
  never: string[];
  notes: string;
  sent: boolean;
};

export type CoupleRow = CoupleInfo & {
  stats: {
    partnersDone: number; // partners (or "both of us") who finished at least one flow
    partnersStarted: number;
    guests: number;
    lastActivity: number;
    flows: Record<FlowId, FlowSummary["progress"]>;
  };
};

export type CoupleDetail = {
  couple: CoupleRow;
  flows: Record<FlowId, FlowSummary>;
  guests: StoredGuestVote[];
  master: { songs: MasterItem[]; extras: MasterItem[]; guests: number };
};

const FLOWS: FlowId[] = ["reception", "ceremony"];

function summarize(f: FlowState | undefined): FlowSummary {
  if (!f) return { progress: "none", people: [], both: [], must: [], never: [], notes: "", sent: false };
  const r = resultFor(f);
  const people = Object.entries(f.people).map(([pid, p]) => ({
    pid,
    step: p.step,
    styles: p.styles,
    answered: Object.keys(p.answers).length,
    liked: r.approved[pid] ?? [],
    loved: Object.keys(p.answers).filter((id) => p.answers[id] === "love"),
  }));
  return { progress: flowProgress(f), people, both: r.both, must: r.must, never: r.never, notes: f.notes, sent: f.sent };
}

function row(info: CoupleInfo, state: CoupleState | null, votes: StoredGuestVote[]): CoupleRow {
  const done = new Set<string>();
  const started = new Set<string>();
  for (const flow of FLOWS)
    for (const [pid, p] of Object.entries(state?.flows[flow]?.people ?? {})) {
      if (Object.keys(p.answers).length) started.add(pid);
      if (p.step === "done") done.add(pid);
    }
  const lastActivity = Math.max(info.createdAt, state?.at ?? 0, ...votes.map((v) => v.at), ...Object.values(info.submitted ?? {}).map(Number));
  return {
    ...info,
    stats: {
      partnersDone: done.size,
      partnersStarted: started.size,
      guests: votes.filter((v) => v.likes.length || v.skips.length || v.extras.length).length,
      lastActivity,
      flows: { reception: state ? flowProgress(state.flows.reception) : "none", ceremony: state ? flowProgress(state.flows.ceremony) : "none" },
    },
  };
}

export async function adminCouples(): Promise<CoupleRow[]> {
  const couples = await listCouples();
  const rows = await Promise.all(couples.map(async (c) => row(c, await getCoupleState(c.token), await guestVotes(c.token))));
  return rows.sort((a, b) => b.stats.lastActivity - a.stats.lastActivity);
}

export async function adminCouple(info: CoupleInfo): Promise<CoupleDetail> {
  const [state, votes] = await Promise.all([getCoupleState(info.token), guestVotes(info.token)]);
  const reception = state?.flows.reception;
  const data = masterFromData(reception ? couplePicks(reception) : null, votes);
  const built = buildMaster(data, reception);
  return {
    couple: row(info, state, votes),
    flows: { reception: summarize(reception), ceremony: summarize(state?.flows.ceremony) },
    guests: votes.sort((a, b) => b.at - a.at),
    master: { ...built, guests: data.guests },
  };
}
