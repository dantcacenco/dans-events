"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { anim } from "@/lib/pixel-mob/animations";
import type { Cue, PhonePosition } from "@/lib/pixel-mob/types";

type Stage =
  | "welcome"
  | "section_side"
  | "section_depth"
  | "syncing"
  | "ready"
  | "countdown"
  | "playing"
  | "blinking"
  | "idle";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const POLL_INTERVAL = 2000;
const BLINK_FRAME_MS = 500;
const BLINK_TOTAL_FRAMES = 12; // 0-1 calibration, 2-10 bits, 11 end marker

// ── Helpers ──────────────────────────────────────────────────────────

function getStoredRegistration(): {
  deviceId: string;
  position: PhonePosition;
  syncVersion: number;
  registeredAt: number;
} | null {
  try {
    const raw = localStorage.getItem("pixelMob");
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.registeredAt > TWELVE_HOURS) {
      localStorage.removeItem("pixelMob");
      return null;
    }
    return data;
  } catch {
    return null;
  }
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
    const localMid = Date.now() - roundTrip / 2;
    const offset = data.now - localMid;
    samples.push({ offset, roundTrip });
    await new Promise((r) => setTimeout(r, 100));
  }
  samples.sort((a, b) => a.roundTrip - b.roundTrip);
  const trimmed = samples.slice(2, 8);
  return trimmed.reduce((s, x) => s + x.offset, 0) / trimmed.length;
}

function cacheCue(cue: Cue | null) {
  try {
    if (cue) {
      localStorage.setItem("pixelMobLastCue", JSON.stringify(cue));
    } else {
      localStorage.removeItem("pixelMobLastCue");
    }
  } catch {
    /* quota or private mode */
  }
}

function getCachedCue(): Cue | null {
  try {
    const raw = localStorage.getItem("pixelMobLastCue");
    if (!raw) return null;
    return JSON.parse(raw) as Cue;
  } catch {
    return null;
  }
}

// ── Shared styles ────────────────────────────────────────────────────

const ACCENT = "#ff006e";

const baseScreen: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "#0a0a0a",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  color: "#fff",
  textAlign: "center",
  padding: 24,
  overflow: "hidden",
};

const bigButton: React.CSSProperties = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "18px 48px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  WebkitTapHighlightColor: "transparent",
};

const sectionButton: React.CSSProperties = {
  flex: 1,
  background: "rgba(255,255,255,0.06)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
  color: "#fff",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 120,
  WebkitTapHighlightColor: "transparent",
  transition: "background 0.15s, border-color 0.15s",
};

const sectionButtonActive: React.CSSProperties = {
  ...sectionButton,
  background: "rgba(255,0,110,0.15)",
  borderColor: ACCENT,
};

const subtleLabel: React.CSSProperties = {
  fontSize: 14,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.3)",
  marginBottom: 24,
};

const CSS_KEYFRAMES = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
`;

// ── Connection indicator ─────────────────────────────────────────────

function ConnectionDot({ ok }: { ok: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: ok ? "#22c55e" : "#ef4444",
        boxShadow: ok ? "0 0 6px #22c55e" : "0 0 6px #ef4444",
        transition: "background 0.3s, box-shadow 0.3s",
        zIndex: 9999,
      }}
    />
  );
}

// ── Component ────────────────────────────────────────────────────────

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
  const [connectionOk, setConnectionOk] = useState(true);

  // Section picker state
  const [chosenSide, setChosenSide] = useState<number | null>(null);
  const [chosenDepth, setChosenDepth] = useState<number | null>(null);

  const animRef = useRef<number>(0);
  const cueRef = useRef<Cue | null>(null);
  const posRef = useRef<PhonePosition | null>(null);
  const offsetRef = useRef(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastCueIdRef = useRef<string>("");
  const stageRef = useRef<Stage>("welcome");

  useEffect(() => {
    cueRef.current = currentCue;
  }, [currentCue]);
  useEffect(() => {
    posRef.current = position;
  }, [position]);
  useEffect(() => {
    offsetRef.current = clockOffset;
  }, [clockOffset]);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // ── Wake lock + fullscreen ──────────────────────────────────────

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      /* not supported or denied */
    }
  };

  const goFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* not supported */
    }
  };

  // ── Registration ────────────────────────────────────────────────

  const register = useCallback(
    async (
      did: string,
      zone?: { side: number; depth: number },
      force = false
    ) => {
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
        body: JSON.stringify({ deviceId: did, zone }),
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
    },
    []
  );

  // ── Join flow ───────────────────────────────────────────────────

  const handleJoin = () => {
    setStage("section_side");
  };

  const handleSideChosen = (side: number) => {
    setChosenSide(side);
    setStage("section_depth");
  };

  const handleDepthChosen = async (depth: number) => {
    setChosenDepth(depth);

    // Now go fullscreen + wake lock, then register + sync
    const did = generateDeviceId();
    await goFullscreen();
    await requestWakeLock();

    setStage("syncing");

    await register(did, { side: chosenSide!, depth }, true);

    const offset = await syncClock("");
    setClockOffset(offset);

    // Check for a cached cue that may still be playing
    resumeFromCacheIfValid(offset);
  };

  const resumeFromCacheIfValid = (offset: number) => {
    const cached = getCachedCue();
    if (cached) {
      const serverNow = Date.now() + offset;
      const elapsed = serverNow - cached.startAt;
      if (elapsed >= 0 && elapsed < cached.duration) {
        // Cue is still running -- resume
        lastCueIdRef.current = cached.id;
        setCurrentCue(cached);
        if (cached.type === "blink_register") {
          setStage("blinking");
        } else {
          setStage("playing");
        }
        return;
      }
    }
    setStage("ready");
  };

  // ── beforeunload warning during active states ───────────────────

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      const s = stageRef.current;
      if (s === "countdown" || s === "playing" || s === "blinking") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // ── Poll for show state ─────────────────────────────────────────

  useEffect(() => {
    if (
      stage !== "ready" &&
      stage !== "playing" &&
      stage !== "idle" &&
      stage !== "countdown" &&
      stage !== "blinking"
    )
      return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/pixel-mob/state");
        if (!res.ok) {
          setConnectionOk(false);
          return;
        }
        setConnectionOk(true);
        const data = await res.json();
        setDeviceCount(data.deviceCount);

        if (data.syncVersion !== syncVersion && syncVersion > 0) {
          setSyncVersion(data.syncVersion);
          await register(deviceId, undefined, true);
        }

        if (data.currentCue && data.currentCue.id !== lastCueIdRef.current) {
          lastCueIdRef.current = data.currentCue.id;
          setCurrentCue(data.currentCue);
          cacheCue(data.currentCue);

          if (data.currentCue.type === "blink_register") {
            setStage("blinking");
          } else {
            setStage("countdown");
          }
        } else if (!data.currentCue && currentCue) {
          setCurrentCue(null);
          cacheCue(null);
          lastCueIdRef.current = "";
          setStage("idle");
        }
      } catch {
        setConnectionOk(false);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(poll);
  }, [stage, deviceId, syncVersion, currentCue, register]);

  // ── Countdown + normal playback ─────────────────────────────────

  useEffect(() => {
    if (stage !== "countdown" && stage !== "playing") return;

    const tick = () => {
      const cue = cueRef.current;
      const pos = posRef.current;
      if (!cue || !pos) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

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
        cacheCue(null);
        return;
      }

      setStage("playing");
      const [r, g, b, a] = anim(cue.animation, pos, elapsed, cue.params, 0);
      setBgColor(
        `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
      );
      setBgOpacity(a);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [stage]);

  // ── Binary blink sequence ───────────────────────────────────────

  useEffect(() => {
    if (stage !== "blinking") return;

    const cue = cueRef.current;
    const pos = posRef.current;
    if (!cue || !pos) return;

    // Compute 9-bit binary representation from position index
    const index = pos.index;
    const bits: number[] = [];
    for (let i = 8; i >= 0; i--) {
      bits.push((index >> i) & 1);
    }

    const startTime = cue.startAt;

    const tick = () => {
      const serverNow = Date.now() + offsetRef.current;
      const elapsed = serverNow - startTime;
      const frame = Math.floor(elapsed / BLINK_FRAME_MS);

      if (frame >= BLINK_TOTAL_FRAMES) {
        // Sequence complete
        setBgColor("rgb(0,0,0)");
        setBgOpacity(0);
        cacheCue(null);
        setStage("ready");
        return;
      }

      if (frame < 0) {
        // Not started yet
        setBgColor("rgb(0,0,0)");
        setBgOpacity(0);
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      let white: boolean;
      if (frame <= 1) {
        // Frames 0-1: ALL WHITE calibration
        white = true;
      } else if (frame <= 10) {
        // Frames 2-10: binary bits (9 bits)
        const bitIndex = frame - 2;
        white = bits[bitIndex] === 1;
      } else {
        // Frame 11: ALL WHITE end marker
        white = true;
      }

      if (white) {
        setBgColor("rgb(255,255,255)");
        setBgOpacity(1);
      } else {
        setBgColor("rgb(0,0,0)");
        setBgOpacity(1);
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [stage]);

  // ── Render: Welcome ─────────────────────────────────────────────

  if (stage === "welcome") {
    return (
      <div style={baseScreen}>
        <style>{CSS_KEYFRAMES}</style>
        <div style={subtleLabel}>Crowd Pixel</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          Join the Light Show
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 280,
            lineHeight: 1.6,
            margin: "0 0 40px",
          }}
        >
          Your phone screen becomes part of a coordinated crowd light display.
          Tap below to join.
        </p>
        <button onClick={handleJoin} style={bigButton}>
          Join
        </button>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            marginTop: 20,
          }}
        >
          Tip: Turn your screen brightness to maximum
        </p>
      </div>
    );
  }

  // ── Render: Section picker - Side ───────────────────────────────

  if (stage === "section_side") {
    return (
      <div style={baseScreen}>
        <style>{CSS_KEYFRAMES}</style>
        <div style={subtleLabel}>Step 1 of 2</div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Which side of the aisle?
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 32px",
          }}
        >
          Facing the front, which side are you on?
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            width: "100%",
            maxWidth: 340,
          }}
        >
          <button
            onClick={() => handleSideChosen(0)}
            style={sectionButton}
            onPointerDown={(e) => {
              const el = e.currentTarget;
              Object.assign(el.style, {
                background: "rgba(255,0,110,0.15)",
                borderColor: ACCENT,
              });
            }}
            onPointerUp={(e) => {
              const el = e.currentTarget;
              Object.assign(el.style, {
                background: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.12)",
              });
            }}
          >
            Left
          </button>
          <button
            onClick={() => handleSideChosen(1)}
            style={sectionButton}
            onPointerDown={(e) => {
              const el = e.currentTarget;
              Object.assign(el.style, {
                background: "rgba(255,0,110,0.15)",
                borderColor: ACCENT,
              });
            }}
            onPointerUp={(e) => {
              const el = e.currentTarget;
              Object.assign(el.style, {
                background: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.12)",
              });
            }}
          >
            Right
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Section picker - Depth ──────────────────────────────

  if (stage === "section_depth") {
    return (
      <div style={baseScreen}>
        <style>{CSS_KEYFRAMES}</style>
        <div style={subtleLabel}>Step 2 of 2</div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Where are you sitting?
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 32px",
          }}
        >
          How far from the front are you?
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            maxWidth: 340,
          }}
        >
          {(
            [
              { label: "Front", depth: 0 },
              { label: "Middle", depth: 1 },
              { label: "Back", depth: 2 },
            ] as const
          ).map(({ label, depth }) => (
            <button
              key={depth}
              onClick={() => handleDepthChosen(depth)}
              style={{
                ...sectionButton,
                minHeight: 72,
                flex: "unset",
              }}
              onPointerDown={(e) => {
                const el = e.currentTarget;
                Object.assign(el.style, {
                  background: "rgba(255,0,110,0.15)",
                  borderColor: ACCENT,
                });
              }}
              onPointerUp={(e) => {
                const el = e.currentTarget;
                Object.assign(el.style, {
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.12)",
                });
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Render: Syncing ─────────────────────────────────────────────

  if (stage === "syncing") {
    return (
      <div style={baseScreen}>
        <style>{CSS_KEYFRAMES}</style>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: ACCENT,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Syncing...
        </p>
      </div>
    );
  }

  // ── Render: Ready / Idle ────────────────────────────────────────

  if (stage === "ready" || stage === "idle") {
    return (
      <div style={baseScreen}>
        <style>{CSS_KEYFRAMES}</style>
        <ConnectionDot ok={connectionOk} />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#0f0",
            boxShadow: "0 0 12px #0f0",
            marginBottom: 20,
            animation: "pulse 2s ease infinite",
          }}
        />
        <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
          Connected
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          Waiting for the show...
        </p>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.15)",
            marginTop: 24,
          }}
        >
          {deviceCount} device{deviceCount !== 1 ? "s" : ""} connected
        </p>
        <p
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.1)",
            marginTop: 8,
          }}
        >
          Keep this screen on &middot; Brightness to max
        </p>
      </div>
    );
  }

  // ── Render: Countdown ───────────────────────────────────────────

  if (stage === "countdown") {
    return (
      <div style={baseScreen}>
        <ConnectionDot ok={connectionOk} />
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: ACCENT,
            textShadow: "0 0 40px rgba(255,0,110,0.5)",
            lineHeight: 1,
          }}
        >
          {countdown}
        </div>
      </div>
    );
  }

  // ── Render: Playing / Blinking ──────────────────────────────────

  return (
    <>
      <ConnectionDot ok={connectionOk} />
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: bgColor,
          opacity: bgOpacity,
          transition: "background-color 33ms linear",
        }}
      />
    </>
  );
}
