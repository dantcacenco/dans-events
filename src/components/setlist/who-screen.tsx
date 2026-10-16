"use client";

import type { FlowId } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";
import { emptyPerson } from "@/lib/setlist/store";
import { songById } from "@/lib/setlist/catalog";

export function WhoScreen({ c, flow }: { c: Ctx; flow: FlowId }) {
  const { L, store, go, names, player, updFlow } = c;
  const f = store.flows[flow];
  const pick = (pid: string) => {
    const p = f.people[pid];
    if (p?.step === "swipe") {
      const id = p.deck[p.index];
      const s = id ? songById(id) : undefined;
      if (s) player.play(s.clip, { loop: true });
      go({ screen: "swipe", flow, pid });
    } else if (p?.step === "done") go({ screen: "results", flow, pid });
    else {
      updFlow(flow, (cur) => (cur.people[pid] ? cur : { ...cur, people: { ...cur.people, [pid]: emptyPerson() } }));
      go({ screen: "styles", flow, pid });
    }
  };
  const any = Object.values(f.people).some((p) => p.step === "done");
  const tick = (pid: string) => (f.people[pid]?.step === "done" ? <span className="sl-tick" aria-label={L.done}>✓</span> : null);
  return (
    <>
      <h1 className="sl-h1">{L.whoTitle}</h1>
      <div className="sl-who">
        {(["a", "b"] as const).map((pid) => (
          <button key={pid} className="sl-name" onClick={() => pick(pid)}>
            <span className="sl-hero">{names[pid]}</span>
            {tick(pid)}
          </button>
        ))}
        <button className="solo" onClick={() => pick("solo")}>
          <span>{L.justOne}</span>
          {tick("solo")}
        </button>
      </div>
      {any && (
        <button className="sl-link sl-see" onClick={() => go({ screen: "results", flow })}>
          {L.seeResults} →
        </button>
      )}
    </>
  );
}
