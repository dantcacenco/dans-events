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

const KEEP_BLOBS = 6;

// One shared <audio> element for the whole page. iOS only lets audio start inside a tap, and an
// element that has already played once may be re-pointed at a new clip and started from a later tap.
// Upcoming clips are downloaded into memory (blob URLs) so the next card starts instantly and seeks cleanly.
export function usePlayer(): Player {
  const el = useRef<HTMLAudioElement | null>(null);
  const cur = useRef<string | null>(null);
  const limit = useRef<number | null>(null);
  const blobs = useRef(new Map<string, string>()); // clip path -> blob URL, oldest first
  const pending = useRef(new Set<string>());
  const raf = useRef(0);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // iOS mutes web audio when the ringer switch is on silent; "playback" makes it behave like music (iOS 16.4+).
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";

    const a = new Audio();
    a.preload = "auto";
    el.current = a;
    const urls = blobs.current;
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
    // A tab sent to the background should go quiet.
    const onHide = () => document.hidden && a.pause();
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      cancelAnimationFrame(raf.current);
      a.pause();
      a.removeAttribute("src");
      a.load();
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const start = useCallback((a: HTMLAudioElement) => {
    a.play().then(
      () => setUnlocked(true),
      () => setPlaying(false), // blocked until a tap: the card keeps asking for one
    );
  }, []);

  const play = useCallback(
    (s: string, o: PlayOpts = {}) => {
      const a = el.current;
      if (!a) return;
      limit.current = o.limit ?? null;
      a.loop = !!o.loop;
      if (cur.current !== s) {
        cur.current = s;
        a.dataset.clip = s;
        a.src = blobs.current.get(s) ?? s;
        setSrc(s);
        setTime(0);
        setDuration(0);
      }
      a.currentTime = 0;
      start(a);
    },
    [start],
  );

  const pause = useCallback(() => el.current?.pause(), []);

  const toggle = useCallback(
    (s: string, o: PlayOpts = {}) => {
      const a = el.current;
      if (!a) return;
      if (cur.current === s && !a.paused) a.pause();
      else if (cur.current === s && limit.current === (o.limit ?? null)) {
        a.loop = !!o.loop;
        start(a);
      } else play(s, o);
    },
    [play, start],
  );

  const seek = useCallback((t: number) => {
    const a = el.current;
    if (!a) return;
    a.currentTime = t;
    setTime(t);
  }, []);

  const prefetch = useCallback((s: string) => {
    if (blobs.current.has(s) || pending.current.has(s)) return;
    pending.current.add(s);
    fetch(s)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) => {
        blobs.current.set(s, URL.createObjectURL(b));
        // Drop the oldest copies, never the clip that is playing.
        for (const [k, u] of blobs.current) {
          if (blobs.current.size <= KEEP_BLOBS) break;
          if (k === cur.current) continue;
          URL.revokeObjectURL(u);
          blobs.current.delete(k);
        }
      })
      .catch(() => {})
      .finally(() => pending.current.delete(s));
  }, []);

  return { src, playing, time, duration, unlocked, play, toggle, pause, seek, prefetch };
}
