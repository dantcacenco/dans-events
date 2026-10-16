"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendGuestVote, syncCouplePicks } from "@/lib/setlist/api";
import { t } from "@/lib/setlist/i18n";
import { couplePicks } from "@/lib/setlist/master";
import { initialStore, loadStore, saveStore } from "@/lib/setlist/store";
import type { Couple, Extra, FlowId, FlowState, Lang, Store, View } from "@/lib/setlist/types";
import { usePlayer } from "@/lib/setlist/use-player";
import { AddSongSheet } from "./add-song-sheet";
import type { Ctx } from "./ctx";
import { Header } from "./header";
import { HomeScreen } from "./home-screen";
import { ResultsScreen } from "./results-screen";
import { StylesScreen } from "./styles-screen";
import { SwipeScreen } from "./swipe-screen";
import { ThanksScreen } from "./thanks-screen";
import { WelcomeScreen } from "./welcome-screen";
import { WhoScreen } from "./who-screen";

// The couple's page (token = their private link) and the guest page (token = the guest link, guest = true).
export default function SetlistApp({ token, couple, guest = false }: { token: string; couple: Couple; guest?: boolean }) {
  const [store, setStore] = useState<Store>(() => initialStore(guest));
  const [ready, setReady] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sentRev, setSentRev] = useState(0);
  const [sendFailed, setSendFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const lastSent = useRef("");
  const player = usePlayer();

  // localStorage only exists in the browser, so load after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read localStorage after hydration
    setStore(loadStore(token, guest));
    setReady(true);
  }, [token, guest]);
  useEffect(() => {
    if (ready) saveStore(token, store, guest);
  }, [token, store, ready, guest]);

  const L = t(store.lang);
  const go = useCallback(
    (view: View) => {
      if (view.screen !== "swipe") player.pause();
      setStore((s) => ({ ...s, view }));
      window.scrollTo({ top: 0 });
    },
    [player],
  );
  const updFlow = useCallback((flow: FlowId, fn: (f: FlowState) => FlowState) => {
    setStore((s) => ({ ...s, flows: { ...s.flows, [flow]: fn(s.flows[flow]) } }));
  }, []);
  const setLang = (lang: Lang) => setStore((s) => ({ ...s, lang }));
  const openAdd = useCallback(() => {
    player.pause();
    setAdding(true);
  }, [player]);

  // Guest: send the answers when they finish, and again whenever they change afterwards.
  const g = store.guest;
  const reception = store.flows.reception;
  const solo = reception.people.solo;
  const vote = guest && g
    ? {
        sessionId: g.sessionId,
        name: g.name,
        likes: Object.keys(solo?.answers ?? {}).filter((id) => solo!.answers[id] !== "skip"),
        skips: Object.keys(solo?.answers ?? {}).filter((id) => solo!.answers[id] === "skip"),
        extras: g.extras,
      }
    : null;
  const voteKey = JSON.stringify(vote);
  const onThanks = store.view.screen === "thanks";
  useEffect(() => {
    if (!guest || !ready || !onThanks || !vote || voteKey === lastSent.current) return;
    let live = true;
    sendGuestVote(token, vote).then((ok) => {
      if (!live) return;
      if (ok) {
        lastSent.current = voteKey;
        setSendFailed(false);
        setSentRev((n) => n + 1);
      } else setSendFailed(true);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- voteKey stands for vote
  }, [guest, ready, onThanks, voteKey, token, retry]);

  // Couple: once the guest link exists, keep the server copy of their picks fresh so guests see the combined counts.
  useEffect(() => {
    if (guest || !ready || !store.guestToken) return;
    const id = setTimeout(() => syncCouplePicks(token, couplePicks(reception)), 800);
    return () => clearTimeout(id);
  }, [guest, ready, store.guestToken, token, reception]);

  const addExtra = (e: Extra) => setStore((s) => (s.guest ? { ...s, guest: { ...s.guest, extras: [...s.guest.extras, e].slice(0, 5) } } : s));
  const removeExtra = (i: number) => setStore((s) => (s.guest ? { ...s, guest: { ...s.guest, extras: s.guest.extras.filter((_, k) => k !== i) } } : s));

  const names = { a: couple.names[0], b: couple.names[1], solo: store.lang === "ru" ? "Мы" : "Us" };
  const c: Ctx = { token, guest, lang: store.lang, L, names, store, player, go, updFlow, setStore, openAdd, sentRev, sendFailed, retrySend: () => { lastSent.current = ""; setRetry((n) => n + 1); } };
  const v = store.view;

  // A saved view may point at a person that no longer exists: fall back to the first screen.
  const flow = v.flow;
  const pid = v.pid;
  const first = guest ? "welcome" : "home";
  const valid = guest
    ? v.screen === "welcome" || v.screen === "thanks" || ((v.screen === "styles" || v.screen === "swipe") && !!reception.people.solo)
    : v.screen === "home" || (!!flow && (v.screen === "who" || v.screen === "results" || (!!pid && !!store.flows[flow].people[pid])));

  let back: (() => void) | undefined;
  if (guest) {
    if (v.screen === "styles") back = () => go({ screen: "welcome", flow: "reception" });
    else if (v.screen === "swipe") back = () => go({ screen: "styles", flow: "reception", pid: "solo" });
  } else if (v.screen === "who" || v.screen === "results") back = () => go({ screen: "home" });
  else if (v.screen === "styles" || v.screen === "swipe") back = () => go({ screen: "who", flow });

  // The phone's back gesture / button steps up one screen instead of leaving the page.
  // One spare history entry sits on top; each back press is caught here and the entry is put back.
  const backRef = useRef(back);
  useEffect(() => {
    backRef.current = valid ? back : undefined;
  });
  useEffect(() => {
    if (!history.state?.sl) history.pushState({ sl: 1 }, "");
    const onPop = () => {
      if (backRef.current) {
        backRef.current();
        history.pushState({ sl: 1 }, "");
      } else {
        window.removeEventListener("popstate", onPop);
        history.back(); // already on the first screen: really leave
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (!ready) return <div className="sl" />;
  const screen = valid ? v.screen : first;
  return (
    <div className={`sl sl--${guest ? "reception" : (v.flow ?? "home")} sl-on-${screen}`} lang={store.lang}>
      <Header lang={store.lang} setLang={setLang} back={valid ? back : undefined} backLabel={L.back} />
      <main className="sl-main">
        {screen === "home" ? (
          <HomeScreen c={c} />
        ) : screen === "welcome" ? (
          <WelcomeScreen c={c} />
        ) : screen === "thanks" ? (
          <ThanksScreen c={c} />
        ) : screen === "who" ? (
          <WhoScreen c={c} flow={flow!} />
        ) : screen === "styles" ? (
          <StylesScreen c={c} flow={flow!} pid={pid!} />
        ) : screen === "swipe" ? (
          <SwipeScreen c={c} flow={flow!} pid={pid!} />
        ) : (
          <ResultsScreen c={c} flow={flow!} />
        )}
      </main>
      {guest && <AddSongSheet L={L} open={adding} onClose={() => setAdding(false)} extras={g?.extras ?? []} onAdd={addExtra} onRemove={removeExtra} />}
    </div>
  );
}
