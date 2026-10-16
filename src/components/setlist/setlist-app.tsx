"use client";

import { useCallback, useEffect, useState } from "react";
import type { DesignId } from "@/lib/setlist/designs";
import { t } from "@/lib/setlist/i18n";
import { initialStore, loadStore, saveStore } from "@/lib/setlist/store";
import type { Couple, FlowId, FlowState, Lang, Store, View } from "@/lib/setlist/types";
import { usePlayer } from "@/lib/setlist/use-player";
import type { Ctx } from "./ctx";
import { Header } from "./header";
import { HomeScreen } from "./home-screen";
import { ResultsScreen } from "./results-screen";
import { StylesScreen } from "./styles-screen";
import { SwipeScreen } from "./swipe-screen";
import { WhoScreen } from "./who-screen";

export default function SetlistApp({ token, couple, design }: { token: string; couple: Couple; design: DesignId }) {
  const [store, setStore] = useState<Store>(initialStore);
  const [ready, setReady] = useState(false);
  const player = usePlayer();

  // localStorage only exists in the browser, so load after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read localStorage after hydration
    setStore(loadStore(token));
    setReady(true);
  }, [token]);
  useEffect(() => {
    if (ready) saveStore(token, store);
  }, [token, store, ready]);

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

  const names = { a: couple.names[0], b: couple.names[1], solo: store.lang === "ru" ? "Мы" : "Us" };
  const c: Ctx = { token, design, lang: store.lang, L, names, store, player, go, updFlow };
  const v = store.view;

  // A saved view may point at a person that no longer exists: fall back to home.
  const flow = v.flow;
  const pid = v.pid;
  const valid =
    v.screen === "home" ||
    (!!flow && (v.screen === "who" || v.screen === "results" || (!!pid && !!store.flows[flow].people[pid])));

  let back: (() => void) | undefined;
  if (v.screen === "who" || v.screen === "results") back = () => go({ screen: "home" });
  else if (v.screen === "styles" || v.screen === "swipe") back = () => go({ screen: "who", flow });

  if (!ready) return <div className={`sl d${design}`} />;
  return (
    <div className={`sl d${design} sl--${v.flow ?? "home"} sl-on-${valid ? v.screen : "home"}`} lang={store.lang}>
      <Header lang={store.lang} setLang={setLang} back={valid ? back : undefined} backLabel={L.back} />
      <main className="sl-main">
        {!valid || v.screen === "home" ? (
          <HomeScreen c={c} />
        ) : v.screen === "who" ? (
          <WhoScreen c={c} flow={flow!} />
        ) : v.screen === "styles" ? (
          <StylesScreen c={c} flow={flow!} pid={pid!} />
        ) : v.screen === "swipe" ? (
          <SwipeScreen c={c} flow={flow!} pid={pid!} />
        ) : (
          <ResultsScreen c={c} flow={flow!} />
        )}
      </main>
    </div>
  );
}
