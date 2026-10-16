"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { songById, styleById } from "@/lib/setlist/catalog";
import type { Strings } from "@/lib/setlist/i18n";
import type { Answer } from "@/lib/setlist/types";
import type { Player } from "@/lib/setlist/use-player";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const SWIPE_X = 90;
const SWIPE_UP = 110;

type Props = {
  L: Strings;
  player: Player;
  deck: string[];
  index: number;
  allowLove: boolean; // the couple can star a song (swipe up); guests only like or skip
  onAnswer: (a: Answer) => void;
  onUndo: () => void;
  onFinish: () => void; // the deck ran out
  topExtra?: ReactNode; // guests: add-a-song and Finish buttons next to Undo
};

// One song card at a time: swipe or tap Like / Skip (and star for the couple). Shared by the couple and the guest flow.
export function SwipeDeck({ L, player, deck, index, allowLove, onAnswer, onUndo, onFinish, topExtra }: Props) {
  const [drag, setDrag] = useState({ x: 0, y: 0, on: false });
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const art = useRef<HTMLDivElement>(null);

  const id = deck[index];
  const song = id ? songById(id) : undefined;
  const total = deck.length;

  // Warm the next two clips so the next card starts without a gap.
  useEffect(() => {
    for (const nid of deck.slice(index + 1, index + 3)) {
      const s = songById(nid);
      if (s) player.prefetch(s.clip);
    }
  }, [deck, index, player]);

  // Finished the deck (or nothing left).
  useEffect(() => {
    if (!song) onFinish();
  }, [song, onFinish]);

  const answer = useCallback(
    (a: Answer) => {
      if (!song) return;
      if (a === "love" && !allowLove) return;
      const nextId = deck[index + 1];
      const next = nextId ? songById(nextId) : undefined;
      // Start the next clip inside the same tap/gesture (iOS requires this).
      if (next) player.play(next.clip, { loop: true });
      else player.pause();
      onAnswer(a);
      setDrag({ x: 0, y: 0, on: false });
    },
    [song, allowLove, deck, index, player, onAnswer],
  );

  const undo = useCallback(() => {
    if (index <= 0) return;
    const prev = songById(deck[index - 1]);
    if (prev) player.play(prev.clip, { loop: true });
    onUndo();
  }, [deck, index, player, onUndo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA" || document.querySelector("dialog[open]")) return;
      if (e.key === "ArrowRight") answer("like");
      else if (e.key === "ArrowLeft") answer("skip");
      else if (e.key === "ArrowUp") answer("love");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  if (!song) return null;
  const st = styleById(song.style);
  const here = player.src?.endsWith(song.clip) ?? false;
  const playing = here && player.playing;
  const dur = here && player.duration ? player.duration : 30;
  const time = here ? Math.min(player.time, dur) : 0;
  const pct = (time / dur) * 100;

  const down = (e: PointerEvent<HTMLDivElement>) => {
    start.current = { x: e.clientX, y: e.clientY };
    dragged.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: 0, y: 0, on: true });
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const x = e.clientX - start.current.x;
    const y = allowLove ? Math.min(0, e.clientY - start.current.y) : 0;
    if (Math.abs(x) > 8 || Math.abs(y) > 8) dragged.current = true;
    setDrag({ x, y, on: true });
  };
  const up = () => {
    if (!start.current) return;
    start.current = null;
    if (drag.x > SWIPE_X) answer("like");
    else if (drag.x < -SWIPE_X) answer("skip");
    else if (drag.y < -SWIPE_UP) answer("love");
    else setDrag({ x: 0, y: 0, on: false });
  };
  // A tap on the picture (not a drag) plays or pauses. Click is a user gesture, so iOS allows it.
  // The pointer is captured by the drag area, so the tap is matched to the picture by position.
  const tapArt = (e: MouseEvent<HTMLDivElement>) => {
    const r = art.current?.getBoundingClientRect();
    const onArt = !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!dragged.current && onArt) player.toggle(song.clip, { loop: true });
    dragged.current = false;
  };

  const rot = drag.x / 18;
  const stamp = (v: number) => Math.max(0, Math.min(1, v));
  const color = { "--c": st?.color ?? "#555" } as CSSProperties;
  return (
    <>
      <div className="sl-ambient" style={color} aria-hidden="true" />
      <div className="sl-top">
        <div className="sl-bar" aria-hidden="true">
          <i style={{ width: `${(index / Math.max(1, total)) * 100}%` }} />
        </div>
        <div className="sl-prog">{L.songOf(index + 1, total)}</div>
        <button className="sl-undo" onClick={undo} disabled={index === 0} aria-label={L.undo}>
          <span aria-hidden="true">↶</span> <span className="lb">{L.undo}</span>
        </button>
        {topExtra}
      </div>
      <div
        key={song.id}
        className={`sl-card sl-slide ${drag.on ? "" : "settle"}`}
        style={{ ...color, transform: `translate(${drag.x}px, ${drag.y * 0.5}px) rotate(${rot}deg)` }}
      >
        <div
          className="sl-drag"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onClick={tapArt}
        >
          <div
            ref={art}
            className="sl-card-art"
            role="button"
            tabIndex={0}
            aria-label={playing ? L.pause : L.play}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), player.toggle(song.clip, { loop: true }))}
          >
            <span className="sl-stamp l" style={{ opacity: stamp(drag.x / SWIPE_X) }}>{L.like.toUpperCase()}</span>
            <span className="sl-stamp r" style={{ opacity: stamp(-drag.x / SWIPE_X) }}>{L.skip.toUpperCase()}</span>
            {allowLove && <span className="sl-stamp u" style={{ opacity: stamp(-drag.y / SWIPE_UP) }}>★ {L.mustPlay.toUpperCase()}</span>}
            <span className="sl-art">
              <span className="sl-hero emoji" aria-hidden="true">{st?.emoji}</span>
            </span>
            <span className={`sl-play ${player.unlocked ? "" : "pulse"}`} aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
            {!player.unlocked && <span className="sl-playhint">{L.tapToPlay}</span>}
          </div>
          <div className="sl-meta">
            <h2 className="sl-title">{song.title}</h2>
            <p className="sl-artist">
              {song.artist}
              {song.explicit && <span className="sl-chip sl-chip--e" title={L.explicitTag}>E</span>}
            </p>
            {song.moment && <span className="sl-chip sl-chip--moment">{L.moments[song.moment]}</span>}
          </div>
        </div>
        <div className="sl-scrub">
          <div className="sl-scrub-row">
            <span>{fmt(time)}</span>
            <input
              type="range"
              min={0}
              max={dur}
              step={0.1}
              value={time}
              aria-label={L.scrubLabel}
              style={{ "--pct": `${pct}%` } as CSSProperties}
              onChange={(e) => {
                if (!here) player.play(song.clip, { loop: true });
                player.seek(Number(e.target.value));
              }}
            />
            <span>{fmt(dur)}</span>
          </div>
        </div>
      </div>
      <div className="sl-sticky">
        <div className={`sl-actions ${allowLove ? "" : "sl-actions--two"}`}>
          <button className="sl-act sl-act--skip" onClick={() => answer("skip")}>
            <span className="ic" aria-hidden="true">✕</span> <span className="lb">{L.skip}</span>
          </button>
          <button className="sl-act sl-act--like" onClick={() => answer("like")}>
            <span className="ic" aria-hidden="true">♥</span> <span className="lb">{L.like}</span>
          </button>
          {allowLove && (
            <button className="sl-act sl-act--love" onClick={() => answer("love")}>
              <span className="ic" aria-hidden="true">★</span> <span className="lb">{L.mustPlay}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
