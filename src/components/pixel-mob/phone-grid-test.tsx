"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { anim } from "@/lib/pixel-mob/animations";
import type { Cue, PhonePosition } from "@/lib/pixel-mob/types";

const PHONE_COUNT = 50;
const POLL_MS = 500;
const BLINK_FRAME_MS = 500;
const BLINK_TOTAL_FRAMES = 12;
const DOT_SIZE = 5;

// Layout constants for rendering dots on screen
const MARGIN = 30;
const STATUS_BAR_HEIGHT = 50;

// Deterministic seeded random for reproducible layouts
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Generate audience positions in NORMALIZED 0-1 space.
// These normalized coords are used for BOTH visual placement AND animation
// timing, so what you see on screen matches how animations sweep.
function generateNormalizedPositions(count: number): { nx: number; nz: number }[] {
  const rand = seededRandom(42);
  const positions: { nx: number; nz: number }[] = [];

  // 6 cluster centers mimicking table groups / pew sections
  const clusters = [
    { cx: 0.15, cy: 0.25, spread: 0.08 },
    { cx: 0.40, cy: 0.20, spread: 0.10 },
    { cx: 0.75, cy: 0.30, spread: 0.07 },
    { cx: 0.20, cy: 0.65, spread: 0.09 },
    { cx: 0.55, cy: 0.60, spread: 0.12 },
    { cx: 0.80, cy: 0.70, spread: 0.06 },
  ];

  for (let i = 0; i < count; i++) {
    let nx: number, nz: number;
    if (i < count * 0.7) {
      // 70% belong to a cluster
      const cluster = clusters[i % clusters.length];
      const angle = rand() * Math.PI * 2;
      const dist = rand() * cluster.spread + rand() * cluster.spread * 0.5;
      nx = cluster.cx + Math.cos(angle) * dist;
      nz = cluster.cy + Math.sin(angle) * dist;
    } else {
      // 30% scattered randomly
      nx = rand();
      nz = rand();
    }
    // Clamp to 0-1
    positions.push({
      nx: Math.max(0, Math.min(1, nx)),
      nz: Math.max(0, Math.min(1, nz)),
    });
  }

  return positions;
}

// Convert normalized position to screen pixel coordinates
function toScreenPos(nx: number, nz: number, w: number, h: number) {
  const usableW = w - MARGIN * 2;
  const usableH = h - MARGIN - STATUS_BAR_HEIGHT;
  return {
    x: MARGIN + nx * usableW,
    y: STATUS_BAR_HEIGHT + nz * usableH,
  };
}

// Pre-compute all normalized positions once (deterministic, seed=42)
const AUDIENCE_POSITIONS = generateNormalizedPositions(PHONE_COUNT);

type VPhone = {
  id: string;
  index: number;
  position: PhonePosition | null;
  registered: boolean;
  error: string | null;
};

async function syncClock(): Promise<number> {
  const samples: { offset: number; rtt: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const t1 = performance.now();
    const res = await fetch("/api/pixel-mob/sync");
    const t2 = performance.now();
    const data = await res.json();
    const rtt = t2 - t1;
    samples.push({ offset: data.now - (Date.now() - rtt / 2), rtt });
    await new Promise((r) => setTimeout(r, 50));
  }
  samples.sort((a, b) => a.rtt - b.rtt);
  const trimmed = samples.slice(1, 4);
  return trimmed.reduce((s, x) => s + x.offset, 0) / trimmed.length;
}

export default function PhoneGrid() {
  const [phones, setPhones] = useState<VPhone[]>([]);
  const [clockOffset, setClockOffset] = useState(0);
  const [currentCue, setCurrentCue] = useState<Cue | null>(null);
  const [colors, setColors] = useState<string[]>(
    Array(PHONE_COUNT).fill("rgb(0,0,0)")
  );
  const [status, setStatus] = useState("Initializing...");
  const [registeredCount, setRegisteredCount] = useState(0);
  const [synced, setSynced] = useState(false);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  const phonesRef = useRef<VPhone[]>([]);
  const cueRef = useRef<Cue | null>(null);
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);
  const lastBlinkFrame = useRef(-1);

  useEffect(() => {
    cueRef.current = currentCue;
  }, [currentCue]);
  useEffect(() => {
    offsetRef.current = clockOffset;
  }, [clockOffset]);

  // Track window size for dot rendering
  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Register all phones, then apply spatial positions to simulate calibration
  useEffect(() => {
    let cancelled = false;

    const registerAll = async () => {
      // Reset all devices so test grid gets clean indices 0-49
      console.log("[TestGrid] Resetting all devices...");
      setStatus("Resetting devices...");
      try {
        await fetch("/api/pixel-mob/reset", {
          method: "POST",
          headers: { "x-admin-key": "admin" },
        });
        console.log("[TestGrid] Reset complete");
      } catch (e) {
        console.log(`[TestGrid] Reset failed: ${e}`);
      }

      console.log(`[TestGrid] Registering ${PHONE_COUNT} devices...`);
      setStatus("Registering devices...");
      const results: VPhone[] = [];

      for (let i = 0; i < PHONE_COUNT; i++) {
        const deviceId = `test_grid_${Date.now()}_${i}`;
        try {
          const res = await fetch("/api/pixel-mob/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId }),
          });
          const data = await res.json();

          // Override the grid position with the audience layout position.
          // This simulates what camera calibration does for real phones.
          const audiencePos = AUDIENCE_POSITIONS[i];
          const position: PhonePosition = {
            ...data.position,
            nx: audiencePos.nx,
            nz: audiencePos.nz,
            side: audiencePos.nx < 0.5 ? 0 : 1,
          };

          results.push({
            id: deviceId,
            index: data.index,
            position,
            registered: true,
            error: null,
          });
        } catch (e) {
          results.push({
            id: deviceId,
            index: -1,
            position: null,
            registered: false,
            error: String(e),
          });
        }
        if (cancelled) return;
      }

      phonesRef.current = results;
      setPhones(results);
      setRegisteredCount(results.filter((p) => p.registered).length);
      if (cancelled) return;

      // Post calibrated positions to server (simulates camera registration)
      const mappings = results
        .filter((p) => p.registered && p.position)
        .map((p) => ({
          deviceIndex: p.position!.index,
          nx: p.position!.nx,
          nz: p.position!.nz,
          side: p.position!.side,
        }));

      try {
        setStatus("Applying spatial mapping...");
        await fetch("/api/pixel-mob/map", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": "admin",
          },
          body: JSON.stringify({ mappings }),
        });
        console.log(`[TestGrid] Spatial mapping applied for ${mappings.length} devices`);
      } catch (e) {
        console.log(`[TestGrid] Mapping failed (non-critical): ${e}`);
      }

      // Sync clock
      setStatus("Syncing clock...");
      const offset = await syncClock();
      if (cancelled) return;
      setClockOffset(offset);
      offsetRef.current = offset;
      setSynced(true);
      console.log(`[TestGrid] Clock synced: offset=${offset.toFixed(1)}ms`);
      setStatus("Ready — waiting for cue");
    };

    registerAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // Poll for cues
  useEffect(() => {
    if (!synced) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/pixel-mob/state");
        if (!res.ok) return;
        const data = await res.json();
        if (data.currentCue?.id !== cueRef.current?.id) {
          console.log(`[TestGrid] Cue received: id=${data.currentCue?.id} type=${data.currentCue?.type}`);
          setCurrentCue(data.currentCue || null);
        }
      } catch {
        // ignore
      }
    }, POLL_MS);

    return () => clearInterval(poll);
  }, [synced]);

  // Animation / blink rendering loop
  const renderLoop = useCallback(() => {
    const cue = cueRef.current;
    const ps = phonesRef.current;
    if (!cue || ps.length === 0) {
      setColors(Array(PHONE_COUNT).fill("rgb(0,0,0)"));
      animRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const serverNow = Date.now() + offsetRef.current;
    const elapsed = (serverNow - cue.startAt) / 1000;

    if (elapsed < 0) {
      setStatus(`Cue starts in ${Math.ceil(-elapsed)}s`);
      setColors(Array(PHONE_COUNT).fill("rgb(0,0,0)"));
      animRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    if (cue.duration > 0 && elapsed > cue.duration / 1000) {
      setStatus("Cue ended — waiting for next");
      setColors(Array(PHONE_COUNT).fill("rgb(0,0,0)"));
      animRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const newColors: string[] = [];

    if (cue.type === "blink_register") {
      const elapsedMs = serverNow - cue.startAt;
      const frame = Math.floor(elapsedMs / BLINK_FRAME_MS);
      setStatus(`Blinking — frame ${frame}/${BLINK_TOTAL_FRAMES}`);

      if (frame !== lastBlinkFrame.current) {
        lastBlinkFrame.current = frame;
      }

      const detected = cue.detectedIndices ?? [];
      for (let i = 0; i < PHONE_COUNT; i++) {
        const phone = ps[i];
        if (!phone?.registered || !phone.position) {
          newColors.push("rgb(30,0,0)");
          continue;
        }

        if (detected.includes(phone.position.index)) {
          newColors.push("rgb(0,255,0)");
          continue;
        }

        if (frame < 0 || frame >= BLINK_TOTAL_FRAMES) {
          newColors.push("rgb(0,0,0)");
          continue;
        }

        let white: boolean;
        if (frame <= 1) {
          white = true;
        } else if (frame <= 10) {
          const bitIndex = frame - 2;
          const index = phone.position.index;
          white = ((index >> (8 - bitIndex)) & 1) === 1;
        } else {
          white = true;
        }

        newColors.push(white ? "rgb(255,255,255)" : "rgb(0,0,0)");
      }
    } else {
      setStatus(`Playing: ${cue.animation} (${elapsed.toFixed(1)}s)`);
      for (let i = 0; i < PHONE_COUNT; i++) {
        const phone = ps[i];
        if (!phone?.registered || !phone.position) {
          newColors.push("rgb(30,0,0)");
          continue;
        }
        const [r, g, b, a] = anim(
          cue.animation,
          phone.position,
          elapsed,
          cue.params,
          0
        );
        if (a < 0.05) {
          newColors.push("rgb(0,0,0)");
        } else {
          newColors.push(
            `rgb(${Math.round(r * a)},${Math.round(g * a)},${Math.round(b * a)})`
          );
        }
      }
    }

    setColors(newColors);
    animRef.current = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    if (!synced) return;
    animRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [synced, renderLoop]);

  return (
    <div
      style={{
        background: "#000",
        position: "fixed",
        inset: 0,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 8px",
          background: "rgba(255,255,255,0.04)",
          fontSize: 11,
          color: "#888",
          height: 30,
          boxSizing: "border-box",
        }}
      >
        <span>{status}</span>
        <span>
          {registeredCount}/{PHONE_COUNT} registered
          {synced && " — synced"}
        </span>
      </div>

      {/* Phone dots — positions match animation coordinates */}
      {Array.from({ length: PHONE_COUNT }).map((_, i) => {
        const ap = AUDIENCE_POSITIONS[i];
        const screenPos = toScreenPos(ap.nx, ap.nz, dims.w, dims.h);
        const color = colors[i] || "rgb(0,0,0)";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: screenPos.x - DOT_SIZE / 2,
              top: screenPos.y - DOT_SIZE / 2,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: 1,
              background: color,
            }}
          />
        );
      })}
    </div>
  );
}
