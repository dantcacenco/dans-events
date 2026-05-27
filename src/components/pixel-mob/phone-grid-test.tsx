"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { anim } from "@/lib/pixel-mob/animations";
import type { Cue, PhonePosition } from "@/lib/pixel-mob/types";

const PHONE_COUNT = 50;
const POLL_MS = 500;
const BLINK_FRAME_MS = 500;
const BLINK_TOTAL_FRAMES = 12;
const DOT_SIZE = 5;

// Deterministic seeded random for reproducible layouts
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Pre-compute irregular positions that mimic a real audience:
// some clusters, some loners, uneven spacing
function generateAudiencePositions(count: number, w: number, h: number) {
  const rand = seededRandom(42);
  const positions: { x: number; y: number }[] = [];
  const margin = 30;
  const usableW = w - margin * 2;
  const usableH = h - margin - 50; // 50px top for status bar area

  // Create 6 cluster centers (like table groups / pew sections)
  const clusters = [
    { cx: 0.15, cy: 0.25, spread: 0.08 },
    { cx: 0.40, cy: 0.20, spread: 0.10 },
    { cx: 0.75, cy: 0.30, spread: 0.07 },
    { cx: 0.20, cy: 0.65, spread: 0.09 },
    { cx: 0.55, cy: 0.60, spread: 0.12 },
    { cx: 0.80, cy: 0.70, spread: 0.06 },
  ];

  for (let i = 0; i < count; i++) {
    if (i < count * 0.7) {
      // 70% of phones belong to a cluster
      const cluster = clusters[i % clusters.length];
      const angle = rand() * Math.PI * 2;
      const dist = rand() * cluster.spread + rand() * cluster.spread * 0.5;
      const x = margin + (cluster.cx + Math.cos(angle) * dist) * usableW;
      const y = 50 + (cluster.cy + Math.sin(angle) * dist) * usableH;
      positions.push({
        x: Math.max(margin, Math.min(w - margin, x)),
        y: Math.max(50, Math.min(h - margin, y)),
      });
    } else {
      // 30% are scattered randomly (loners, stragglers)
      positions.push({
        x: margin + rand() * usableW,
        y: 50 + rand() * usableH,
      });
    }
  }

  return positions;
}

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

  // Track window size for dot positioning
  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Step 1: Register all phones
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
      setStatus("Registering 50 devices...");
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
          console.log(`[TestGrid] Device ${i}: index=${data.index}`);
          results.push({
            id: deviceId,
            index: data.index,
            position: data.position,
            registered: true,
            error: null,
          });
        } catch (e) {
          console.log(`[TestGrid] Device ${i}: FAILED - ${e}`);
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

      // Retry failed ones
      const failed = results.filter((p) => !p.registered);
      if (failed.length > 0) {
        console.log(`[TestGrid] Retrying ${failed.length} failed registrations`);
        setStatus(`Retrying ${failed.length} failed registrations...`);
        for (const phone of failed) {
          try {
            const res = await fetch("/api/pixel-mob/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deviceId: phone.id }),
            });
            const data = await res.json();
            phone.index = data.index;
            phone.position = data.position;
            phone.registered = true;
            phone.error = null;
            console.log(`[TestGrid] Retry success: index=${data.index}`);
          } catch {
            // still failed
          }
          if (cancelled) return;
        }
        phonesRef.current = [...results];
        setPhones([...results]);
        setRegisteredCount(results.filter((p) => p.registered).length);
      }

      // Step 2: Sync clock
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

  // Step 3: Poll for cues
  useEffect(() => {
    if (!synced) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/pixel-mob/state");
        if (!res.ok) return;
        const data = await res.json();
        if (data.currentCue?.id !== cueRef.current?.id) {
          console.log(`[TestGrid] Cue received: id=${data.currentCue?.id} type=${data.currentCue?.type} startAt=${data.currentCue?.startAt}`);
          setCurrentCue(data.currentCue || null);
        }
      } catch {
        // ignore
      }
    }, POLL_MS);

    return () => clearInterval(poll);
  }, [synced]);

  // Step 4: Animation / blink rendering loop
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
        console.log(`[TestGrid] Blink frame ${frame}/${BLINK_TOTAL_FRAMES}`);
      }

      const detected = cue.detectedIndices ?? [];
      for (let i = 0; i < PHONE_COUNT; i++) {
        const phone = ps[i];
        if (!phone?.registered || !phone.position) {
          newColors.push("rgb(30,0,0)");
          continue;
        }

        // Already-detected phones show green
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

  const dotPositions = generateAudiencePositions(PHONE_COUNT, dims.w, dims.h);

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

      {/* Phone dots — irregular audience layout */}
      {Array.from({ length: PHONE_COUNT }).map((_, i) => {
        const pos = dotPositions[i];
        const color = colors[i] || "rgb(0,0,0)";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x - DOT_SIZE / 2,
              top: pos.y - DOT_SIZE / 2,
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
