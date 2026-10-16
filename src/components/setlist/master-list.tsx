"use client";

import { buildMaster, type MasterItem } from "@/lib/setlist/master";
import { toggleMark } from "@/lib/setlist/store";
import type { MasterData } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";

// The master list: every song anyone liked or added, with how many people chose it, most popular first.
// Section 1 is the catalog, section 2 the songs guests added. The couple can star and remove; guests only look.
export function MasterList({ c, data, readOnly }: { c: Ctx; data: MasterData | null; readOnly: boolean }) {
  const { L, store, player, updFlow } = c;
  const f = store.flows.reception;
  const { songs, extras } = buildMaster(data, readOnly ? undefined : f);
  const removed = (data?.extras ?? []).filter((x) => f.hidden.includes(x.key)).length;

  const row = (it: MasterItem) => {
    const playing = !!it.clip && player.playing && player.src?.endsWith(it.clip);
    return (
      <div key={it.id} className={`sl-row ${it.must ? "must" : ""}`}>
        {it.clip ? (
          <button className="sl-ic play" aria-label={`${playing ? L.pause : L.play}: ${it.title}`} onClick={() => player.toggle(it.clip!, { loop: false })}>
            {playing ? "❚❚" : "▶"}
          </button>
        ) : (
          <span className="sl-ic" aria-hidden="true">♪</span>
        )}
        <div className="t">
          <b>{it.title}</b>
          <span>{it.artist}{it.explicit ? ` · ${L.explicitTag}` : ""}</span>
        </div>
        <span className="sl-badge" aria-label={L.peopleLabel(it.count)}>{it.count}</span>
        {!readOnly && !it.extra && (
          <>
            <button className="sl-ic flag" aria-pressed={it.must} aria-label={L.flag} onClick={() => updFlow("reception", (x) => toggleMark(x, it.id, "must"))}>★</button>
            <button className="sl-ic x" aria-label={L.never} onClick={() => updFlow("reception", (x) => toggleMark(x, it.id, "never"))}>✕</button>
          </>
        )}
        {!readOnly && it.extra && (
          <button className="sl-ic x" aria-label={`${L.removeExtra}: ${it.title}`} onClick={() => updFlow("reception", (x) => ({ ...x, hidden: [...x.hidden, it.id] }))}>✕</button>
        )}
      </div>
    );
  };

  return (
    <div className="sl-master">
      <h2 className="sl-sec">{L.masterSongs} <small>{songs.length}</small></h2>
      {songs.map(row)}
      {extras.length > 0 && (
        <>
          <h2 className="sl-sec sl-sec--extras">{L.masterExtras} <small>{extras.length}</small></h2>
          {extras.map(row)}
        </>
      )}
      {!readOnly && removed > 0 && (
        <button className="sl-link" onClick={() => updFlow("reception", (x) => ({ ...x, hidden: [] }))}>
          {L.restoreRemoved} ({removed})
        </button>
      )}
    </div>
  );
}
