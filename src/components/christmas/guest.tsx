"use client";

import { useCallback, useEffect, useState } from "react";
import { LANGS, LANG_LABEL, PARTY_MAX, PARTY_MIN, isLang, titleFor, type EventDetails, type Lang } from "@/lib/christmas/config";
import { UI, type L } from "@/lib/christmas/i18n";
import { cleanInput, clampParty, displayPhone, formatPhone, formatWhen, normalizePhone, type XmasInput } from "@/lib/christmas/logic";
import { enqueue, flush, newId, readQueue, send } from "@/lib/christmas/queue";
import { Lights, Snow } from "./decor";

type Screen = "form" | "done" | "already";
export const LANG_KEY = "xm_lang";

// ?lang=ru in a shared link wins, then the saved choice, then the phone's language, then English.
export function detectLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (isLang(q)) return q;
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {}
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("ru") ? "ru" : nav.startsWith("uk") ? "uk" : "en";
}

// Remember a language pick: saved on the phone, and written into the URL so a shared ?lang= link cannot undo it on reload.
export function rememberLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, l);
    const u = new URL(window.location.href);
    if (u.searchParams.has("lang")) {
      u.searchParams.set("lang", l);
      window.history.replaceState(null, "", u);
    }
  } catch {}
}

export function LangSwitch({ lang, onPick }: { lang: Lang; onPick: (l: Lang) => void }) {
  return (
    <div className="xm-lang" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button key={l} type="button" className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => onPick(l)}>
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export default function Guest({ details }: { details: EventDetails }) {
  const [lang, setLang] = useState<Lang>("en");
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [party, setParty] = useState(1);
  const [santa, setSanta] = useState(false);
  const [formId, setFormId] = useState(() => newId());
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const [existing, setExisting] = useState<{ first: string; party: number; santa: boolean } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [queuedNote, setQueuedNote] = useState(false);
  const [online, setOnline] = useState(true);
  const [waiting, setWaiting] = useState(0);
  const [failed, setFailed] = useState(false);
  const [summary, setSummary] = useState<XmasInput | null>(null);

  const tr = (l: L) => l[lang];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read the URL and localStorage after hydration
    setLang(detectLang());
    setReady(true);
    setOnline(navigator.onLine);
    setWaiting(readQueue().length);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const pickLang = (l: Lang) => {
    setLang(l);
    rememberLang(l);
  };

  // Offline outbox: send anything waiting now and whenever the connection comes back.
  const drain = useCallback(async () => {
    if (!readQueue().length) return setWaiting(0);
    setWaiting(await flush());
  }, []);
  useEffect(() => {
    const on = () => {
      setOnline(true);
      drain();
    };
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    const t = setInterval(drain, 10000);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- send anything left over from before a reload
    drain();
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      clearInterval(t);
    };
  }, [drain]);

  const resetForm = useCallback(() => {
    setScreen("form");
    setName("");
    setPhone("");
    setParty(1);
    setSanta(false);
    setTried(false);
    setExisting(null);
    setUpdating(false);
    setQueuedNote(false);
    setFailed(false);
    setSummary(null);
    setFormId(newId());
  }, []);

  const digitsOk = normalizePhone(phone) !== null;
  const nameOk = name.trim().length >= 2;
  const canSubmit = nameOk && digitsOk;
  const missing = !nameOk ? tr(UI.missingName) : !digitsOk ? tr(UI.missingPhone) : "";

  async function onSubmit() {
    setTried(true);
    setFailed(false);
    if (!canSubmit || busy) return;
    const parsed = cleanInput({ name, party, phone, santa });
    if (!parsed.ok) return;
    setBusy(true);
    const item = { ...parsed.value, id: formId, update: updating };
    const r = await send(item);
    setBusy(false);
    if (r.outcome === "duplicate" && r.existing) {
      setExisting(r.existing);
      setScreen("already");
      return;
    }
    if (r.outcome === "drop") return setFailed(true);
    if (r.outcome === "retry") {
      enqueue({ ...item, queuedAt: Date.now() }); // keep it safe on this phone and send it later
      setQueuedNote(true);
      setWaiting(readQueue().length);
    }
    setSummary(parsed.value);
    setScreen("done");
  }

  const when = formatWhen(details.date, details.time, lang);
  const sub = [when, details.place].filter(Boolean).join(" · ");
  const hero = screen === "done" ? (summary?.santa ? "🎅" : "🎁") : screen === "already" ? "🔔" : "🎄";

  return (
    <main className="xm-app" data-screen={screen} style={{ visibility: ready ? "visible" : "hidden" }}>
      <Snow />
      <Lights />
      <LangSwitch lang={lang} onPick={pickLang} />

      {(!online || waiting > 0) && (
        <div className="xm-banner" role="status">
          {!online ? tr(UI.offline) : `${waiting} ${tr(UI.pending)}`}
        </div>
      )}

      <header className="xm-head">
        <div className="xm-hero" key={hero} aria-hidden>
          {hero}
        </div>
        <h1 className="xm-title">{titleFor(details, lang)}</h1>
        {sub && <p className="xm-when">{sub}</p>}
      </header>

      {screen === "form" && (
        <section className="xm-card" key="form">
          <label className="xm-field">
            <span className="xm-label">{tr(UI.name)}</span>
            <input className={`xm-input ${tried && !nameOk ? "bad" : ""}`} value={name} onChange={(e) => setName(e.target.value)} placeholder={tr(UI.namePh)} autoComplete="name" autoCapitalize="words" enterKeyHint="next" maxLength={80} />
          </label>

          <label className="xm-field">
            <span className="xm-label">{tr(UI.phone)}</span>
            <input className={`xm-input ${tried && !digitsOk ? "bad" : ""}`} value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder={tr(UI.phonePh)} inputMode="tel" type="tel" autoComplete="tel-national" enterKeyHint="done" maxLength={16} />
          </label>

          <div className="xm-row">
            <span className="xm-label xm-label-flat">
              {tr(UI.party)} <i>{tr(UI.partyHint)}</i>
            </span>
            <div className="xm-stepper">
              <button type="button" onClick={() => setParty((p) => clampParty(p - 1))} disabled={party <= PARTY_MIN} aria-label="−">
                −
              </button>
              <output aria-live="polite">{party}</output>
              <button type="button" onClick={() => setParty((p) => clampParty(p + 1))} disabled={party >= PARTY_MAX} aria-label="+">
                +
              </button>
            </div>
          </div>

          <button type="button" className={`xm-santa ${santa ? "on" : ""}`} aria-pressed={santa} onClick={() => setSanta((s) => !s)}>
            <span className="xm-santa-ico" aria-hidden>
              🎅
            </span>
            <span className="xm-santa-txt">
              <b>{tr(UI.santaTitle)}</b>
              <small>{tr(UI.santaSub)}</small>
            </span>
            <span className="xm-switch" aria-hidden>
              <i />
            </span>
          </button>

          <p className="xm-hint" role="status">
            {failed ? tr(UI.error) : tried && missing ? missing : ""}
          </p>
          <button type="button" className="xm-go" onClick={onSubmit} disabled={busy} data-ready={canSubmit}>
            {busy ? tr(UI.sending) : updating ? tr(UI.updateBtn) : tr(UI.register)}
          </button>
        </section>
      )}

      {screen === "done" && summary && (
        <section className="xm-card xm-center" key="done">
          <h2 className="xm-big">{updating ? tr(UI.updatedTitle) : tr(UI.doneTitle)}</h2>
          <p className="xm-sub">{tr(UI.doneSub)}</p>
          <ul className="xm-sum">
            <li>
              <b>{summary.name}</b>
              <span>
                {summary.party} {tr(UI.people)} · {displayPhone(summary.phone)}
              </span>
            </li>
            <li>
              <span>
                {summary.santa ? "🎅" : "·"} {summary.santa ? tr(UI.santaYes) : tr(UI.santaNo)}
              </span>
            </li>
          </ul>
          {queuedNote && <p className="xm-note">{tr(UI.saved)}</p>}
          <button
            type="button"
            className="xm-go"
            onClick={() => {
              setSanta(summary.santa);
              setUpdating(true);
              setScreen("form");
              setTried(false);
              setQueuedNote(false);
              setFormId(newId());
            }}
          >
            {tr(UI.change)}
          </button>
          <button type="button" className="xm-ghost" onClick={resetForm}>
            {tr(UI.another)}
          </button>
        </section>
      )}

      {screen === "already" && existing && (
        <section className="xm-card xm-center" key="already">
          <h2 className="xm-big">{tr(UI.already)}</h2>
          <p className="xm-sub">
            {existing.first} · {existing.party} {tr(UI.people)}
            {existing.santa ? " · 🎅" : ""}
          </p>
          <p className="xm-sub">{tr(UI.alreadySub)}</p>
          <button
            type="button"
            className="xm-go"
            onClick={() => {
              setUpdating(true);
              setSanta(existing.santa);
              setScreen("form");
              setTried(false);
            }}
          >
            {tr(UI.updateYes)}
          </button>
          <button type="button" className="xm-ghost" onClick={resetForm}>
            {tr(UI.updateNo)}
          </button>
        </section>
      )}
    </main>
  );
}
