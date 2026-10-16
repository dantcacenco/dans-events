"use client";

import { useState, type CSSProperties } from "react";
import { sampleFor, songById, stylesFor } from "@/lib/setlist/catalog";
import { GUEST_MAX_SONGS, startDeck } from "@/lib/setlist/store";
import type { FlowId } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";

const SAMPLE_SECONDS = 11;

export function StylesScreen({ c, flow, pid }: { c: Ctx; flow: FlowId; pid: string }) {
  const { L, lang, store, updFlow, go, player } = c;
  const p = store.flows[flow].people[pid];
  const [cur, setCur] = useState(0);
  if (!p) return null;
  const styles = stylesFor(flow);
  const setP = (patch: Partial<typeof p>) => updFlow(flow, (f) => ({ ...f, people: { ...f.people, [pid]: { ...f.people[pid], ...patch } } }));
  const toggle = (id: string) => setP({ styles: p.styles.includes(id) ? p.styles.filter((x) => x !== id) : [...p.styles, id] });

  const next = () => {
    const np = startDeck(p, flow, c.guest ? GUEST_MAX_SONGS : Infinity);
    updFlow(flow, (f) => ({ ...f, people: { ...f.people, [pid]: np } }));
    if (np.step === "done") return go(c.guest ? { screen: "thanks", flow } : { screen: "results", flow, pid });
    const first = np.deck[np.index];
    // Called inside the Continue tap so iOS lets the first song start by itself.
    const clip = first ? songById(first)?.clip : undefined;
    if (clip) player.play(clip, { loop: true });
    go({ screen: "swipe", flow, pid });
  };

  return (
    <>
      <div className="sl-ambient" style={{ "--c": styles[cur]?.color } as CSSProperties} aria-hidden="true" />
      <h1 className="sl-h1">{flow === "ceremony" ? L.stylesTitleCeremony : L.stylesTitleReception}</h1>
      <div
        className="sl-grid"
        onScroll={(e) => {
          const g = e.currentTarget;
          const card = g.firstElementChild as HTMLElement | null;
          if (card) setCur(Math.max(0, Math.min(styles.length - 1, Math.round(g.scrollLeft / (card.offsetWidth + 14)))));
        }}
      >
        {styles.map((st) => {
          const sample = sampleFor(st.id, p.cleanOnly && flow === "reception");
          const on = p.styles.includes(st.id);
          const playing = !!sample && player.playing && player.src?.endsWith(sample.clip);
          const name = lang === "ru" ? st.nameRu : st.name;
          return (
            <div
              key={st.id}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              className={`sl-style ${playing ? "is-playing" : ""}`}
              style={{ "--c": st.color } as CSSProperties}
              onClick={() => toggle(st.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(st.id))}
            >
              <span className="sl-art">
                <span className="sl-hero emoji" aria-hidden="true">{st.emoji}</span>
              </span>
              <span className="name">{name}</span>
              <button
                className="sl-circle"
                aria-label={`${playing ? L.pause : L.play}: ${name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (sample) player.toggle(sample.clip, { limit: SAMPLE_SECONDS });
                }}
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <span className="sl-check" aria-hidden="true">✓</span>
            </div>
          );
        })}
      </div>
      <div className="sl-dots" aria-hidden="true">
        {styles.map((st, i) => (
          <i key={st.id} className={`${p.styles.includes(st.id) ? "on" : ""} ${i === cur ? "cur" : ""}`} />
        ))}
      </div>
      {flow === "reception" && (
        <button className="sl-clean" aria-pressed={p.cleanOnly} onClick={() => setP({ cleanOnly: !p.cleanOnly })}>
          <span>{L.cleanOnly}</span>
          <span className="sl-switch" aria-hidden="true" />
        </button>
      )}
      {c.guest && (
        <button className="sl-link sl-add-link" onClick={c.openAdd}>
          ＋ {L.addSong}
        </button>
      )}
      <div className="sl-sticky">
        <button className="sl-cta" disabled={p.styles.length === 0} onClick={next}>
          {p.styles.length === 0 ? L.chooseOne : (
            <>
              {L.continueBtn} <span className="sl-cta-n">{p.styles.length}</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
