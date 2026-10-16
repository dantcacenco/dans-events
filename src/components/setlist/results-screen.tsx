"use client";

import { useState } from "react";
import { songById, STYLES } from "@/lib/setlist/catalog";
import { copyText, download, toCsv, toText } from "@/lib/setlist/export";
import { resultFor, toggleLike, toggleMark } from "@/lib/setlist/store";
import type { FlowId, Moment } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";

const MOMENTS: Moment[] = ["processional", "bridal", "unity", "recessional"];

export function ResultsScreen({ c, flow }: { c: Ctx; flow: FlowId }) {
  const { L, lang, store, names, updFlow, go, player } = c;
  const f = store.flows[flow];
  const r = resultFor(f);
  const partners = r.pids.filter((p) => p === "a" || p === "b");
  const hasBoth = partners.length === 2;
  const [tab, setTab] = useState<string>(hasBoth ? "both" : r.pids[0] ?? "solo");
  const [copied, setCopied] = useState(false);
  const cur = tab === "both" && !hasBoth ? r.pids[0] : tab;
  const personTab = cur !== "both";
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
        <button className="sl-ic flag" aria-pressed={mark === "must"} aria-label={L.flag} onClick={() => updFlow(flow, (x) => toggleMark(x, id, "must"))}>⚑</button>
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
    const base = `${flow === "ceremony" ? "ceremony" : "dance-set"}-${c.token.slice(0, 6)}`;
    if (kind === "csv") download(`${base}.csv`, "text/csv", toCsv(flow, f, names));
    else download(`${base}.txt`, "text/plain", toText(flow, f, names));
  };
  const doCopy = async () => {
    if (await copyText(toText(flow, f, names))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const send = async () => {
    try {
      await fetch("/api/songs/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: c.token, flow, people: r.pids.length, must: r.must.length, never: r.never.length }) });
    } catch {
      // stub endpoint: ignore
    }
    updFlow(flow, (x) => ({ ...x, sent: true }));
  };

  const nothing = r.pids.length === 0;
  return (
    <>
      <h1 className={`sl-h1 ${flow === "ceremony" ? "sl-serif" : ""}`}>{L.resultsTitle}</h1>
      <p className="sl-sub">{L.resultsSub}</p>
      <div className="sl-legend" aria-label="Legend">
        <span><b style={{ color: "#c43a52" }}>♥</b> {L.legendHeart}</span>
        <span><b style={{ color: "var(--gold)" }}>⚑</b> {L.legendMust}</span>
        <span><b style={{ color: "#ff8a80" }}>✕</b> {L.legendNever}</span>
      </div>
      {flow === "ceremony" && <p className="sl-note" style={{ margin: "-6px 0 14px" }}>{L.momentHelp}</p>}
      {missingPartner && <p className="sl-msg">{L.onlyOnePicked(missingPartner)}</p>}

      {nothing ? (
        <p className="sl-msg">{L.nothingApproved}</p>
      ) : (
        <>
          {r.pids.length > 1 || hasBoth ? (
            <div className="sl-tabs" role="tablist">
              {hasBoth && <button aria-pressed={cur === "both"} onClick={() => setTab("both")}>♥ {L.tabBoth} ({r.both.length})</button>}
              {r.pids.map((pid) => (
                <button key={pid} aria-pressed={cur === pid} onClick={() => setTab(pid)}>{names[pid]} ({r.approved[pid].length})</button>
              ))}
            </div>
          ) : null}

          <h2 className="sl-sec">⚑ {L.alwaysList} <small>({r.must.length})</small></h2>
          {r.must.length ? r.must.map((id) => row(id)) : <p className="sl-note">{L.nothingAlways}</p>}

          <h2 className="sl-sec">♥ {cur === "both" ? L.tabBoth : L.approved} <small>({nonNever.length})</small></h2>
          {regular.length === 0 && <p className="sl-note">{L.nothingApproved}</p>}
          {groups.filter((g) => g.ids.length).map((g) => (
            <div key={g.key}>
              <div className="sl-sub2">{g.label}</div>
              {g.ids.map((id) => row(id))}
            </div>
          ))}

          {skippedIds.length > 0 && (
            <details style={{ marginTop: 18 }}>
              <summary>{L.skipped} ({skippedIds.length})</summary>
              {skippedIds.map((id) => row(id))}
            </details>
          )}

          <h2 className="sl-sec">✕ {L.neverList} <small>({r.never.length})</small></h2>
          {r.never.length ? r.never.map((id) => row(id)) : <p className="sl-note">{L.nothingNever}</p>}
        </>
      )}

      <h2 className="sl-sec">{L.notesTitle}</h2>
      <p className="sl-note" style={{ margin: "-4px 0 10px" }}>{L.notesSub}</p>
      <textarea className="sl-notes" value={f.notes} placeholder={L.notesPlaceholder} onChange={(e) => updFlow(flow, (x) => ({ ...x, notes: e.target.value }))} aria-label={L.notesTitle} />

      <div className="sl-btns">
        <button className="sl-cta" onClick={send} disabled={nothing}>{f.sent ? `✓ ${L.sent}` : L.sendToDan}</button>
        {f.sent && <p className="sl-note" style={{ textAlign: "center", margin: 0 }}>{L.sentProto}</p>}
        <button className="sl-ghost" onClick={doCopy}>{copied ? `✓ ${L.copied}` : `📋 ${L.copy}`}</button>
        <button className="sl-ghost" onClick={() => exp("csv")} disabled={nothing}>⬇ {L.downloadCsv}</button>
        <button className="sl-ghost" onClick={() => exp("txt")} disabled={nothing}>⬇ {L.downloadTxt}</button>
        <button className="sl-ghost" onClick={() => go({ screen: "who", flow })}>{L.whoTitle}</button>
        {personTab && cur !== "both" && (
          <button className="sl-ghost" onClick={() => go({ screen: "styles", flow, pid: cur })}>{L.moreStyles}</button>
        )}
      </div>
    </>
  );
}
