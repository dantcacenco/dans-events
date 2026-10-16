"use client";

import { flowProgress } from "@/lib/setlist/store";
import type { FlowId } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";

export function HomeScreen({ c }: { c: Ctx }) {
  const { L, store, go } = c;
  const card = (flow: FlowId, title: string, sub: string, emoji: string) => {
    const prog = flowProgress(store.flows[flow]);
    return (
      <button
        key={flow}
        className={`sl-big sl-big--${flow}`}
        onClick={() => {
          // Both partners (or the single picker) finished: show the results. Otherwise let the next person pick.
          const ppl = store.flows[flow].people;
          const finished = ppl.solo?.step === "done" || (ppl.a?.step === "done" && ppl.b?.step === "done");
          go({ screen: finished ? "results" : "who", flow });
        }}
      >
        <span className="emoji" aria-hidden="true">{emoji}</span>
        <h2 className={flow === "ceremony" ? "sl-serif" : ""}>{title}</h2>
        <p>{sub}</p>
        <span className={`sl-pill ${prog === "done" ? "sl-pill--done" : ""}`}>
          {prog === "none" ? L.notStarted : prog === "partial" ? L.inProgress : `✓ ${L.finished}`}
        </span>
      </button>
    );
  };
  return (
    <>
      <h1 className="sl-h1">{L.homeTitle}</h1>
      <p className="sl-sub">{L.homeSub}</p>
      {card("ceremony", L.ceremonyCard, L.ceremonySub, "💍")}
      {card("reception", L.receptionCard, L.receptionSub, "🎉")}
    </>
  );
}
