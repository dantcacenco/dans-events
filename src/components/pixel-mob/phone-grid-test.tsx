"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { anim } from "@/lib/pixel-mob/animations";
import type { Cue, PhonePosition } from "@/lib/pixel-mob/types";

const PHONE_COUNT = 50;
const COLS = 10;
const ROWS = Math.ceil(PHONE_COUNT / COLS);
const POLL_MS = 2000;
const BLINK_FRAME_MS = 500;
const BLINK_TOTAL_FRAMES = 12;

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

  const phonesRef = useRef<VPhone[]>([]);
  const cueRef = useRef<Cue | null>(null);
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    cueRef.current = currentCue;
  }, [currentCue]);
  useEffect(() => {
    offsetRef.current = clockOffset;
  }, [clockOffset]);

  // Step 1: Register all phones
  useEffect(() => {
    let cancelled = false;

    const registerAll = async () => {
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
          results.push({
            id: deviceId,
            index: data.index,
            position: data.position,
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

      // Retry failed ones
      const failed = results.filter((p) => !p.registered);
      if (failed.length > 0) {
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
      // countdown — show black
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
      // Binary blink protocol
      const elapsedMs = serverNow - cue.startAt;
      const frame = Math.floor(elapsedMs / BLINK_FRAME_MS);
      setStatus(`Blinking — frame ${frame}/${BLINK_TOTAL_FRAMES}`);

      for (let i = 0; i < PHONE_COUNT; i++) {
        const phone = ps[i];
        if (!phone?.registered || !phone.position) {
          newColors.push("rgb(30,0,0)");
          continue;
        }

        if (frame < 0 || frame >= BLINK_TOTAL_FRAMES) {
          newColors.push("rgb(0,0,0)");
          continue;
        }

        let white: boolean;
        if (frame <= 1) {
          white = true; // calibration
        } else if (frame <= 10) {
          const bitIndex = frame - 2;
          const index = phone.position.index;
          white = ((index >> (8 - bitIndex)) & 1) === 1;
        } else {
          white = true; // end marker
        }

        newColors.push(white ? "rgb(255,255,255)" : "rgb(0,0,0)");
      }
    } else {
      // Normal animation
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

  const cellSize = `calc((100vw - ${(COLS + 1) * 2}px) / ${COLS})`;

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        padding: 2,
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
          marginBottom: 2,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 4,
          fontSize: 11,
          color: "#888",
        }}
      >
        <span>{status}</span>
        <span>
          {registeredCount}/{PHONE_COUNT} registered
          {synced && " — synced"}
        </span>
      </div>

      {/* Phone grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 2,
        }}
      >
        {Array.from({ length: PHONE_COUNT }).map((_, i) => {
          const phone = phones[i];
          const color = colors[i] || "rgb(0,0,0)";
          const isError = phone && !phone.registered;

          return (
            <div
              key={i}
              style={{
                aspectRatio: "9/16",
                background: color,
                borderRadius: 2,
                position: "relative",
                border: isError
                  ? "1px solid rgba(255,0,0,0.5)"
                  : "1px solid rgba(255,255,255,0.03)",
                transition: "background-color 33ms linear",
              }}
            >
              {/* Index label — tiny, only visible up close */}
              <div
                style={{
                  position: "absolute",
                  bottom: 1,
                  right: 2,
                  fontSize: 7,
                  color: "rgba(128,128,128,0.4)",
                  pointerEvents: "none",
                }}
              >
                {phone?.registered ? phone.position?.index : "?"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
