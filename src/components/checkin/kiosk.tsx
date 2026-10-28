"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_MODE, EVENT, KIOSK_RESET_SECONDS, MEALS, MODE_MEAL_LABEL_OVERRIDE, PARTY_MAX, PARTY_MIN, isMode, type Lang, type MealId, type ModeId } from "@/lib/checkin/config";
import { MEAL_LABEL, SCHEDULE, UI } from "@/lib/checkin/i18n";
import { cleanInput, clampParty, displayPhone, formatPhone, normalizePhone, questionsFor, type CheckinInput } from "@/lib/checkin/logic";
import { enqueue, flush, newId, readQueue, send } from "@/lib/checkin/queue";

type Screen = "form" | "done" | "already";
const LANG_KEY = "ck_lang";
const MODE_KEY = "ck_mode";
const IDLE_RESET_MS = 2 * 60 * 1000;

export default function Kiosk() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<ModeId>(DEFAULT_MODE);
  const [pendingMode, setPendingMode] = useState<ModeId | null>(null);
  const [screen, setScreen] = useState<Screen>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [party, setParty] = useState(1);
  const [overnight, setOvernight] = useState<boolean | null>(null);
  const [meals, setMeals] = useState<MealId[]>([]);
  const [formId, setFormId] = useState(() => newId());
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const [existing, setExisting] = useState<{ first: string; party: number } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [queuedNote, setQueuedNote] = useState(false);
  const [left, setLeft] = useState(KIOSK_RESET_SECONDS);
  const [showSchedule, setShowSchedule] = useState(false);
  const [online, setOnline] = useState(true);
  const [waiting, setWaiting] = useState(0);
  const [urlMode, setUrlMode] = useState(false);
  const [summary, setSummary] = useState<CheckinInput | null>(null);
  const lastTouch = useRef(0); // set on mount and on every touch

  const tr = (l: { en: string; ru: string }) => l[lang];
  const q = questionsFor(mode);

  // ---------- language + mode ----------
  useEffect(() => {
    lastTouch.current = Date.now();
    try {
      const saved = localStorage.getItem(LANG_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- must read localStorage after hydration
      if (saved === "en" || saved === "ru") setLang(saved);
      const m = new URLSearchParams(window.location.search).get("mode");
      if (isMode(m)) {
        setMode(m);
        setUrlMode(true);
      } else {
        const last = localStorage.getItem(MODE_KEY);
        if (isMode(last)) setMode(last);
      }
    } catch {}
    setOnline(navigator.onLine);
    setWaiting(readQueue().length);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const pickLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  // The staff screen sets the active mode on the server; every iPad follows it (unless the URL pins a mode).
  useEffect(() => {
    if (urlMode) return;
    let stop = false;
    const poll = async () => {
      try {
        const r = await fetch("/api/checkin/mode", { cache: "no-store" });
        const d = await r.json();
        if (!stop && d.ok && isMode(d.mode)) {
          setPendingMode(d.mode);
          try {
            localStorage.setItem(MODE_KEY, d.mode);
          } catch {}
        }
      } catch {}
    };
    poll();
    const t = setInterval(poll, 20000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [urlMode]);

  // ---------- offline outbox ----------
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

  // ---------- reset ----------
  const reset = useCallback(() => {
    setScreen("form");
    setName("");
    setPhone("");
    setParty(1);
    setOvernight(null);
    setMeals([]);
    setTried(false);
    setExisting(null);
    setUpdating(false);
    setQueuedNote(false);
    setSummary(null);
    setFormId(newId());
    setLeft(KIOSK_RESET_SECONDS);
    setPendingMode((p) => {
      if (p) setMode(p);
      return null;
    });
  }, []);

  useEffect(() => {
    if (screen !== "done") return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [screen]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the countdown ended: back to a blank form
    if (screen === "done" && left <= 0) reset();
  }, [screen, left, reset]);

  // A half-filled form left at the door goes blank after two idle minutes.
  const dirty = name !== "" || phone !== "" || party !== 1 || overnight !== null || meals.length > 0;
  useEffect(() => {
    const t = setInterval(() => {
      if (screen === "form" && dirty && Date.now() - lastTouch.current > IDLE_RESET_MS) reset();
      if (showSchedule && Date.now() - lastTouch.current > 60000) setShowSchedule(false);
    }, 5000);
    return () => clearInterval(t);
  }, [screen, dirty, showSchedule, reset]);
  // A mode change from staff applies as soon as the form is empty.
  useEffect(() => {
    if (pendingMode && pendingMode !== mode && screen === "form" && !dirty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- follow the staff-selected mode once the form is empty
      setMode(pendingMode);
      setPendingMode(null);
    }
  }, [pendingMode, mode, screen, dirty]);

  // ---------- form ----------
  const digitsOk = normalizePhone(phone) !== null;
  const nameOk = name.trim().length >= 2;
  const overnightOk = !q.overnight || overnight !== null;
  const required = 3 + (q.overnight ? 1 : 0); // name, phone, party (always has a value), overnight
  const done = (nameOk ? 1 : 0) + (digitsOk ? 1 : 0) + 1 + (q.overnight && overnight !== null ? 1 : 0);
  const canSubmit = nameOk && digitsOk && overnightOk;
  const mealIds: MealId[] = q.meals;
  const allOn = mealIds.length > 0 && mealIds.every((m) => meals.includes(m));
  const toggleMeal = (m: MealId) => setMeals((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  const missing = !nameOk ? tr(UI.missingName) : !digitsOk ? tr(UI.missingPhone) : !overnightOk ? tr(UI.missingOvernight) : "";

  async function onSubmit() {
    setTried(true);
    if (!canSubmit || busy) return;
    const parsed = cleanInput({ name, party, phone, overnight, meals, mode });
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
    if (r.outcome === "retry") {
      enqueue({ ...item, queuedAt: Date.now() }); // keep it safe on this iPad and send it later
      setQueuedNote(true);
      setWaiting(readQueue().length);
    }
    setSummary(parsed.value);
    setScreen("done");
  }

  const touch = () => {
    lastTouch.current = Date.now();
  };
  const mealLabel = (m: MealId) => tr(MEAL_LABEL[m]);
  const mealSub = (m: MealId) => (MODE_MEAL_LABEL_OVERRIDE[mode]?.[m] === "ifEvening" ? tr(UI.ifEvening) : "");

  return (
    <main className="ck-app" data-mode={mode} data-screen={screen} onPointerDownCapture={touch} onKeyDownCapture={touch}>
      <Hills />
      {(!online || waiting > 0) && (
        <div className="ck-banner" role="status">
          {!online ? tr(UI.offline) : `${waiting} ${tr(UI.pending)}`}
          {!online && waiting > 0 ? ` · ${waiting} ${tr(UI.pending)}` : ""}
        </div>
      )}

      <div className="ck-lang" role="group" aria-label="Language">
        <button type="button" className={lang === "en" ? "on" : ""} onClick={() => pickLang("en")} aria-pressed={lang === "en"}>
          EN
        </button>
        <button type="button" className={lang === "ru" ? "on" : ""} onClick={() => pickLang("ru")} aria-pressed={lang === "ru"}>
          RU
        </button>
      </div>

      <header className="ck-head">
        <h1 className="ck-title">{tr(EVENT.name)}</h1>
        <p className="ck-theme">{tr(EVENT.theme)}</p>
      </header>

      {screen === "form" && (
        <section className="ck-card" key="form">
          {updating && existing && (
            <p className="ck-note">
              {tr(UI.already)}: {existing.first} · {existing.party} {tr(UI.people)}
            </p>
          )}

          <div className="ck-progress" aria-hidden>
            <span style={{ width: `${(done / required) * 100}%` }} />
          </div>

          <div className="ck-grid">
            <div className="ck-col">
              <label className="ck-field">
                <span className="ck-label">{tr(UI.name)}</span>
                <input className={`ck-input ${tried && !nameOk ? "bad" : ""}`} value={name} onChange={(e) => setName(e.target.value)} placeholder={tr(UI.namePh)} autoComplete="off" autoCapitalize="words" autoCorrect="off" spellCheck={false} enterKeyHint="next" maxLength={80} />
              </label>

              <label className="ck-field">
                <span className="ck-label">{tr(UI.phone)}</span>
                <input className={`ck-input ${tried && !digitsOk ? "bad" : ""}`} value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder={tr(UI.phonePh)} inputMode="tel" type="tel" autoComplete="off" enterKeyHint="done" maxLength={16} />
              </label>

              <div className="ck-field">
                <span className="ck-label">
                  {tr(UI.party)} <i>{tr(UI.partyHint)}</i>
                </span>
                <div className="ck-stepper">
                  <button type="button" onClick={() => setParty((p) => clampParty(p - 1))} disabled={party <= PARTY_MIN} aria-label="−">
                    −
                  </button>
                  <output aria-live="polite">{party}</output>
                  <button type="button" onClick={() => setParty((p) => clampParty(p + 1))} disabled={party >= PARTY_MAX} aria-label="+">
                    +
                  </button>
                </div>
              </div>
            </div>

            {(q.overnight || mealIds.length > 0) && (
              <div className="ck-col">
                {q.overnight && (
                  <div className="ck-field">
                    <span className="ck-label">{tr(UI.overnight)}</span>
                    <div className={`ck-yn ${tried && overnight === null ? "bad" : ""}`} role="group">
                      <button type="button" className={overnight === true ? "on" : ""} aria-pressed={overnight === true} onClick={() => setOvernight(true)}>
                        {tr(UI.yes)}
                      </button>
                      <button type="button" className={overnight === false ? "on" : ""} aria-pressed={overnight === false} onClick={() => setOvernight(false)}>
                        {tr(UI.no)}
                      </button>
                    </div>
                  </div>
                )}

                {mealIds.length > 0 && (
                  <div className="ck-field">
                    <span className="ck-label ck-label-row">
                      {tr(UI.meals)}
                      <button type="button" className={`ck-chip ${allOn ? "on" : ""}`} aria-pressed={allOn} onClick={() => setMeals(allOn ? [] : [...mealIds])}>
                        {tr(UI.allMeals)}
                      </button>
                    </span>
                    <div className="ck-meals">
                      {MEALS.filter((m) => mealIds.includes(m)).map((m) => (
                        <button key={m} type="button" className={`ck-meal ${meals.includes(m) ? "on" : ""}`} aria-pressed={meals.includes(m)} onClick={() => toggleMeal(m)}>
                          <span className="ck-meal-ico" aria-hidden>
                            {MEAL_LABEL[m].icon}
                          </span>
                          <span className="ck-meal-txt">
                            {mealLabel(m)}
                            {mealSub(m) && <small>{mealSub(m)}</small>}
                          </span>
                          <span className="ck-tick" aria-hidden>
                            ✓
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="ck-actions">
            <p className="ck-hint" role="status">
              {tried && missing ? missing : ""}
            </p>
            <button type="button" className="ck-go" onClick={onSubmit} disabled={busy} data-ready={canSubmit}>
              {busy ? tr(UI.sending) : updating ? tr(UI.updateBtn) : tr(UI.checkIn)}
            </button>
          </div>
        </section>
      )}

      {screen === "done" && summary && (
        <section className="ck-card ck-center" key="done">
          <div className="ck-hero">{updating ? tr(UI.updated) : tr(UI.welcome)}</div>
          <p className="ck-sub">{tr(UI.welcomeSub)}</p>
          <ul className="ck-sum">
            <li>
              <b>{summary.name}</b>
              <span>
                {summary.party} {tr(UI.people)} · {displayPhone(summary.phone)}
              </span>
            </li>
            {summary.overnight !== null && (
              <li>
                <span>
                  {summary.overnight ? "🌙" : "🏠"} {tr(UI.overnight).replace("?", "")}: <b>{summary.overnight ? tr(UI.yes) : tr(UI.no)}</b>
                </span>
              </li>
            )}
            {mealIds.length > 0 && (
              <li>
                <span>{summary.meals.length ? summary.meals.map((m) => `${MEAL_LABEL[m].icon} ${tr(MEAL_LABEL[m])}`).join("  ·  ") : tr(UI.noMeals)}</span>
              </li>
            )}
          </ul>
          {queuedNote && <p className="ck-note">{tr(UI.saved)}</p>}
          <button type="button" className="ck-go" onClick={reset}>
            {tr(UI.newCheckin)} <small>{left}</small>
          </button>
        </section>
      )}

      {screen === "already" && existing && (
        <section className="ck-card ck-center" key="already">
          <div className="ck-hero small">{tr(UI.already)}</div>
          <p className="ck-sub">
            {existing.first} · {existing.party} {tr(UI.people)}
          </p>
          <p className="ck-sub">{tr(UI.alreadySub)}</p>
          <div className="ck-two">
            <button
              type="button"
              className="ck-go"
              onClick={() => {
                setUpdating(true);
                setScreen("form");
                setTried(false);
              }}
            >
              {tr(UI.updateYes)}
            </button>
            <button type="button" className="ck-ghost" onClick={reset}>
              {tr(UI.updateNo)}
            </button>
          </div>
        </section>
      )}

      {screen !== "done" && (
        <button type="button" className="ck-sched-btn" onClick={() => setShowSchedule(true)}>
          📅 {tr(UI.schedule)}
        </button>
      )}
      <footer className="ck-foot">{tr(EVENT.tagline)}</footer>

      {showSchedule && (
        <div className="ck-sheet" role="dialog" aria-modal="true" aria-label={tr(UI.schedule)}>
          <div className="ck-sheet-in">
            <div className="ck-sheet-head">
              <h2>{tr(UI.schedule)}</h2>
              <button type="button" className="ck-close" onClick={() => setShowSchedule(false)}>
                {tr(UI.close)}
              </button>
            </div>
            <div className="ck-days">
              {SCHEDULE.map((d, i) => (
                <div className="ck-day" key={i}>
                  <h3>{tr(d.title)}</h3>
                  <ul>
                    {d.rows.map((r, j) => (
                      <li key={j}>
                        <span className="t">{r.time ?? ""}</span>
                        <span className="i" aria-hidden>
                          {r.icon}
                        </span>
                        <span className="x">
                          {tr(r.title)}
                          {r.note && <small>{tr(r.note)}</small>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Soft mountains and pines along the bottom, like the camp poster.
function Hills() {
  return (
    <svg className="ck-hills" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <circle cx="170" cy="70" r="38" fill="#e8b93e" opacity=".55" />
      <path d="M0 150 L140 70 L250 130 L380 50 L520 140 L640 90 L780 150 L930 60 L1080 130 L1200 90 L1200 220 L0 220Z" fill="#c9d4bf" opacity=".55" />
      <path d="M0 175 L120 120 L240 165 L400 105 L560 170 L720 125 L880 175 L1040 120 L1200 170 L1200 220 L0 220Z" fill="#9db48f" opacity=".5" />
      {[40, 95, 1090, 1150].map((x, i) => (
        <path key={x} d={`M${x} ${215} l${-16 - (i % 2) * 4} 0 l${12} -26 l${-8} 0 l${12} -26 l${-8} 0 l${14} -30 l${14} 30 l${-8} 0 l${12} 26 l${-8} 0 l${12} 26 z`} fill="#1f4a35" opacity=".85" />
      ))}
    </svg>
  );
}
