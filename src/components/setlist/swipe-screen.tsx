"use client";

import { applyAnswer, DONE_PILL_LIKES, GUEST_MIN_SONGS, undoAnswer } from "@/lib/setlist/store";
import type { FlowId } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";
import { SwipeDeck } from "./swipe-deck";

export function SwipeScreen({ c, flow, pid }: { c: Ctx; flow: FlowId; pid: string }) {
  const { L, store, updFlow, go, player } = c;
  const p = store.flows[flow].people[pid];
  if (!p) return null;
  // Couple flow: once someone has liked enough songs, a quiet Done pill lets them jump to their results.
  const likes = Object.values(p.answers).filter((a) => a === "like" || a === "love").length;
  return (
    <SwipeDeck
      L={L}
      player={player}
      deck={p.deck}
      index={p.index}
      allowLove={!c.guest}
      onAnswer={(a) => updFlow(flow, (f) => applyAnswer(f, pid, a))}
      onUndo={() => updFlow(flow, (f) => undoAnswer(f, pid))}
      onFinish={() => go(c.guest ? { screen: "thanks", flow } : { screen: "results", flow, pid })}
      topExtra={
        !c.guest ? (
          likes >= DONE_PILL_LIKES && (
            <button
              className="sl-undo"
              onClick={() => {
                updFlow(flow, (f) => ({ ...f, people: { ...f.people, [pid]: { ...f.people[pid], step: "done" } } }));
                go({ screen: "results", flow, pid });
              }}
            >
              <span aria-hidden="true">→</span> <span className="lb">{L.donePill}</span>
            </button>
          )
        ) : (
          <>
            <button className="sl-undo sl-add" onClick={c.openAdd} aria-label={L.addSong}>
              ＋
            </button>
            {p.index >= GUEST_MIN_SONGS && (
              <button
                className="sl-undo sl-finish"
                onClick={() => {
                  updFlow(flow, (f) => ({ ...f, people: { ...f.people, [pid]: { ...f.people[pid], step: "done" } } }));
                  go({ screen: "thanks", flow });
                }}
              >
                {L.finish}
              </button>
            )}
          </>
        )
      }
    />
  );
}
