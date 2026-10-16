"use client";

import { useEffect, useState } from "react";
import { fetchMaster } from "@/lib/setlist/api";
import type { MasterData } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";
import { MasterList } from "./master-list";

// Guest finish line: a thank-you and the live list of what everyone likes (counts only).
export function ThanksScreen({ c }: { c: Ctx }) {
  const { L, token, go, openAdd, sentRev, sendFailed, retrySend } = c;
  const [data, setData] = useState<MasterData | null>(null);

  useEffect(() => {
    let live = true;
    fetchMaster({ guestToken: token }).then((m) => live && setData(m));
    return () => {
      live = false;
    };
  }, [token, sentRev]);

  return (
    <div className="sl-thanks">
      <div className="sl-ambient" style={{ "--c": "#bc3021" } as React.CSSProperties} aria-hidden="true" />
      <span className="sl-hero" aria-hidden="true">🎉</span>
      <h1 className="sl-h1">{L.thanks}</h1>
      <p className="sl-sub">{L.thanksSub}</p>
      {sendFailed && (
        <button className="sl-link" onClick={retrySend}>
          {L.sendFailed}
        </button>
      )}
      <MasterList c={c} data={data} readOnly />
      <div className="sl-more">
        <button className="sl-link" onClick={openAdd}>＋ {L.addSong}</button>
        <button className="sl-link" onClick={() => go({ screen: "styles", flow: "reception", pid: "solo" })}>{L.moreSongs}</button>
      </div>
    </div>
  );
}
