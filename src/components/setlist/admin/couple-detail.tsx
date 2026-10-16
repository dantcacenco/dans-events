"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, Unauthorized } from "./api";
import { coupleName, LinkRow } from "./couples-list";
import { ClipButton, Chip, ConfirmButton, CopyButton, go, prettyDate, relTime, slug, useOrigin } from "./shared";
import { songById, styleById } from "@/lib/setlist/catalog";
import { download, masterToCsv, masterToM3u, masterToText } from "@/lib/setlist/export";
import type { MasterItem } from "@/lib/setlist/master";
import type { CoupleDetail, FlowSummary } from "@/lib/setlist/admin/data";
import type { FlowId, StoredGuestVote } from "@/lib/setlist/types";

const FLOW_LABEL: Record<FlowId, string> = { reception: "Reception", ceremony: "Ceremony" };
const STEP_LABEL: Record<string, string> = { styles: "Choosing styles", swipe: "Swiping", done: "Finished" };

type Props = { token: string; onChanged: () => void; onUnauthorized: (e: unknown) => void };

export function CoupleDetailView({ token, onChanged, onUnauthorized }: Props) {
  const [detail, setDetail] = useState<CoupleDetail | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(
    () =>
      api.detail(token).then(
        (d) => (setDetail(d), setError("")),
        (e) => {
          if (e instanceof Unauthorized) onUnauthorized(e);
          else if (e instanceof Error && e.message.includes("404")) setMissing(true);
          else setError("Could not load this couple.");
        },
      ),
    [token, onUnauthorized],
  );
  useEffect(() => {
    load();
  }, [load]);

  const back = (
    <button type="button" className="ad-back" onClick={() => go(null)}>
      <span aria-hidden="true">←</span> All couples
    </button>
  );
  if (missing)
    return (
      <>
        {back}
        <p className="ad-empty">This couple no longer exists.</p>
      </>
    );
  if (!detail)
    return (
      <>
        {back}
        <p className="ad-empty" role={error ? "alert" : undefined}>
          {error || "Loading…"}
        </p>
      </>
    );

  const c = detail.couple;
  const refresh = async () => {
    await load();
    onChanged();
  };
  async function patch(p: Parameters<typeof api.patch>[1]) {
    try {
      await api.patch(token, p);
      await refresh();
      return true;
    } catch (e) {
      if (e instanceof Unauthorized) onUnauthorized(e);
      else setError("Could not save. Try again.");
      return false;
    }
  }

  return (
    <article className="ad-detail">
      {back}
      <header className="ad-dhead">
        <h1 className="ad-names">{coupleName(c)}</h1>
        <p className="ad-card-sub">{c.date ? prettyDate(c.date) : "No date yet"}</p>
        <div className="ad-chips ad-chips--tight">
          <Chip tone={c.active ? "on" : "off"}>{c.active ? "Active" : "Links off"}</Chip>
          {Object.keys(c.submitted ?? {}).length > 0 && !c.reviewed && <Chip tone="warn">New submission</Chip>}
          {c.reviewed && <Chip tone="ok">Reviewed</Chip>}
          <Chip>{c.lang.toUpperCase()}</Chip>
          <Chip>Last activity {relTime(c.stats.lastActivity)}</Chip>
        </div>
        <div className="ad-row">
          <button type="button" className={`ad-btn ${c.reviewed ? "" : "ad-btn--primary"}`} aria-pressed={c.reviewed} onClick={() => patch({ reviewed: !c.reviewed })}>
            {c.reviewed ? "Reviewed ✓" : "Mark reviewed"}
          </button>
        </div>
      </header>

      {error && (
        <p className="ad-error" role="alert">
          {error}
        </p>
      )}

      <Links detail={detail} />
      <Notes value={c.adminNotes} onSave={(v) => patch({ adminNotes: v })} />

      <section className="ad-sec" aria-label="Find a song">
        <label className="ad-label" htmlFor="ad-find">
          Find a song
        </label>
        <input id="ad-find" className="ad-input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or artist" autoComplete="off" />
      </section>

      {(["reception", "ceremony"] as const).map((f) => (
        <FlowSection key={f} flow={f} data={detail.flows[f]} names={c.names} q={q} />
      ))}

      <MasterSection detail={detail} q={q} />
      <GuestsSection token={token} guests={detail.guests} q={q} onDeleted={refresh} />
      <Settings detail={detail} patch={patch} onDeleted={() => { onChanged(); go(null); }} onError={setError} />
    </article>
  );
}

// ---------- links ----------
function Links({ detail }: { detail: CoupleDetail }) {
  const origin = useOrigin();
  const c = detail.couple;
  return (
    <section className="ad-sec" aria-label="Links">
      <h2 className="ad-h2">Links</h2>
      <LinkRow label="Couple link" url={`${origin}/songs/${c.token}`} />
      <LinkRow label="Guest link" url={`${origin}/songs/g/${c.guestToken}`} />
    </section>
  );
}

// ---------- private notes, saved when the field loses focus ----------
function Notes({ value, onSave }: { value: string; onSave: (v: string) => Promise<boolean> }) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);
  const last = useRef(value);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);
  return (
    <section className="ad-sec" aria-label="Private notes">
      <div className="ad-sec-head">
        <label className="ad-h2" htmlFor="ad-notes">
          Private notes
        </label>
        <span className="ad-saved" role="status" aria-live="polite">
          {saved ? "Saved" : ""}
        </span>
      </div>
      <textarea
        id="ad-notes"
        className="ad-input ad-textarea"
        value={text}
        placeholder="Only you see this"
        maxLength={8000}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        onBlur={async () => {
          if (text === last.current) return;
          const prev = last.current;
          last.current = text;
          if (await onSave(text)) setSaved(true);
          else last.current = prev;
        }}
      />
    </section>
  );
}

// ---------- songs ----------
const matches = (id: string, q: string) => {
  if (!q) return true;
  const s = songById(id);
  const hay = s ? `${s.title} ${s.artist}` : id;
  return hay.toLowerCase().includes(q.trim().toLowerCase());
};

function SongRow({ id, extra }: { id: string; extra?: React.ReactNode }) {
  const s = songById(id);
  const style = s ? styleById(s.style) : undefined;
  return (
    <li className="ad-song">
      <ClipButton song={s} />
      <span className="ad-song-t">
        <b>{s?.title ?? id}</b>
        <span>
          {s?.artist}
          {style && (
            <>
              {" "}
              · <span aria-hidden="true">{style.emoji}</span> {style.name}
            </>
          )}
        </span>
      </span>
      {s?.explicit && <span className="ad-badge">Explicit</span>}
      {extra}
    </li>
  );
}

function SongList({ ids, q, empty = "None" }: { ids: string[]; q: string; empty?: string }) {
  const list = ids.filter((id) => matches(id, q));
  if (!list.length) return <p className="ad-none">{q && ids.length ? "No match" : empty}</p>;
  return (
    <ul className="ad-songs">
      {list.map((id) => (
        <SongRow key={id} id={id} />
      ))}
    </ul>
  );
}

function Block({ title, ids, q, collapsed }: { title: string; ids: string[]; q: string; collapsed?: boolean }) {
  const n = ids.filter((id) => matches(id, q)).length;
  const head = (
    <>
      {title} <span className="ad-count">{q ? `${n} of ${ids.length}` : ids.length}</span>
    </>
  );
  if (collapsed && ids.length)
    return (
      <details className="ad-block" open={!!q && n > 0}>
        <summary>{head}</summary>
        <SongList ids={ids} q={q} />
      </details>
    );
  return (
    <div className="ad-block">
      <h4 className="ad-h4">{head}</h4>
      <SongList ids={ids} q={q} />
    </div>
  );
}

function FlowSection({ flow, data, names, q }: { flow: FlowId; data: FlowSummary; names: [string, string]; q: string }) {
  const who = (pid: string) => (pid === "a" ? names[0] : pid === "b" ? names[1] : "Both of us");
  const empty = data.progress === "none" && !data.people.length;
  return (
    <section className="ad-sec" aria-label={FLOW_LABEL[flow]} data-flow={flow}>
      <div className="ad-sec-head">
        <h2 className="ad-h2">{FLOW_LABEL[flow]}</h2>
        <span className="ad-chips ad-chips--tight">
          <Chip tone={data.progress === "done" ? "ok" : data.progress === "partial" ? "warn" : "off"}>{data.progress === "done" ? "Done" : data.progress === "partial" ? "In progress" : "Not started"}</Chip>
          <Chip tone={data.sent ? "ok" : "off"}>{data.sent ? "Pressed Send" : "Not sent"}</Chip>
        </span>
      </div>
      {empty ? (
        <p className="ad-none">Nothing yet.</p>
      ) : (
        <>
          {data.people.map((p) => {
            const styles = p.styles.map((s) => styleById(s)).filter((s): s is NonNullable<typeof s> => !!s);
            return (
              <div className="ad-person" key={p.pid} data-pid={p.pid}>
                <h3 className="ad-h3">{who(p.pid)}</h3>
                <p className="ad-hint">
                  {STEP_LABEL[p.step] ?? p.step} · {p.answered} answered
                  {styles.length > 0 && (
                    <>
                      {" · "}
                      {styles.map((s) => (
                        <span key={s.id} className="ad-style">
                          <span aria-hidden="true">{s.emoji}</span> {s.name}
                        </span>
                      ))}
                    </>
                  )}
                </p>
                <Block title="★ Loved" ids={p.loved} q={q} />
                <Block title="Liked" ids={p.liked} q={q} collapsed />
              </div>
            );
          })}
          <div className="ad-person">
            <h3 className="ad-h3">Together</h3>
            <Block title="Must play" ids={data.must} q={q} />
            <Block title="Never play" ids={data.never} q={q} />
            <Block title="Both loved" ids={data.both} q={q} collapsed />
            <div className="ad-block">
              <h4 className="ad-h4">Notes from the couple</h4>
              {data.notes.trim() ? <p className="ad-quote">{data.notes}</p> : <p className="ad-none">None</p>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ---------- master list and exports ----------
function MasterSection({ detail, q }: { detail: CoupleDetail; q: string }) {
  const { master, flows, couple } = detail;
  const notes = [flows.reception.notes, flows.ceremony.notes.trim() ? `Ceremony: ${flows.ceremony.notes}` : ""].filter((s) => s.trim()).join("\n");
  const file = slug(`${couple.names[0]} ${couple.names[1]}`);
  const text = () => masterToText(master, master.guests, notes);
  return (
    <section className="ad-sec" aria-label="Master list">
      <h2 className="ad-h2">Master list</h2>
      <p className="ad-hint">Ranked by how many people chose each song. {master.guests} guest{master.guests === 1 ? "" : "s"} answered.</p>
      <div className="ad-row ad-exports" role="group" aria-label="Exports">
        <CopyButton text={text()} label="Copy text" />
        <button type="button" className="ad-btn" onClick={() => download(`${file}-master.csv`, "text/csv", masterToCsv(master, notes))}>
          Download CSV
        </button>
        <button type="button" className="ad-btn" onClick={() => download(`${file}-master.txt`, "text/plain", text())}>
          Download text
        </button>
        <button type="button" className="ad-btn" onClick={() => download(`${file}-master.m3u`, "audio/x-mpegurl", masterToM3u(master, `${coupleName(couple)} master list`))}>
          Download M3U
        </button>
      </div>
      <MasterBlock title="Song list" items={master.songs} q={q} />
      <MasterBlock title="Songs chosen by guests" items={master.extras} q={q} />
    </section>
  );
}

function MasterBlock({ title, items, q }: { title: string; items: MasterItem[]; q: string }) {
  const needle = q.trim().toLowerCase();
  const rows = items.map((it, i) => ({ it, rank: i + 1 })).filter(({ it }) => !needle || `${it.title} ${it.artist}`.toLowerCase().includes(needle));
  return (
    <div className="ad-block" data-block={title}>
      <h3 className="ad-h3">
        {title} <span className="ad-count">{needle ? `${rows.length} of ${items.length}` : items.length}</span>
      </h3>
      {rows.length === 0 ? (
        <p className="ad-none">{needle && items.length ? "No match" : "Nothing yet"}</p>
      ) : (
        <ol className="ad-songs ad-master">
          {rows.map(({ it, rank }) => (
            <li className="ad-song" key={it.id}>
              <span className="ad-rank" aria-hidden="true">
                {rank}
              </span>
              <ClipButton song={it.extra ? undefined : songById(it.id)} />
              <span className="ad-song-t">
                <b>{it.title}</b>
                <span>{it.artist}</span>
              </span>
              {it.must && <span className="ad-badge ad-badge--must">Must play</span>}
              {it.explicit && <span className="ad-badge">Explicit</span>}
              <span className="ad-score" aria-label={`${it.count} people`}>
                {it.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ---------- guests ----------
function GuestsSection({ token, guests, q, onDeleted }: { token: string; guests: StoredGuestVote[]; q: string; onDeleted: () => void }) {
  const answered = guests.filter((g) => g.likes.length || g.skips.length || g.extras.length);
  return (
    <section className="ad-sec" aria-label="Guests">
      <div className="ad-sec-head">
        <h2 className="ad-h2">Guests</h2>
        <span className="ad-count">{answered.length}</span>
      </div>
      {answered.length === 0 ? (
        <p className="ad-none">No guest responses yet.</p>
      ) : (
        <ul className="ad-guests">
          {answered.map((g) => (
            <li className="ad-guest" key={g.sessionId}>
              <div className="ad-guest-head">
                <div>
                  <b>{g.name.trim() || "Guest"}</b>
                  <span className="ad-hint">
                    {" "}
                    · {relTime(g.at)} · {g.likes.length} liked
                  </span>
                </div>
                <ConfirmButton
                  label="Delete"
                  ask="Delete this response?"
                  ariaLabel={`Delete response from ${g.name.trim() || "Guest"}`}
                  onConfirm={async () => {
                    await api.removeVote(token, g.sessionId).catch(() => {});
                    onDeleted();
                  }}
                />
              </div>
              {g.likes.length > 0 && <Block title="Liked songs" ids={g.likes} q={q} collapsed />}
              {g.extras.length > 0 && (
                <div className="ad-block">
                  <h4 className="ad-h4">
                    Added songs <span className="ad-count">{g.extras.length}</span>
                  </h4>
                  <ul className="ad-songs">
                    {g.extras.map((x, i) => (
                      <li className="ad-song" key={i}>
                        <span className="ad-ic ad-ic--none" aria-hidden="true" />
                        <span className="ad-song-t">
                          <b>{x.title}</b>
                          <span>{x.artist}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------- edit, switch off, delete ----------
function Settings({ detail, patch, onDeleted, onError }: { detail: CoupleDetail; patch: (p: Parameters<typeof api.patch>[1]) => Promise<boolean>; onDeleted: () => void; onError: (m: string) => void }) {
  const c = detail.couple;
  const [a, setA] = useState(c.names[0]);
  const [b, setB] = useState(c.names[1]);
  const [date, setDate] = useState(c.date);
  const [lang, setLang] = useState(c.lang);
  const [typed, setTyped] = useState("");
  const [saved, setSaved] = useState(false);
  const dirty = a !== c.names[0] || b !== c.names[1] || date !== c.date || lang !== c.lang;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!a.trim() || !b.trim()) return;
    setSaved(await patch({ names: [a.trim(), b.trim()], date, lang }));
  }
  async function del() {
    try {
      await api.remove(c.token);
      onDeleted();
    } catch {
      onError("Could not delete. Try again.");
    }
  }

  return (
    <section className="ad-sec" aria-label="Settings">
      <h2 className="ad-h2">Settings</h2>
      <details className="ad-block ad-edit">
        <summary>Edit names, date, language</summary>
        <form onSubmit={save} className="ad-panel ad-panel--flat">
          <div className="ad-grid2">
            <div>
              <label className="ad-label" htmlFor="ed-a">
                Partner 1
              </label>
              <input id="ed-a" className="ad-input" value={a} maxLength={40} onChange={(e) => { setA(e.target.value); setSaved(false); }} />
            </div>
            <div>
              <label className="ad-label" htmlFor="ed-b">
                Partner 2
              </label>
              <input id="ed-b" className="ad-input" value={b} maxLength={40} onChange={(e) => { setB(e.target.value); setSaved(false); }} />
            </div>
            <div>
              <label className="ad-label" htmlFor="ed-date">
                Wedding date
              </label>
              <input id="ed-date" className="ad-input" type="date" value={date} onChange={(e) => { setDate(e.target.value); setSaved(false); }} />
            </div>
            <div>
              <span className="ad-label" id="ed-lang">
                Language
              </span>
              <div className="ad-chips" role="group" aria-labelledby="ed-lang">
                {(["en", "ru"] as const).map((l) => (
                  <button key={l} type="button" className="ad-pill" aria-pressed={lang === l} onClick={() => { setLang(l); setSaved(false); }}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="ad-row">
            <button type="submit" className="ad-btn ad-btn--primary" disabled={!dirty || !a.trim() || !b.trim()}>
              Save changes
            </button>
            <span className="ad-saved" role="status">
              {saved && !dirty ? "Saved" : ""}
            </span>
          </div>
        </form>
      </details>

      <div className="ad-setting">
        <div>
          <b>Links</b>
          <p className="ad-hint">{c.active ? "On. The couple and guests can open them." : "Off. Both links show not found."}</p>
        </div>
        <button type="button" className="ad-btn" aria-pressed={c.active} onClick={() => patch({ active: !c.active })}>
          {c.active ? "Switch off" : "Switch on"}
        </button>
      </div>

      <details className="ad-block ad-danger">
        <summary>Delete couple</summary>
        <div className="ad-panel ad-panel--flat">
          <p className="ad-hint">Removes {coupleName(c)}, their picks and all guest responses for good.</p>
          <label className="ad-label" htmlFor="ad-del">
            Type DELETE to confirm
          </label>
          <input id="ad-del" className="ad-input" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
          <div className="ad-row">
            <button type="button" className="ad-btn ad-btn--danger" disabled={typed.trim() !== "DELETE"} onClick={del}>
              Delete couple
            </button>
          </div>
        </div>
      </details>
    </section>
  );
}
