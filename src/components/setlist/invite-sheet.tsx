"use client";

import { useEffect, useRef, useState } from "react";
import { createGuestLink } from "@/lib/setlist/api";
import { copyText } from "@/lib/setlist/export";
import { t } from "@/lib/setlist/i18n";
import type { Lang } from "@/lib/setlist/types";
import type { Ctx } from "./ctx";

// "Invite your guests": makes the couple's separate guest link and offers it with a ready message in English or Russian.
export function InviteSheet({ c, open, onClose }: { c: Ctx; open: boolean; onClose: () => void }) {
  const { L, token, store, setStore } = c;
  const ref = useRef<HTMLDialogElement>(null);
  const [lang, setLang] = useState<Lang>(c.lang);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState<"" | "link" | "msg">("");
  const guestToken = store.guestToken;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open || guestToken) return;
    let live = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset before asking the server
    setFailed(false);
    createGuestLink(token).then((g) => {
      if (!live) return;
      if (g) setStore((s) => ({ ...s, guestToken: g }));
      else setFailed(true);
    });
    return () => {
      live = false;
    };
  }, [open, guestToken, token, setStore]);

  const url = guestToken ? `${window.location.origin}/songs/g/${guestToken}` : "";
  const message = url ? t(lang).inviteMessage(url) : "";
  const copy = async (what: "link" | "msg") => {
    if (await copyText(what === "link" ? url : message)) {
      setCopied(what);
      setTimeout(() => setCopied(""), 2000);
    }
  };
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <dialog ref={ref} className="sl-sheet" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label={L.invite}>
      <div className="sl-sheet-in">
        <h2 className="sl-sheet-t">{L.invite}</h2>
        <div className="sl-lang sl-lang--sheet" role="group" aria-label="Language">
          {(["en", "ru"] as const).map((l) => (
            <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {failed ? (
          <p className="sl-note">{L.linkFailed}</p>
        ) : (
          <p className="sl-invite-msg" lang={lang}>{message || "…"}</p>
        )}
        {canShare ? (
          <button className="sl-cta" disabled={!url} onClick={() => navigator.share({ text: message, url }).catch(() => {})}>
            {L.share}
          </button>
        ) : (
          <button className="sl-cta" disabled={!url} onClick={() => copy("msg")}>
            {copied === "msg" ? `✓ ${L.copied}` : L.copyMessage}
          </button>
        )}
        <div className="sl-more sl-more--center">
          {canShare && <button className="sl-link" disabled={!url} onClick={() => copy("msg")}>{copied === "msg" ? `✓ ${L.copied}` : L.copyMessage}</button>}
          <button className="sl-link" disabled={!url} onClick={() => copy("link")}>{copied === "link" ? `✓ ${L.copied}` : L.copyLink}</button>
        </div>
        <button type="button" className="sl-link sl-sheet-done" onClick={onClose}>
          {L.close}
        </button>
      </div>
    </dialog>
  );
}
