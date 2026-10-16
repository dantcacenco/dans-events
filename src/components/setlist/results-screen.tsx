"use client";

import { useEffect, useState } from "react";
import { fetchMaster } from "@/lib/setlist/api";
import { songById, STYLES } from "@/lib/setlist/catalog";
import { copyText, download, masterToCsv, masterToText, toCsv, toText } from "@/lib/setlist/export";
import { buildMaster } from "@/lib/setlist/master";
import { resultFor, toggleLike, toggleMark } from "@/lib/setlist/store";
import type { FlowId, MasterData, Moment } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";
import { InviteSheet } from "./invite-sheet";
import { MasterList } from "./master-list";

const MOMENTS: Moment[] = ["processional", "bridal", "unity", "recessional"];

export function ResultsScreen({ c, flow }: { c: Ctx; flow: FlowId }) {
  const { L, lang, store, names, updFlow, go, player } = c;
  const f = store.flows[flow];
  const r = resultFor(f);
  const partners = r.pids.filter((p) => p === "a" || p === "b");
  const hasBoth = partners.length === 2;
  const [tab, setTab] = useState<string>(hasBoth ? "both" : r.pids[0] ?? "solo");
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [master, setMaster] = useState<MasterData | null>(null);
  const [rev, setRev] = useState(0);
  const isRec = flow === "reception";
  const cur = tab === "both" && !hasBoth ? r.pids[0] : tab;
  const isMaster = isRec && cur === "master";
  const personTab = cur !== "both" && !isMaster;
  const hasLink = !!store.guestToken;

  // The guest votes live on the server: load them, and look again every 20 s while the master list is open.
  useEffect(() => {
    if (!isRec || !hasLink) return;
    let live = true;
    fetchMaster({ token: c.token }).then((m) => live && setMaster(m));
    return () => {
      live = false;
    };
  }, [isRec, hasLink, c.token, rev]);
  useEffect(() => {
    if (!isMaster || !hasLink) return;
    const id = setInterval(() => !document.hidden && setRev((n) => n + 1), 20000);
    return () => clearInterval(id);
  }, [isMaster, hasLink]);
  const built = buildMaster(master, f);
  const masterCount = built.songs.length + built.extras.length;
  const approvedIds = cur === "both" ? r.both : r.approved[cur] ?? [];
  const skippedIds = personTab ? r.skipped[cur] ?? [] : [];
  const missingPartner = !hasBoth && partners.length === 1 ? (partners[0] === "a" ? names.b : names.a) : null;

  const row = (id: string) => {
    const s = songById(id);
    if (!s) return null;
    const mark = f.marks[id];
    const playing = player.playing && player.src?.endsWith(s.clip);
    const person = personTab ? f.people[cur] : undefined;
    const showHeart = !!person && person.deck.includes(id);
    const liked = person?.answers[id] === "like" || person?.answers[id] === "love";
    return (
      <div key={id} className={`sl-row ${mark ?? ""}`}>
        <button className="sl-ic play" aria-label={`${playing ? L.pause : L.play}: ${s.title}`} onClick={() => player.toggle(s.clip, { loop: false })}>
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="t">
          <b>{s.title}</b>
          <span>{s.artist}{s.moment ? ` · ${L.moments[s.moment]}` : ""}{s.explicit ? ` · ${L.explicitTag}` : ""}</span>
        </div>
        {showHeart && (
          <button className="sl-ic heart" aria-pressed={liked} aria-label={liked ? L.removeSong : L.addBack} onClick={() => updFlow(flow, (x) => toggleLike(x, cur, id))}>
            {liked ? "♥" : "♡"}
          </button>
        )}
        <button className="sl-ic flag" aria-pressed={mark === "must"} aria-label={L.flag} onClick={() => updFlow(flow, (x) => toggleMark(x, id, "must"))}>★</button>
        <button className="sl-ic x" aria-pressed={mark === "never"} aria-label={L.never} onClick={() => updFlow(flow, (x) => toggleMark(x, id, "never"))}>✕</button>
      </div>
    );
  };

  // ceremony: ordered by moment; reception: grouped by style
  const groups: { key: string; label: string; ids: string[] }[] = [];
  const nonNever = approvedIds.filter((id) => f.marks[id] !== "never");
  const regular = nonNever.filter((id) => f.marks[id] !== "must"); // starred songs sit in the Always play list above
  if (flow === "ceremony") for (const m of MOMENTS) groups.push({ key: m, label: L.moments[m], ids: regular.filter((id) => songById(id)?.moment === m) });
  else for (const st of STYLES.filter((s) => s.flow === "reception")) groups.push({ key: st.id, label: lang === "ru" ? st.nameRu : st.name, ids: regular.filter((id) => songById(id)?.style === st.id) });

  const exp = (kind: "csv" | "txt") => {
    const base = `${flow === "ceremony" ? "ceremony" : isMaster ? "master-list" : "dance-set"}-${c.token.slice(0, 6)}`;
    if (kind === "csv") download(`${base}.csv`, "text/csv", isMaster ? masterToCsv(built, f.notes) : toCsv(flow, f, names));
    else download(`${base}.txt`, "text/plain", isMaster ? masterToText(built, master?.guests ?? 0, f.notes) : toText(flow, f, names));
  };
  const doCopy = async () => {
    if (await copyText(isMaster ? masterToText(built, master?.guests ?? 0, f.notes) : toText(flow, f, names))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const [sendFailed, setSendFailed] = useState(false);
  const send = async () => {
    // Picks are already on the server (synced as they go); this tells Dan's admin page they are final.
    const ok = await fetch("/api/songs/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: c.token, flow }) })
      .then((res) => res.ok)
      .catch(() => false);
    setSendFailed(!ok);
    if (ok) updFlow(flow, (x) => ({ ...x, sent: true }));
  };

  const nothing = r.pids.length === 0;
  const count = nonNever.length;
  return (
    <div className="sl-results">
      <h1 className="sl-h1">{L.resultsTitle}</h1>
      {isMaster ? (
        <div className="sl-count">
          <b className="sl-hero">{masterCount}</b>
          <span>{L.songsWord(masterCount)}</span>
        </div>
      ) : (
        !nothing && (
          <div className="sl-count">
            <b className="sl-hero">{count}</b>
            <span>{L.songsWord(count)}</span>
          </div>
        )
      )}
      {isRec && (
        <button className="sl-invite" onClick={() => setInviting(true)}>
          <span aria-hidden="true">👥</span> {L.invite}
        </button>
      )}
      {missingPartner && !isMaster && <p className="sl-msg">{L.onlyOnePicked(missingPartner)}</p>}

      {isRec || r.pids.length > 1 || hasBoth ? (
        <div className="sl-tabs" role="tablist">
          {hasBoth && <button aria-pressed={cur === "both"} onClick={() => setTab("both")}>♥ {L.tabBoth} <small>{r.both.length}</small></button>}
          {r.pids.map((pid) => (
            <button key={pid} aria-pressed={cur === pid} onClick={() => setTab(pid)}>{names[pid]} <small>{r.approved[pid].length}</small></button>
          ))}
          {isRec && <button aria-pressed={isMaster} onClick={() => setTab("master")}>{L.tabMaster}</button>}
        </div>
      ) : null}

      {isMaster ? (
        <>
          <p className="sl-msg sl-guests">
            {hasLink && master ? L.guestsWord(master.guests) : L.noGuestsYet}{" "}
            {hasLink && <button className="sl-link" onClick={() => setRev((n) => n + 1)}>{L.refresh}</button>}
          </p>
          <MasterList c={c} data={master} readOnly={false} />
        </>
      ) : nothing ? (
        <p className="sl-msg">{L.nothingApproved}</p>
      ) : (
        <>

          <h2 className="sl-sec sl-sec--must"><span className="ic" aria-hidden="true">★</span> {L.alwaysList} <small>{r.must.length}</small></h2>
          {r.must.length ? r.must.map((id) => row(id)) : <p className="sl-note">{L.nothingAlways}</p>}

          <h2 className="sl-sec sl-sec--liked"><span className="ic" aria-hidden="true">♥</span> {cur === "both" ? L.tabBoth : L.approved} <small>{regular.length}</small></h2>
          {regular.length === 0 && <p className="sl-note">{L.nothingApproved}</p>}
          {groups.filter((g) => g.ids.length).map((g) => (
            <div key={g.key} className="sl-group">
              <div className="sl-sub2">{g.label}</div>
              {g.ids.map((id) => row(id))}
            </div>
          ))}

          {skippedIds.length > 0 && (
            <details className="sl-skipped">
              <summary>{L.skipped} <small>{skippedIds.length}</small></summary>
              {skippedIds.map((id) => row(id))}
            </details>
          )}

          <h2 className="sl-sec sl-sec--never"><span className="ic" aria-hidden="true">✕</span> {L.neverList} <small>{r.never.length}</small></h2>
          {r.never.length ? r.never.map((id) => row(id)) : <p className="sl-note">{L.nothingNever}</p>}
        </>
      )}

      <h2 className="sl-sec sl-sec--notes">{L.notesTitle}</h2>
      <textarea className="sl-notes" value={f.notes} placeholder={L.notesPlaceholder} onChange={(e) => updFlow(flow, (x) => ({ ...x, notes: e.target.value }))} aria-label={L.notesTitle} />

      <div className="sl-more">
        <button className="sl-link" onClick={doCopy} aria-label={copied ? L.copied : L.copy}>{copied ? `✓ ${L.copied}` : L.copy}</button>
        <button className="sl-link" onClick={() => exp("csv")} disabled={nothing && !isMaster} aria-label={L.downloadCsv}>CSV</button>
        <button className="sl-link" onClick={() => exp("txt")} disabled={nothing && !isMaster} aria-label={L.downloadTxt}>TXT</button>
        <button className="sl-link" onClick={() => go({ screen: "who", flow })}>{L.whoTitle}</button>
        {personTab && cur !== "both" && (
          <button className="sl-link" onClick={() => go({ screen: "styles", flow, pid: cur })}>{L.moreStyles}</button>
        )}
      </div>
      {sendFailed && <p className="sl-note sl-proto" role="alert">{L.sendFailed}</p>}

      {isRec && <InviteSheet c={c} open={inviting} onClose={() => setInviting(false)} />}
      <div className="sl-sticky">
        <button className="sl-cta" onClick={send} disabled={nothing}>{f.sent ? `✓ ${L.sent}` : L.sendToDan}</button>
      </div>
    </div>
  );
}
