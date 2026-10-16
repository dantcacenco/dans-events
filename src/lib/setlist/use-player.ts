"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PlayOpts = { loop?: boolean; limit?: number };
export type Player = {
  src: string | null;
  playing: boolean;
  time: number;
  duration: number;
  unlocked: boolean;
  play: (src: string, opts?: PlayOpts) => void;
  toggle: (src: string, opts?: PlayOpts) => void;
  pause: () => void;
  seek: (t: number) => void;
  prefetch: (src: string) => void;
};

// One shared <audio> element for the whole page. iOS only lets audio start inside a tap, and an
// element that has already played once may be re-pointed at a new clip and started from a later tap.
export function usePlayer(): Player {
  const el = useRef<HTMLAudioElement | null>(null);
  const limit = useRef<number | null>(null);
  const warmed = useRef(new Set<string>());
  const raf = useRef(0);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    el.current = a;
    const tick = () => {
      setTime(a.currentTime);
      if (limit.current !== null && a.currentTime >= limit.current) {
        a.pause();
        a.currentTime = 0;
      }
      raf.current = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(raf.current);
      setTime(a.currentTime);
    };
    const onMeta = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    return () => {
      cancelAnimationFrame(raf.current);
      a.pause();
      a.removeAttribute("src");
      a.load();
    };
  }, []);

  const play = useCallback((s: string, o: PlayOpts = {}) => {
    const a = el.current;
    if (!a) return;
    limit.current = o.limit ?? null;
    a.loop = !!o.loop;
    if (!a.src.endsWith(s)) {
      a.src = s;
      setSrc(s);
      setTime(0);
      setDuration(0);
    }
    a.currentTime = 0;
    setUnlocked(true);
    a.play().catch(() => setPlaying(false));
  }, []);

  const pause = useCallback(() => el.current?.pause(), []);

  const toggle = useCallback(
    (s: string, o: PlayOpts = {}) => {
      const a = el.current;
      if (!a) return;
      if (a.src.endsWith(s) && !a.paused) a.pause();
      else if (a.src.endsWith(s) && limit.current === (o.limit ?? null)) {
        a.loop = !!o.loop;
        setUnlocked(true);
        a.play().catch(() => setPlaying(false));
      } else play(s, o);
    },
    [play],
  );

  const seek = useCallback((t: number) => {
    const a = el.current;
    if (!a) return;
    a.currentTime = t;
    setTime(t);
  }, []);

  // Warm the HTTP cache so the next card starts without a gap.
  const prefetch = useCallback((s: string) => {
    if (warmed.current.has(s)) return;
    warmed.current.add(s);
    fetch(s, { cache: "force-cache" }).catch(() => warmed.current.delete(s));
  }, []);

  return { src, playing, time, duration, unlocked, play, toggle, pause, seek, prefetch };
}
