"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { anim } from "@/lib/pixel-mob/animations";
import type { Cue, PhonePosition } from "@/lib/pixel-mob/types";

type Stage = "welcome" | "syncing" | "ready" | "countdown" | "playing" | "idle";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

function getStoredRegistration(): { deviceId: string; position: PhonePosition; syncVersion: number; registeredAt: number } | null {
  try {
    const raw = localStorage.getItem("pixelMob");
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.registeredAt > TWELVE_HOURS) {
      localStorage.removeItem("pixelMob");
      return null;
    }
    return data;
  } catch { return null; }
}

function generateDeviceId(): string {
  return "pm_" + crypto.randomUUID();
}

async function syncClock(baseUrl: string): Promise<number> {
  const samples: { offset: number; roundTrip: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const t1 = performance.now();
    const res = await fetch(`${baseUrl}/api/pixel-mob/sync`);
    const t2 = performance.now();
    const data = await res.json();
    const roundTrip = t2 - t1;
    const oneWay = roundTrip / 2;
    const localMid = Date.now() - (t2 - t1) / 2;
    const offset = data.now - localMid;
    samples.push({ offset, roundTrip });
    await new Promise(r => setTimeout(r, 100));
  }
  samples.sort((a, b) => a.roundTrip - b.roundTrip);
  const trimmed = samples.slice(2, 8);
  return trimmed.reduce((s, x) => s + x.offset, 0) / trimmed.length;
}

export default function GuestScreen() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [deviceId, setDeviceId] = useState<string>("");
  const [position, setPosition] = useState<PhonePosition | null>(null);
  const [clockOffset, setClockOffset] = useState(0);
  const [currentCue, setCurrentCue] = useState<Cue | null>(null);
  const [syncVersion, setSyncVersion] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [bgColor, setBgColor] = useState("rgb(0,0,0)");
  const [bgOpacity, setBgOpacity] = useState(0);

  const animRef = useRef<number>(0);
  const cueRef = useRef<Cue | null>(null);
  const posRef = useRef<PhonePosition | null>(null);
  const offsetRef = useRef(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastCueIdRef = useRef<string>("");

  useEffect(() => { cueRef.current = currentCue; }, [currentCue]);
  useEffect(() => { posRef.current = position; }, [position]);
  useEffect(() => { offsetRef.current = clockOffset; }, [clockOffset]);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch { /* not supported or denied */ }
  };

  const goFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch { /* not supported */ }
  };

  const register = useCallback(async (did: string, force = false) => {
    if (!force) {
      const stored = getStoredRegistration();
      if (stored) {
        setDeviceId(stored.deviceId);
        setPosition(stored.position);
        setSyncVersion(stored.syncVersion);
        return stored;
      }
    }

    const res = await fetch("/api/pixel-mob/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: did }),
    });
    const data = await res.json();
    const reg = {
      deviceId: did,
      position: data.position as PhonePosition,
      syncVersion: data.syncVersion as number,
      registeredAt: Date.now(),
    };
    localStorage.setItem("pixelMob", JSON.stringify(reg));
    setDeviceId(did);
    setPosition(reg.position);
    setSyncVersion(reg.syncVersion);
    return reg;
  }, []);

  const handleJoin = async () => {
    await goFullscreen();
    await requestWakeLock();

    setStage("syncing");

    const stored = getStoredRegistration();
    const did = stored?.deviceId || generateDeviceId();

    await register(did);

    const offset = await syncClock("");
    setClockOffset(offset);

    setStage("ready");
  };

  // Poll for show state
  useEffect(() => {
    if (stage !== "ready" && stage !== "playing" && stage !== "idle" && stage !== "countdown") return;

    const poll = setInterval(async () => {
      try {
        const url = deviceId ? `/api/pixel-mob/state?deviceId=${deviceId}` : "/api/pixel-mob/state";
        const res = await fetch(url);
        const data = await res.json();
        setDeviceCount(data.deviceCount);

        if (data.syncVersion !== syncVersion && syncVersion > 0) {
          setSyncVersion(data.syncVersion);
          await register(deviceId, true);
        }

        if (data.currentCue && data.currentCue.id !== lastCueIdRef.current) {
          lastCueIdRef.current = data.currentCue.id;
          setCurrentCue(data.currentCue);
          setStage("countdown");
        } else if (!data.currentCue && currentCue) {
          setCurrentCue(null);
          lastCueIdRef.current = "";
          setStage("idle");
        }
      } catch { /* retry next tick */ }
    }, 1000);

    return () => clearInterval(poll);
  }, [stage, deviceId, syncVersion, currentCue, register]);

  // Countdown + playback
  useEffect(() => {
    if (stage !== "countdown" && stage !== "playing") return;

    const tick = () => {
      const cue = cueRef.current;
      const pos = posRef.current;
      if (!cue || !pos) { animRef.current = requestAnimationFrame(tick); return; }

      const serverNow = Date.now() + offsetRef.current;
      const until = cue.startAt - serverNow;

      if (until > 0) {
        setCountdown(Math.ceil(until / 1000));
        setStage("countdown");
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = -until / 1000;
      if (cue.duration > 0 && elapsed > cue.duration / 1000) {
        setStage("idle");
        setBgOpacity(0);
        return;
      }

      setStage("playing");
      const [r, g, b, a] = anim(cue.animation, pos, elapsed, cue.params, 0);
      setBgColor(`rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`);
      setBgOpacity(a);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [stage]);

  if (stage === "welcome") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff", padding: 32, textAlign: "center",
      }}>
        <div style={{ fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>
          Crowd Pixel
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
          Join the Light Show
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 280, lineHeight: 1.6, margin: "0 0 40px" }}>
          Your phone screen becomes part of a coordinated crowd light display. Tap below to join.
        </p>
        <button onClick={handleJoin} style={{
          background: "#ff006e", color: "#fff", border: "none", borderRadius: 12,
          padding: "18px 48px", fontSize: 16, fontWeight: 700, cursor: "pointer",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          Join
        </button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 20 }}>
          Tip: Turn your screen brightness to maximum
        </p>
      </div>
    );
  }

  if (stage === "syncing") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff",
      }}>
        <div style={{
          width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#ff006e", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Syncing...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (stage === "ready" || stage === "idle") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff", textAlign: "center",
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%", background: "#0f0",
          boxShadow: "0 0 12px #0f0", marginBottom: 20,
          animation: "pulse 2s ease infinite",
        }} />
        <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>Connected</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          Waiting for the show...
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 24 }}>
          {deviceCount} device{deviceCount !== 1 ? "s" : ""} connected
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.1)", marginTop: 8 }}>
          Keep this screen on · Brightness to max
        </p>
        <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
      </div>
    );
  }

  if (stage === "countdown") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff",
      }}>
        <div style={{
          fontSize: 120, fontWeight: 900, color: "#ff006e",
          textShadow: "0 0 40px rgba(255,0,110,0.5)",
          lineHeight: 1,
        }}>
          {countdown}
        </div>
      </div>
    );
  }

  // playing
  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: bgColor,
      opacity: bgOpacity,
      transition: "background-color 33ms linear",
    }} />
  );
}
