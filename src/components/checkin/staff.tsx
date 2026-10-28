"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EVENT, MEALS, MODES, PARTY_MAX, PARTY_MIN, type Lang, type MealId, type ModeId } from "@/lib/checkin/config";
import { MEAL_LABEL, MODE_TITLE, STAFF } from "@/lib/checkin/i18n";
import { clampParty, displayPhone, formatPhone, phonesForTexting, questionsFor, searchRecords, type CheckinRecord, type Stats } from "@/lib/checkin/logic";

const LANG_KEY = "ck_lang";
type Undo = { label: string; run: () => Promise<void> } | null;

export default function StaffApp({ authed }: { authed: boolean }) {
  const [lang, setLang] = useState<Lang>("en");
  const [ok, setOk] = useState(authed);
  const tr = (l: { en: string; ru: string }) => l[lang];
  useEffect(() => {
    try {
      const s = localStorage.getItem(LANG_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- must read localStorage after hydration
      if (s === "en" || s === "ru") setLang(s);
    } catch {}
  }, []);
  const pick = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  return (
    <main className="st">
      <div className="st-top">
        <h1>{tr(STAFF.title)}</h1>
        <div className="ck-lang st-lang" role="group" aria-label="Language">
          <button type="button" className={lang === "en" ? "on" : ""} onClick={() => pick("en")}>
            EN
          </button>
          <button type="button" className={lang === "ru" ? "on" : ""} onClick={() => pick("ru")}>
            RU
          </button>
        </div>
      </div>
      {ok ? <Dashboard tr={tr} lang={lang} onOut={() => setOk(false)} /> : <Login tr={tr} onIn={() => setOk(true)} />}
    </main>
  );
}

function Login({ tr, onIn }: { tr: (l: { en: string; ru: string }) => string; onIn: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const go = async () => {
    setErr("");
    const r = await fetch("/api/checkin/staff/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    if (r.ok) return onIn();
    setErr(r.status === 429 ? tr(STAFF.tooMany) : tr(STAFF.wrong));
  };
  return (
    <form
      className="st-box st-login"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
    >
      <label>
        <span className="ck-label">{tr(STAFF.pin)}</span>
        <input className="ck-input" type="password" inputMode="text" autoComplete="current-password" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus />
      </label>
      {err && <p className="ck-hint">{err}</p>}
      <button className="ck-go" type="submit">
        {tr(STAFF.signIn)}
      </button>
    </form>
  );
}

function Dashboard({ tr, lang, onOut }: { tr: (l: { en: string; ru: string }) => string; lang: Lang; onOut: () => void }) {
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [mode, setModeState] = useState<ModeId>("fri-am");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<CheckinRecord | null>(null);
  const [undo, setUndo] = useState<Undo>(null);
  const [copied, setCopied] = useState(false);
  const [wipe, setWipe] = useState(false);
  const [wipeText, setWipeText] = useState("");
  const [err, setErr] = useState("");
  const [origin, setOrigin] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/checkin/staff/records", { cache: "no-store" });
    if (r.status === 401) return onOut();
    if (!r.ok) return setErr("store");
    const d = await r.json();
    setErr("");
    setRecords(d.records);
    setStats(d.stats);
    setModeState(d.mode);
  }, [onOut]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- origin is only known in the browser
    setOrigin(window.location.origin);
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  const shown = useMemo(() => searchRecords(records, q), [records, q]);

  const setMode = async (m: ModeId) => {
    setModeState(m);
    await fetch("/api/checkin/mode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: m }) });
  };
  const del = async (r: CheckinRecord) => {
    await fetch("/api/checkin/staff/records", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: r.id }) });
    setUndo({
      label: `${tr(STAFF.deleted)}: ${r.name}`,
      run: async () => {
        await fetch("/api/checkin/staff/records", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ restore: r }) });
      },
    });
    load();
  };
  const save = async (next: CheckinRecord) => {
    const before = records.find((x) => x.id === next.id);
    const r = await fetch("/api/checkin/staff/records", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: next.id, record: next }) });
    if (!r.ok) return setErr((await r.json().catch(() => ({}))).error || "error");
    setEdit(null);
    if (before)
      setUndo({
        label: `${tr(STAFF.edited)}: ${next.name}`,
        run: async () => {
          await fetch("/api/checkin/staff/records", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: before.id, record: before }) });
        },
      });
    load();
  };
  const copyPhones = async () => {
    const text = phonesForTexting(shown);
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const doWipe = async () => {
    await fetch("/api/checkin/staff/wipe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: wipeText }) });
    setWipe(false);
    setWipeText("");
    setUndo(null);
    load();
  };
  const signOut = async () => {
    await fetch("/api/checkin/staff/login", { method: "DELETE" });
    onOut();
  };
  const t = (ms: number) => new Date(ms).toLocaleString(lang === "ru" ? "ru-RU" : "en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });

  return (
    <>
      <section className="st-box">
        <span className="ck-label">{tr(STAFF.mode)}</span>
        <div className="st-modes">
          {MODES.map((m) => (
            <button key={m} type="button" className={mode === m ? "on" : ""} onClick={() => setMode(m)} aria-pressed={mode === m}>
              {tr(MODE_TITLE[m])}
            </button>
          ))}
        </div>
        <p className="st-small">
          {tr(STAFF.kiosk)}: <code>{origin}/checkin?mode={mode}</code>
        </p>
      </section>

      <section className="st-stats">
        <Stat label={tr(STAFF.people)} value={stats?.people ?? 0} big />
        <Stat label={tr(STAFF.parties)} value={stats?.parties ?? 0} />
        <Stat label={tr(STAFF.overnight)} value={stats?.overnightPeople ?? 0} />
      </section>

      <section className="st-box">
        <span className="ck-label">{tr(STAFF.mealsTitle)}</span>
        <div className="st-meals">
          {MEALS.map((m) => (
            <div key={m}>
              <b>{stats?.meals[m] ?? 0}</b>
              <span>
                {MEAL_LABEL[m].icon} {tr(MEAL_LABEL[m])}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="st-box">
        <div className="st-tools">
          <input className="ck-input st-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr(STAFF.search)} />
          <button type="button" className="st-btn" onClick={copyPhones}>
            {copied ? tr(STAFF.copied) : `${tr(STAFF.copyPhones)} (${shown.length})`}
          </button>
          <a className="st-btn" href="/api/checkin/staff/export">
            {tr(STAFF.csv)}
          </a>
        </div>
        {err && <p className="ck-hint">{err}</p>}
        {undo && (
          <p className="st-undo">
            {undo.label}{" "}
            <button
              type="button"
              onClick={async () => {
                await undo.run();
                setUndo(null);
                load();
              }}
            >
              {tr(STAFF.undo)}
            </button>
          </p>
        )}
        <ul className="st-list">
          {shown.length === 0 && <li className="st-empty">{tr(STAFF.empty)}</li>}
          {shown.map((r) => (
            <li key={r.id}>
              <div className="st-main">
                <b>{r.name}</b>
                <span className="st-n">{r.party}</span>
                <a href={`tel:+1${r.phone}`}>{displayPhone(r.phone)}</a>
              </div>
              <div className="st-sub">
                {tr(MODE_TITLE[r.mode])} · {t(r.at)}
                {r.overnight ? " · 🌙" : ""}
                {r.meals.length ? " · " + r.meals.map((m) => MEAL_LABEL[m].icon).join("") : ""}
              </div>
              <div className="st-row-btns">
                <button type="button" onClick={() => setEdit(r)}>
                  {tr(STAFF.edit)}
                </button>
                <button type="button" onClick={() => del(r)}>
                  {tr(STAFF.del)}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="st-box st-danger">
        <p className="st-small">{tr(STAFF.retention)}</p>
        <div className="st-tools">
          <button type="button" className="st-btn" onClick={() => setWipe(true)}>
            {tr(STAFF.wipe)}
          </button>
          <button type="button" className="st-btn" onClick={signOut}>
            {tr(STAFF.signOut)}
          </button>
        </div>
        <p className="st-small">
          {EVENT.id}
          {EVENT.fridayDate ? ` · ${EVENT.fridayDate}` : ""}
        </p>
      </section>

      {wipe && (
        <div className="ck-sheet st-sheet" role="dialog">
          <div className="ck-sheet-in st-modal">
            <p>{tr(STAFF.wipeAsk)}</p>
            <input className="ck-input" value={wipeText} onChange={(e) => setWipeText(e.target.value)} placeholder={tr(STAFF.wipeType)} autoCapitalize="characters" />
            <div className="st-tools">
              <button type="button" className="st-btn danger" disabled={wipeText !== "DELETE"} onClick={doWipe}>
                {tr(STAFF.wipe)}
              </button>
              <button type="button" className="st-btn" onClick={() => setWipe(false)}>
                {tr(STAFF.cancel)}
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
    <div className={`st-stat ${big ? "big" : ""}`}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Editor({ tr, rec, onSave, onClose }: { tr: (l: { en: string; ru: string }) => string; rec: CheckinRecord; onSave: (r: CheckinRecord) => void; onClose: () => void }) {
  const [r, setR] = useState(rec);
  const qs = questionsFor(r.mode);
  const toggle = (m: MealId) => setR((c) => ({ ...c, meals: c.meals.includes(m) ? c.meals.filter((x) => x !== m) : [...c.meals, m] }));
  return (
    <div className="ck-sheet st-sheet" role="dialog">
      <div className="ck-sheet-in st-modal">
        <label>
          <span className="ck-label">{tr(STAFF.nameLbl)}</span>
          <input className="ck-input" value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} />
        </label>
        <label>
          <span className="ck-label">{tr(STAFF.phoneLbl)}</span>
          <input className="ck-input" inputMode="tel" value={displayPhone(r.phone)} onChange={(e) => setR({ ...r, phone: formatPhone(e.target.value).replace(/\D/g, "") })} />
        </label>
        <div className="ck-stepper">
          <button type="button" onClick={() => setR({ ...r, party: clampParty(r.party - 1) })} disabled={r.party <= PARTY_MIN}>
            −
          </button>
          <output>{r.party}</output>
          <button type="button" onClick={() => setR({ ...r, party: clampParty(r.party + 1) })} disabled={r.party >= PARTY_MAX}>
            +
          </button>
        </div>
        {qs.overnight && (
          <div className="ck-yn">
            <button type="button" className={r.overnight === true ? "on" : ""} onClick={() => setR({ ...r, overnight: true })}>
              🌙
            </button>
            <button type="button" className={r.overnight === false ? "on" : ""} onClick={() => setR({ ...r, overnight: false })}>
              🏠
            </button>
          </div>
        )}
        <div className="ck-meals">
          {qs.meals.map((m) => (
            <button key={m} type="button" className={`ck-meal ${r.meals.includes(m) ? "on" : ""}`} onClick={() => toggle(m)}>
              <span className="ck-meal-ico">{MEAL_LABEL[m].icon}</span>
              <span className="ck-meal-txt">{tr(MEAL_LABEL[m])}</span>
              <span className="ck-tick">✓</span>
            </button>
          ))}
        </div>
        <div className="st-tools">
          <button type="button" className="st-btn primary" onClick={() => onSave(r)}>
            {tr(STAFF.save)}
          </button>
          <button type="button" className="st-btn" onClick={onClose}>
            {tr(STAFF.cancel)}
          </button>
        </div>
      </div>
    </div>
  );
}
