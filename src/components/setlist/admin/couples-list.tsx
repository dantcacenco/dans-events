"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { api } from "./api";
import { Chip, CopyButton, go, prettyDate, relTime, useOrigin } from "./shared";
import type { CoupleInfo } from "@/lib/setlist/types";
import type { CoupleRow } from "@/lib/setlist/admin/data";

type Filter = "all" | "review" | "active" | "off";
const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["review", "Needs review"],
  ["active", "Active"],
  ["off", "Off"],
];

export const needsReview = (c: CoupleRow) => Object.keys(c.submitted ?? {}).length > 0 && !c.reviewed;
export const coupleName = (c: Pick<CoupleInfo, "names">) => `${c.names[0]} & ${c.names[1]}`;

export function CouplesList({ couples, onChanged }: { couples: CoupleRow[] | null; onChanged: () => void }) {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [filter, setFilter] = useState<Filter>("all");
  const [creating, setCreating] = useState(false);
  const [made, setMade] = useState<CoupleInfo | null>(null);

  const shown = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    return (couples ?? [])
      .filter((c) => (!needle || coupleName(c).toLowerCase().includes(needle)) && (filter === "all" || (filter === "review" ? needsReview(c) : filter === "active" ? c.active : !c.active)))
      .sort((a, b) => b.stats.lastActivity - a.stats.lastActivity);
  }, [couples, dq, filter]);

  const toReview = (couples ?? []).filter(needsReview).length;

  return (
    <>
      <section className="ad-hero" aria-label="Summary">
        <p className="ad-hero-n">{couples === null ? "–" : toReview}</p>
        <p className="ad-hero-l">{couples === null ? "Loading…" : `to review · ${couples.length} couple${couples.length === 1 ? "" : "s"}`}</p>
        <div className="ad-hero-actions">
          <button type="button" className="ad-btn ad-btn--primary" aria-expanded={creating} onClick={() => { setCreating((v) => !v); setMade(null); }}>
            New couple
          </button>
          <a className="ad-link" href="/api/songs/admin/export" download>
            Export all (CSV)
          </a>
        </div>
      </section>

      {creating && (
        <NewCouple
          made={made}
          onCreated={(c) => {
            setMade(c);
            onChanged();
          }}
          onClose={() => { setCreating(false); setMade(null); }}
        />
      )}

      <div className="ad-tools">
        <label className="ad-label ad-label--hidden" htmlFor="ad-search">
          Search couples by name
        </label>
        <input id="ad-search" className="ad-input" type="search" placeholder="Search names" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <div className="ad-chips" role="group" aria-label="Filter">
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" className="ad-pill" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label}
              {id === "review" && toReview > 0 ? <span className="ad-pill-n">{toReview}</span> : null}
            </button>
          ))}
        </div>
        <p className="ad-hint">Sorted by last activity</p>
      </div>

      {couples !== null && shown.length === 0 && <p className="ad-empty">{couples.length ? "No couples match." : "No couples yet. Tap New couple."}</p>}
      <ul className="ad-list" aria-label="Couples">
        {shown.map((c) => (
          <CoupleCard key={c.token} c={c} />
        ))}
      </ul>
    </>
  );
}

const progress = (p: "none" | "partial" | "done") => (p === "done" ? "Done" : p === "partial" ? "In progress" : "Not started");

function CoupleCard({ c }: { c: CoupleRow }) {
  const review = needsReview(c);
  const st = c.stats;
  return (
    <li>
      <a
        className="ad-card"
        href={`?c=${c.token}`}
        data-token={c.token}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          go(c.token);
        }}
      >
        <span className="ad-card-names">{coupleName(c)}</span>
        <span className="ad-card-sub">{c.date ? prettyDate(c.date) : "No date yet"}</span>
        <span className="ad-chips ad-chips--tight">
          <Chip tone={c.active ? "on" : "off"}>{c.active ? "Active" : "Off"}</Chip>
          {review && <Chip tone="warn">New submission</Chip>}
          {c.reviewed && <Chip tone="ok">Reviewed</Chip>}
        </span>
        <span className="ad-stats">
          <span>
            <b>
              {st.partnersDone} done · {st.partnersStarted} started
            </b>
            <i>Partners</i>
          </span>
          <span>
            <b>{st.guests}</b>
            <i>Guest responses</i>
          </span>
          <span>
            <b>{progress(st.flows.reception)}</b>
            <i>Reception</i>
          </span>
          <span>
            <b>{progress(st.flows.ceremony)}</b>
            <i>Ceremony</i>
          </span>
        </span>
        <span className="ad-card-when">Last activity {relTime(st.lastActivity)}</span>
      </a>
    </li>
  );
}

function NewCouple({ made, onCreated, onClose }: { made: CoupleInfo | null; onCreated: (c: CoupleInfo) => void; onClose: () => void }) {
  const origin = useOrigin();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [date, setDate] = useState("");
  const [lang, setLang] = useState<"en" | "ru">("en");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!a.trim() || !b.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      onCreated(await api.create([a.trim(), b.trim()], date, lang));
      setA("");
      setB("");
      setDate("");
    } catch {
      setErr("Could not create. Try again.");
    }
    setBusy(false);
  }

  if (made) {
    return (
      <section className="ad-panel" aria-label="New links">
        <h2 className="ad-h2">{coupleName(made)}</h2>
        <p className="ad-hint">Links are ready. Send the couple link to them.</p>
        <LinkRow label="Couple link" url={`${origin}/songs/${made.token}`} />
        <LinkRow label="Guest link" url={`${origin}/songs/g/${made.guestToken}`} />
        <button type="button" className="ad-btn" onClick={onClose}>
          Done
        </button>
      </section>
    );
  }
  return (
    <form className="ad-panel" onSubmit={create} aria-label="New couple">
      <h2 className="ad-h2">New couple</h2>
      <div className="ad-grid2">
        <div>
          <label className="ad-label" htmlFor="nc-a">
            Partner 1
          </label>
          <input id="nc-a" className="ad-input" value={a} onChange={(e) => setA(e.target.value)} maxLength={40} autoComplete="off" />
        </div>
        <div>
          <label className="ad-label" htmlFor="nc-b">
            Partner 2
          </label>
          <input id="nc-b" className="ad-input" value={b} onChange={(e) => setB(e.target.value)} maxLength={40} autoComplete="off" />
        </div>
        <div>
          <label className="ad-label" htmlFor="nc-date">
            Wedding date (optional)
          </label>
          <input id="nc-date" className="ad-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <span className="ad-label" id="nc-lang">
            Language
          </span>
          <div className="ad-chips" role="group" aria-labelledby="nc-lang">
            {(["en", "ru"] as const).map((l) => (
              <button key={l} type="button" className="ad-pill" aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      {err && (
        <p className="ad-error" role="alert">
          {err}
        </p>
      )}
      <div className="ad-row">
        <button type="submit" className="ad-btn ad-btn--primary" disabled={busy || !a.trim() || !b.trim()}>
          {busy ? "Creating…" : "Create"}
        </button>
        <button type="button" className="ad-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="ad-link-row">
      <div className="ad-link-t">
        <span className="ad-label">{label}</span>
        <code className="ad-url" data-link={label}>
          {url}
        </code>
      </div>
      <div className="ad-row">
        <CopyButton text={url} label="Copy" />
        <a className="ad-btn" href={url} target="_blank" rel="noreferrer" aria-label={`Open ${label.toLowerCase()}`}>
          Open
        </a>
      </div>
    </div>
  );
}
