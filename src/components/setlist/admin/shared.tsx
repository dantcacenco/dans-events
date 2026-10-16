"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { copyText } from "@/lib/setlist/export";
import type { Song } from "@/lib/setlist/types";

// ---------- small helpers ----------
export const slug = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "couple";

export function relTime(ms: number, now = Date.now()): string {
  if (!ms) return "never";
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 14) return `${Math.floor(s / 86400)} d ago`;
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function prettyDate(d: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return "";
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

const noop = () => () => {};
export const useOrigin = () => useSyncExternalStore(noop, () => window.location.origin, () => "");

// ---------- URL state: ?c=<token> so the back button works ----------
const EVT = "sl-admin-nav";
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVT, cb);
  };
};
export function useSelectedToken(): string {
  return useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get("c") ?? "", () => "");
}
export function go(token: string | null, replace = false) {
  const url = token ? `${window.location.pathname}?c=${encodeURIComponent(token)}` : window.location.pathname;
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(EVT));
  window.scrollTo(0, 0);
}

// ---------- one shared <audio> for every little play button ----------
type Clips = { now: string | null; playing: boolean; toggle: (id: string, src: string) => void };
const ClipCtx = createContext<Clips>({ now: null, playing: false, toggle: () => {} });

export function ClipProvider({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLAudioElement>(null);
  const [now, setNow] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = useCallback((id: string, src: string) => {
    const a = el.current;
    if (!a) return;
    if (a.dataset.id === id && !a.paused) {
      a.pause();
      return;
    }
    if (a.dataset.id !== id) {
      a.dataset.id = id;
      a.src = src;
    }
    setNow(id);
    a.play().catch(() => setPlaying(false));
  }, []);
  return (
    <ClipCtx.Provider value={{ now, playing, toggle }}>
      {children}
      <audio ref={el} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
    </ClipCtx.Provider>
  );
}

export function ClipButton({ song }: { song: Pick<Song, "id" | "title" | "clip"> | undefined }) {
  const c = useContext(ClipCtx);
  if (!song?.clip) return <span className="ad-ic ad-ic--none" aria-hidden="true" />;
  const on = c.now === song.id && c.playing;
  return (
    <button type="button" className="ad-ic ad-play" aria-pressed={on} aria-label={`${on ? "Pause" : "Play"} clip: ${song.title}`} onClick={() => c.toggle(song.id, song.clip)}>
      <span aria-hidden="true">{on ? "❚❚" : "▶"}</span>
    </button>
  );
}

// ---------- buttons ----------
export function CopyButton({ text, label = "Copy", className = "ad-btn" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button type="button" className={className} onClick={async () => setDone(await copyText(text))}>
      {done ? "Copied" : label}
    </button>
  );
}

// Two taps: the first asks, the second does it.
export function ConfirmButton({ label, ask = "Sure?", onConfirm, className = "ad-btn ad-btn--danger", ariaLabel }: { label: string; ask?: string; onConfirm: () => void; className?: string; ariaLabel?: string }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" className={className} aria-label={ariaLabel} onClick={() => setOpen(true)}>
        {label}
      </button>
    );
  return (
    <span className="ad-confirm" role="group" aria-label={ariaLabel ?? label}>
      <span className="ad-confirm-q">{ask}</span>
      <button type="button" className="ad-btn ad-btn--danger" onClick={() => { setOpen(false); onConfirm(); }}>
        Yes, delete
      </button>
      <button type="button" className="ad-btn" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </span>
  );
}

export function Chip({ tone, children }: { tone?: "on" | "warn" | "off" | "ok"; children: React.ReactNode }) {
  return <span className={`ad-chip${tone ? ` ad-chip--${tone}` : ""}`}>{children}</span>;
}
