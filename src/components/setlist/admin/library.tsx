"use client";

import { memo, useDeferredValue, useMemo, useState } from "react";
import { api, type Library } from "./api";
import { ClipButton, mmss } from "./shared";
import { SONGS, STYLES, styleById } from "@/lib/setlist/catalog";
import type { FlowId, Song } from "@/lib/setlist/types";

type Mode = "all" | "hidden" | "flagged";
type Clean = "all" | "clean" | "explicit";

const sourceLabel = (url: string) => {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    return h.includes("youtube") || h === "youtu.be" ? "YouTube" : h;
  } catch {
    return "Source";
  }
};

type RowProps = { song: Song; hidden: boolean; flagged: boolean; onHide: (id: string) => void; onFlag: (id: string) => void };

const Row = memo(function Row({ song, hidden, flagged, onHide, onFlag }: RowProps) {
  const st = styleById(song.style);
  const extra = (song as Song & { source?: string }).source;
  return (
    <li className={`ad-lib-row${hidden ? " is-hidden" : ""}`} data-song={song.id}>
      <ClipButton song={song} />
      <div className="ad-song-t">
        <b>
          {song.title}
          {song.explicit && <span className="ad-badge">Explicit</span>}
          {hidden && <span className="ad-badge ad-badge--off">Hidden</span>}
          {flagged && <span className="ad-badge ad-badge--flag">Flagged</span>}
        </b>
        <span>{song.artist}</span>
        <span className="ad-meta">
          <span>
            <span aria-hidden="true">{st?.emoji}</span> {st?.name ?? song.style}
          </span>
          <span>{song.flow === "ceremony" ? "Ceremony" : "Reception"}</span>
          <span>Hook {mmss(song.hookStartSec)}</span>
          {song.sourceUrl && (
            <a href={song.sourceUrl} target="_blank" rel="noreferrer">
              {sourceLabel(song.sourceUrl)}
            </a>
          )}
          {extra && <span className="ad-tag">{extra}</span>}
        </span>
      </div>
      <div className="ad-lib-actions">
        <button type="button" className="ad-btn" aria-pressed={hidden} aria-label={`${hidden ? "Unhide" : "Hide"} ${song.title}`} onClick={() => onHide(song.id)}>
          {hidden ? "Unhide" : "Hide"}
        </button>
        <button type="button" className="ad-btn" aria-pressed={flagged} aria-label={`${flagged ? "Unflag" : "Flag"} ${song.title}`} onClick={() => onFlag(song.id)}>
          {flagged ? "Unflag" : "Flag"}
        </button>
      </div>
    </li>
  );
});

export function LibraryView({ library, onChange, onError }: { library: Library | null; onChange: (l: Library) => void; onError: (e: unknown) => void }) {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [flow, setFlow] = useState<FlowId | "all">("all");
  const [style, setStyle] = useState("all");
  const [clean, setClean] = useState<Clean>("all");
  const [mode, setMode] = useState<Mode>("all");

  const hiddenSet = useMemo(() => new Set(library?.hidden ?? []), [library]);
  const flaggedSet = useMemo(() => new Set(library?.flagged ?? []), [library]);

  const perStyle = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of SONGS) m.set(s.style, (m.get(s.style) ?? 0) + 1);
    return m;
  }, []);

  const shown = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    return SONGS.filter(
      (s) =>
        (flow === "all" || s.flow === flow) &&
        (style === "all" || s.style === style) &&
        (clean === "all" || (clean === "explicit") === s.explicit) &&
        (mode === "all" || (mode === "hidden" ? hiddenSet.has(s.id) : flaggedSet.has(s.id))) &&
        (!needle || s.title.toLowerCase().includes(needle) || s.artist.toLowerCase().includes(needle)),
    );
  }, [dq, flow, style, clean, mode, hiddenSet, flaggedSet]);

  async function toggle(kind: "hidden" | "flagged", id: string) {
    if (!library) return;
    const cur = new Set(library[kind]);
    if (!cur.delete(id)) cur.add(id);
    const next = { ...library, [kind]: [...cur] };
    onChange(next); // optimistic
    try {
      onChange(await api.saveLibrary(next));
    } catch (e) {
      onChange(library);
      onError(e);
    }
  }
  const onHide = useMemo(() => (id: string) => toggle("hidden", id), [library]); // eslint-disable-line react-hooks/exhaustive-deps
  const onFlag = useMemo(() => (id: string) => toggle("flagged", id), [library]); // eslint-disable-line react-hooks/exhaustive-deps

  const seg = <T extends string>(label: string, value: T, set: (v: T) => void, opts: [T, string][]) => (
    <div className="ad-seg">
      <span className="ad-label">{label}</span>
      <div className="ad-chips" role="group" aria-label={label}>
        {opts.map(([id, text]) => (
          <button key={id} type="button" className="ad-pill" aria-pressed={value === id} onClick={() => set(id)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <section className="ad-hero" aria-label="Library summary">
        <p className="ad-hero-n">{SONGS.length}</p>
        <p className="ad-hero-l">
          songs · {library ? `${library.hidden.length} hidden · ${library.flagged.length} flagged` : "loading…"}
        </p>
        <ul className="ad-counts" aria-label="Songs per style">
          {STYLES.filter((s) => perStyle.has(s.id)).map((s) => (
            <li key={s.id}>
              <span aria-hidden="true">{s.emoji}</span> {s.name} <b>{perStyle.get(s.id)}</b>
            </li>
          ))}
        </ul>
      </section>

      <div className="ad-tools">
        <label className="ad-label ad-label--hidden" htmlFor="lib-search">
          Search songs
        </label>
        <input id="lib-search" className="ad-input" type="search" placeholder="Search title or artist" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <div className="ad-filters">
          {seg("Flow", flow, setFlow, [["all", "All"], ["reception", "Reception"], ["ceremony", "Ceremony"]])}
          {seg("Content", clean, setClean, [["all", "All"], ["clean", "Clean"], ["explicit", "Explicit"]])}
          {seg("Status", mode, setMode, [["all", "All"], ["hidden", "Hidden"], ["flagged", "Flagged"]])}
          <div className="ad-seg">
            <label className="ad-label" htmlFor="lib-style">
              Style
            </label>
            <select id="lib-style" className="ad-input ad-select" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="all">All styles</option>
              {STYLES.filter((s) => perStyle.has(s.id)).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name} ({perStyle.get(s.id)})
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="ad-hint" role="status">
          Showing {shown.length} of {SONGS.length}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="ad-empty">No songs match.</p>
      ) : (
        <ul className="ad-songs ad-lib" aria-label="Songs">
          {shown.map((s) => (
            <Row key={s.id} song={s} hidden={hiddenSet.has(s.id)} flagged={flaggedSet.has(s.id)} onHide={onHide} onFlag={onFlag} />
          ))}
        </ul>
      )}
    </>
  );
}
