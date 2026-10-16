"use client";

import { useState } from "react";
import { emptyPerson } from "@/lib/setlist/store";
import { songById } from "@/lib/setlist/catalog";
import type { Ctx } from "./ctx";

// First screen of the guest link: who the music is for, an optional first name, and Start.
export function WelcomeScreen({ c }: { c: Ctx }) {
  const { L, store, go, names, player, updFlow, setStore } = c;
  const [name, setName] = useState(store.guest?.name ?? "");
  const f = store.flows.reception;

  const start = () => {
    setStore((s) => (s.guest ? { ...s, guest: { ...s.guest, name: name.trim() } } : s));
    const p = f.people.solo;
    if (p?.step === "swipe") {
      // Came back with answers already saved: carry on where they stopped (the tap lets the clip play).
      const clip = p.deck[p.index] ? songById(p.deck[p.index])?.clip : undefined;
      if (clip) player.play(clip, { loop: true });
      return go({ screen: "swipe", flow: "reception", pid: "solo" });
    }
    if (p?.step === "done") return go({ screen: "thanks", flow: "reception" });
    updFlow("reception", (cur) => (cur.people.solo ? cur : { ...cur, people: { ...cur.people, solo: emptyPerson() } }));
    go({ screen: "styles", flow: "reception", pid: "solo" });
  };

  return (
    <div className="sl-welcome">
      <div className="sl-ambient" style={{ "--c": "#bc3021" } as React.CSSProperties} aria-hidden="true" />
      <span className="sl-hero" aria-hidden="true">🎶</span>
      <h1 className="sl-h1">{L.guestTitle(names.a, names.b)}</h1>
      <p className="sl-sub">{L.guestSub}</p>
      <input className="sl-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={L.guestName} aria-label={L.guestName} maxLength={40} autoComplete="given-name" />
      <div className="sl-sticky">
        <button className="sl-cta" onClick={start}>
          {L.start}
        </button>
      </div>
    </div>
  );
}
