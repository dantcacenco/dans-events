"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PARTY_MAX, PARTY_MIN, EMPTY_DETAILS, LANGS, LANG_LABEL, type EventDetails, type Lang } from "@/lib/christmas/config";
import { ADMIN, type L } from "@/lib/christmas/i18n";
import { clampParty, displayPhone, formatPhone, phonesForTexting, santaNames, searchRecords, type Filter, type Stats, type XmasRecord } from "@/lib/christmas/logic";
import { optionFor } from "@/lib/christmas/santa";
import { LangSwitch, detectLang, rememberLang } from "./guest";

type Tr = (l: L) => string;
type Undo = { label: string; run: () => Promise<void> } | null;
const json = { "Content-Type": "application/json" };
const API = "/api/christmas-checkin/admin";

export default function AdminApp({ authed, configured }: { authed: boolean; configured: boolean }) {
  const [lang, setLang] = useState<Lang>("en");
  const [ok, setOk] = useState(authed);
  const tr: Tr = (l) => l[lang];
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read the URL and localStorage after hydration
    setLang(detectLang());
  }, []);
  const pick = (l: Lang) => {
    setLang(l);
    rememberLang(l);
  };
  return (
    <main className="ad">
      <div className="ad-top">
        <h1>🎄 {tr(ADMIN.title)}</h1>
        <LangSwitch lang={lang} onPick={pick} />
      </div>
      {ok ? <Dashboard tr={tr} lang={lang} onOut={() => setOk(false)} /> : <Login tr={tr} configured={configured} onIn={() => setOk(true)} />}
    </main>
  );
}

function Login({ tr, configured, onIn }: { tr: Tr; configured: boolean; onIn: () => void }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const go = async () => {
    setErr("");
    const r = await fetch(`${API}/login`, { method: "POST", headers: json, body: JSON.stringify({ password }) });
    if (r.ok) return onIn();
    setErr(r.status === 429 ? tr(ADMIN.tooMany) : r.status === 503 ? tr(ADMIN.notConfigured) : tr(ADMIN.wrong));
  };
  return (
    <form
      className="ad-box ad-login"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
    >
      <label>
        <span className="xm-label">{tr(ADMIN.password)}</span>
        <input className="xm-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
      </label>
      {(err || !configured) && <p className="xm-hint">{err || tr(ADMIN.notConfigured)}</p>}
      <button className="xm-go" type="submit">
        {tr(ADMIN.signIn)}
      </button>
    </form>
  );
}

function Dashboard({ tr, lang, onOut }: { tr: Tr; lang: Lang; onOut: () => void }) {
  const [records, setRecords] = useState<XmasRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [details, setDetails] = useState<EventDetails>(EMPTY_DETAILS);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [edit, setEdit] = useState<XmasRecord | null>(null);
  const [undo, setUndo] = useState<Undo>(null);
  const [copied, setCopied] = useState("");
  const [wipe, setWipe] = useState(false);
  const [wipeText, setWipeText] = useState("");
  const [err, setErr] = useState<L | null>(null);
  const [origin, setOrigin] = useState("");
  const loaded = useRef(false);

  const load = useCallback(async () => {
    const r = await fetch(`${API}/records`, { cache: "no-store" });
    if (r.status === 401) return onOut();
    if (!r.ok) return setErr(ADMIN.storeDown);
    const d = await r.json();
    setErr(null);
    setRecords(d.records);
    setStats(d.stats);
    if (!loaded.current) setDetails(d.details); // only the first time: never overwrite what the admin is typing
    loaded.current = true;
  }, [onOut]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- origin is only known in the browser
    setOrigin(window.location.origin);
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  const shown = useMemo(() => searchRecords(records, q, filter), [records, q, filter]);
  const call = (method: string, body: unknown) => fetch(`${API}/records`, { method, headers: json, body: JSON.stringify(body) });

  const del = async (r: XmasRecord) => {
    await call("DELETE", { id: r.id });
    setUndo({ label: `${tr(ADMIN.deleted)}: ${r.name}`, run: async () => void (await call("POST", { restore: r })) });
    load();
  };
  const toggleArrived = async (r: XmasRecord) => {
    await call("PATCH", { id: r.id, arrived: !r.arrived });
    setUndo({ label: `${r.arrived ? tr(ADMIN.unmarked) : tr(ADMIN.marked)}: ${r.name}`, run: async () => void (await call("PATCH", { id: r.id, arrived: r.arrived })) });
    load();
  };
  const save = async (next: XmasRecord) => {
    const before = records.find((x) => x.id === next.id);
    const r = await call("PUT", { id: next.id, record: next });
    if (!r.ok) {
      const code = (await r.json().catch(() => ({}))).error;
      return setErr(code === "phone-taken" ? ADMIN.phoneTaken : code === "store" ? ADMIN.storeDown : ADMIN.badInput);
    }
    setErr(null);
    setEdit(null);
    if (before) setUndo({ label: `${tr(ADMIN.edited)}: ${next.name}`, run: async () => void (await call("PUT", { id: before.id, record: before })) });
    load();
  };
  const copy = async (text: string, tag: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(tag);
    setTimeout(() => setCopied(""), 2000);
  };
  const doWipe = async () => {
    await fetch(`${API}/wipe`, { method: "POST", headers: json, body: JSON.stringify({ confirm: wipeText }) });
    setWipe(false);
    setWipeText("");
    setUndo(null);
    load();
  };
  const signOut = async () => {
    await fetch(`${API}/login`, { method: "DELETE" });
    onOut();
  };
  const when = (ms: number) => new Date(ms).toLocaleString(lang === "ru" ? "ru-RU" : lang === "uk" ? "uk-UA" : "en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const filters: [Filter, L][] = [
    ["all", ADMIN.fAll],
    ["santa", ADMIN.fSanta],
    ["arrived", ADMIN.fArrived],
    ["waiting", ADMIN.fWaiting],
  ];

  return (
    <>
      <section className="ad-stats">
        <Stat label={tr(ADMIN.people)} value={stats?.people ?? 0} big />
        <Stat label={tr(ADMIN.parties)} value={stats?.parties ?? 0} />
        <Stat label={`🎅 ${tr(ADMIN.santa)}`} value={stats?.santa ?? 0} />
        <Stat label={tr(ADMIN.arrived)} value={stats?.arrivedPeople ?? 0} />
      </section>

      <section className="ad-box">
        <div className="ad-filters" role="group">
          {filters.map(([f, label]) => (
            <button key={f} type="button" className={filter === f ? "on" : ""} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {tr(label)}
              {f === "santa" ? ` · ${stats?.santa ?? 0}` : ""}
            </button>
          ))}
        </div>
        <div className="ad-tools">
          <input className="xm-input ad-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr(ADMIN.search)} />
          <button type="button" className="ad-btn" onClick={() => copy(phonesForTexting(shown), "phones")}>
            {copied === "phones" ? tr(ADMIN.copied) : `${tr(ADMIN.copyPhones)} (${shown.length})`}
          </button>
          <button type="button" className="ad-btn" onClick={() => copy(santaNames(shown), "santa")}>
            {copied === "santa" ? tr(ADMIN.copied) : tr(ADMIN.copySanta)}
          </button>
          <a className="ad-btn" href={`${API}/export`}>
            {tr(ADMIN.csv)}
          </a>
          <a className="ad-btn" href={`${API}/export?santa=1`}>
            {tr(ADMIN.csvSanta)}
          </a>
        </div>
        {err && <p className="xm-hint">{tr(err)}</p>}
        {undo && (
          <p className="ad-undo">
            {undo.label}{" "}
            <button
              type="button"
              onClick={async () => {
                await undo.run();
                setUndo(null);
                load();
              }}
            >
              {tr(ADMIN.undo)}
            </button>
          </p>
        )}
        <ul className="ad-list">
          {shown.length === 0 && <li className="ad-empty">{tr(ADMIN.empty)}</li>}
          {shown.map((r) => (
            <li key={r.id} className={r.arrived ? "here" : ""}>
              <div className="ad-main">
                <b>
                  {r.name}
                  {r.santa ? " 🎅" : ""}
                </b>
                <span className="ad-n">{r.party}</span>
                <a href={`tel:+1${r.phone}`}>{displayPhone(r.phone)}</a>
              </div>
              <div className="ad-sub">
                {tr(ADMIN.at)} {when(r.at)}
                {r.arrived ? " · ✓" : ""}
              </div>
              {r.santa && (
                <div className="ad-santa">
                  {r.likes.length === 0 && r.gifts.length === 0 ? (
                    <span className="ad-sub">{tr(ADMIN.noSantaData)}</span>
                  ) : (
                    <>
                      {r.likes.length > 0 && (
                        <p className="ad-likes">
                          <span className="ad-lbl">{tr(ADMIN.likes)}</span>
                          {r.likes.map((id) => {
                            const o = optionFor(id);
                            return (
                              <span key={id} className="ad-tag">
                                {o ? `${o.emoji} ${o.label[lang]}` : id}
                              </span>
                            );
                          })}
                        </p>
                      )}
                      {r.gifts.length > 0 && (
                        <div>
                          <span className="ad-lbl">{tr(ADMIN.gifts)}</span>
                          <ul className="ad-gifts">
                            {r.gifts.map((g, i) => (
                              <li key={i}>
                                {g.text}
                                {g.price !== null && <b> ${g.price}</b>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="ad-row-btns">
                <button type="button" className={r.arrived ? "" : "primary"} onClick={() => toggleArrived(r)}>
                  {r.arrived ? tr(ADMIN.unmark) : tr(ADMIN.markArrived)}
                </button>
                <button type="button" onClick={() => setEdit(r)}>
                  {tr(ADMIN.edit)}
                </button>
                <button type="button" onClick={() => del(r)}>
                  {tr(ADMIN.del)}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <EventForm tr={tr} details={details} setDetails={setDetails} origin={origin} />

      <section className="ad-box ad-danger">
        <p className="ad-small">{tr(ADMIN.retention)}</p>
        <div className="ad-tools">
          <button type="button" className="ad-btn" onClick={() => setWipe(true)}>
            {tr(ADMIN.wipe)}
          </button>
          <button type="button" className="ad-btn" onClick={signOut}>
            {tr(ADMIN.signOut)}
          </button>
        </div>
      </section>

      {wipe && (
        <div className="ad-sheet" role="dialog">
          <div className="ad-modal">
            <p>{tr(ADMIN.wipeAsk)}</p>
            <input className="xm-input" value={wipeText} onChange={(e) => setWipeText(e.target.value)} placeholder={tr(ADMIN.wipeType)} autoCapitalize="characters" />
            <div className="ad-tools">
              <button type="button" className="ad-btn danger" disabled={wipeText !== "DELETE"} onClick={doWipe}>
                {tr(ADMIN.wipe)}
              </button>
              <button type="button" className="ad-btn" onClick={() => setWipe(false)}>
                {tr(ADMIN.cancel)}
              </button>
            </div>
          </div>
        </div>
      )}

      {edit && <Editor tr={tr} rec={edit} onSave={save} onClose={() => setEdit(null)} />}
    </>
  );
}

function Stat({ label, value, big }: { label: string; value: number; big?: boolean }) {
  return (
    <div className={`ad-stat ${big ? "big" : ""}`}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function EventForm({ tr, details, setDetails, origin }: { tr: Tr; details: EventDetails; setDetails: (d: EventDetails) => void; origin: string }) {
  const [saved, setSaved] = useState(false);
  const [bad, setBad] = useState(false);
  const submit = async () => {
    setBad(false);
    const r = await fetch(`${API}/event`, { method: "PUT", headers: json, body: JSON.stringify({ details }) });
    if (!r.ok) return setBad(true);
    setDetails((await r.json()).details);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <section className="ad-box">
      <span className="xm-label">{tr(ADMIN.eventTitle)}</span>
      {LANGS.map((l) => (
        <label key={l} className="ad-ev">
          <span className="ad-lbl">
            {tr(ADMIN.evTitleLbl)} · {LANG_LABEL[l]}
          </span>
          <input className="xm-input" value={details.title[l]} placeholder={tr(ADMIN.evTitleHint)} maxLength={80} onChange={(e) => setDetails({ ...details, title: { ...details.title, [l]: e.target.value } })} />
        </label>
      ))}
      <div className="ad-ev2">
        <label className="ad-ev">
          <span className="ad-lbl">{tr(ADMIN.evDate)}</span>
          <input className="xm-input" type="date" value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })} />
        </label>
        <label className="ad-ev">
          <span className="ad-lbl">{tr(ADMIN.evTime)}</span>
          <input className="xm-input" type="time" value={details.time} onChange={(e) => setDetails({ ...details, time: e.target.value })} />
        </label>
      </div>
      <label className="ad-ev">
        <span className="ad-lbl">{tr(ADMIN.evPlace)}</span>
        <input className="xm-input" value={details.place} maxLength={120} onChange={(e) => setDetails({ ...details, place: e.target.value })} />
      </label>
      <div className="ad-tools">
        <button type="button" className="ad-btn primary" onClick={submit}>
          {tr(ADMIN.save)}
        </button>
        {saved && <span className="ad-ok">{tr(ADMIN.evSaved)}</span>}
        {bad && <span className="xm-hint">{tr(ADMIN.storeDown)}</span>}
      </div>
      <p className="ad-small">
        {tr(ADMIN.guestLink)}: <code>{origin}/christmas-checkin</code>
        <br />
        <code>?lang=ru</code> · <code>?lang=uk</code> · <code>?lang=en</code>
      </p>
    </section>
  );
}

function Editor({ tr, rec, onSave, onClose }: { tr: Tr; rec: XmasRecord; onSave: (r: XmasRecord) => void; onClose: () => void }) {
  const [r, setR] = useState(rec);
  return (
    <div className="ad-sheet" role="dialog">
      <div className="ad-modal">
        <label>
          <span className="xm-label">{tr(ADMIN.nameLbl)}</span>
          <input className="xm-input" value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} />
        </label>
        <label>
          <span className="xm-label">{tr(ADMIN.phoneLbl)}</span>
          <input className="xm-input" inputMode="tel" value={displayPhone(r.phone)} onChange={(e) => setR({ ...r, phone: formatPhone(e.target.value).replace(/\D/g, "") })} />
        </label>
        <div className="xm-stepper">
          <button type="button" onClick={() => setR({ ...r, party: clampParty(r.party - 1) })} disabled={r.party <= PARTY_MIN}>
            −
          </button>
          <output>{r.party}</output>
          <button type="button" onClick={() => setR({ ...r, party: clampParty(r.party + 1) })} disabled={r.party >= PARTY_MAX}>
            +
          </button>
        </div>
        <button type="button" className={`xm-santa ${r.santa ? "on" : ""}`} aria-pressed={r.santa} onClick={() => setR({ ...r, santa: !r.santa })}>
          <span className="xm-santa-ico" aria-hidden>
            🎅
          </span>
          <span className="xm-santa-txt">
            <b>{tr(ADMIN.santa)}</b>
          </span>
          <span className="xm-switch" aria-hidden>
            <i />
          </span>
        </button>
        <div className="ad-tools">
          <button type="button" className="ad-btn primary" onClick={() => onSave(r)}>
            {tr(ADMIN.save)}
          </button>
          <button type="button" className="ad-btn" onClick={onClose}>
            {tr(ADMIN.cancel)}
          </button>
        </div>
      </div>
    </div>
  );
}
