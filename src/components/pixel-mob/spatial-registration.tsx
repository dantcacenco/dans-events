"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { processBlinkFrames, extractFrameFromVideo, type DecodedDevice } from "@/lib/pixel-mob/cv";

type Phase = "idle" | "camera" | "syncing" | "waiting" | "recording" | "processing" | "results";

type TimestampedFrame = {
  imageData: ImageData;
  timestamp: number;
};

const ACCENT = "#ff006e";
const BLINK_FRAME_MS = 500;
const TOTAL_FRAMES = 12;
const CAPTURE_FPS = 8;
const FIXED_CAPTURE_DURATION = 14000; // 3s delay + 6s blink + 5s buffer

async function syncAdminClock(): Promise<number> {
  const samples: { offset: number; rtt: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const t1 = performance.now();
    const res = await fetch("/api/pixel-mob/sync");
    const t2 = performance.now();
    const data = await res.json();
    const rtt = t2 - t1;
    samples.push({ offset: data.now - (Date.now() - rtt / 2), rtt });
    await new Promise((r) => setTimeout(r, 50));
  }
  samples.sort((a, b) => a.rtt - b.rtt);
  const trimmed = samples.slice(2, 8);
  const offset = trimmed.reduce((s, x) => s + x.offset, 0) / trimmed.length;
  console.log(`[SpatialReg] Clock sync: offset=${offset.toFixed(1)}ms (${samples.length} samples, best RTT=${samples[0].rtt.toFixed(0)}ms)`);
  return offset;
}

function alignFramesToBlink(
  frames: TimestampedFrame[],
  blinkStartAt: number
): ImageData[] {
  const aligned: ImageData[] = [];
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const targetTime = blinkStartAt + (f * BLINK_FRAME_MS) + (BLINK_FRAME_MS / 2);
    let best = frames[0];
    let bestDelta = Infinity;
    for (const frame of frames) {
      const delta = Math.abs(frame.timestamp - targetTime);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = frame;
      }
    }
    aligned.push(best.imageData);
    console.log(`[SpatialReg] Align frame ${f}: target=${targetTime}, delta=${bestDelta.toFixed(0)}ms`);
  }
  return aligned;
}

export default function SpatialRegistration({
  adminKey,
  onComplete,
  onClose,
}: {
  adminKey: string;
  onComplete: (decoded: DecodedDevice[]) => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [decoded, setDecoded] = useState<DecodedDevice[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [countdown, setCountdown] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const framesRef = useRef<TimestampedFrame[]>([]);
  const clockOffsetRef = useRef(0);
  const deviceCountRef = useRef(512);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startCamera = async () => {
    setError("");
    setPhase("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      console.log("[SpatialReg] Camera opened");
    } catch {
      setError("Could not access camera. Check permissions.");
      setPhase("idle");
    }
  };

  const startRecording = async () => {
    setError("");
    framesRef.current = [];

    // Step 1: Sync admin clock
    setPhase("syncing");
    setStatusText("Syncing clock...");
    console.log("[SpatialReg] Starting clock sync");
    const offset = await syncAdminClock();
    clockOffsetRef.current = offset;

    // Step 2: Get device count (to filter impossible indices)
    let deviceCount = 512;
    try {
      const stateRes = await fetch("/api/pixel-mob/state");
      const stateData = await stateRes.json();
      deviceCount = stateData.deviceCount || 512;
      deviceCountRef.current = deviceCount;
      console.log(`[SpatialReg] Device count: ${deviceCount}`);
    } catch { /* use default */ }

    // Step 3: Trigger blink cue on server
    setStatusText("Triggering blink...");
    console.log("[SpatialReg] Triggering blink cue");
    let blinkStartAt: number;
    try {
      const res = await fetch("/api/pixel-mob/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ type: "blink_register" }),
      });
      const data = await res.json();
      blinkStartAt = data.cue.startAt;
      console.log(`[SpatialReg] Cue created: startAt=${blinkStartAt} (in ${blinkStartAt - Date.now() - offset}ms local)`);
    } catch {
      setError("Failed to trigger blink cue");
      setPhase("camera");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Step 3: Wait for blink to start, showing countdown
    setPhase("waiting");
    const blinkEndAt = blinkStartAt + (TOTAL_FRAMES * BLINK_FRAME_MS);

    const captureStartForCountdown = Date.now();
    const updateCountdown = () => {
      const serverNow = Date.now() + clockOffsetRef.current;
      const secondsUntilBlink = Math.ceil((blinkStartAt - serverNow) / 1000);
      const localElapsed = Date.now() - captureStartForCountdown;
      const secondsLeft = Math.ceil((FIXED_CAPTURE_DURATION - localElapsed) / 1000);

      if (secondsUntilBlink > 0) {
        setCountdown(secondsUntilBlink);
        setStatusText(`Phones blink in ${secondsUntilBlink}s...`);
      } else {
        const blinkElapsed = serverNow - blinkStartAt;
        const blinkFrame = Math.floor(blinkElapsed / BLINK_FRAME_MS);
        if (blinkFrame < TOTAL_FRAMES) {
          setStatusText(`Recording blink ${blinkFrame + 1}/${TOTAL_FRAMES} (${secondsLeft}s left)`);
        } else if (secondsLeft > 0) {
          setStatusText(`Finishing capture... ${secondsLeft}s`);
        } else {
          setStatusText("Processing...");
        }
      }
    };

    countdownIntervalRef.current = setInterval(updateCountdown, 200);
    updateCountdown();

    // Step 4: Capture frames for a FIXED local duration
    // Don't rely on server time to end capture — clock sync drift between
    // admin phone and guest phones causes the camera to stop too early.
    // Fixed duration: 3s delay + 6s blink + 5s buffer = 14s from cue creation.
    const capturedFrames: TimestampedFrame[] = [];
    const captureInterval = 1000 / CAPTURE_FPS;
    const captureStartLocal = Date.now();

    console.log(`[SpatialReg] Starting capture at ${CAPTURE_FPS} FPS for ${FIXED_CAPTURE_DURATION / 1000}s`);
    setPhase("recording");

    captureIntervalRef.current = setInterval(() => {
      const serverNow = Date.now() + clockOffsetRef.current;
      const frame = extractFrameFromVideo(video, canvas);
      capturedFrames.push({ imageData: frame, timestamp: serverNow });

      const localElapsed = Date.now() - captureStartLocal;
      if (localElapsed >= FIXED_CAPTURE_DURATION) {
        console.log(`[SpatialReg] Capture complete: ${capturedFrames.length} frames over ${(localElapsed / 1000).toFixed(1)}s (local clock)`);
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        framesRef.current = capturedFrames;
        processFrames(capturedFrames, blinkStartAt);
      }
    }, captureInterval);
  };

  const processFrames = (frames: TimestampedFrame[], blinkStartAt: number) => {
    setPhase("processing");
    setStatusText(`Aligning ${frames.length} frames to blink timing...`);

    console.log(`[SpatialReg] Processing: ${frames.length} frames, blinkStartAt=${blinkStartAt}`);
    console.log(`[SpatialReg] Frame time range: ${frames[0].timestamp} to ${frames[frames.length - 1].timestamp}`);
    console.log(`[SpatialReg] Blink window: ${blinkStartAt} to ${blinkStartAt + TOTAL_FRAMES * BLINK_FRAME_MS}`);

    const keyFrames = alignFramesToBlink(frames, blinkStartAt);
    console.log(`[SpatialReg] Aligned ${keyFrames.length} key frames, running CV...`);

    const maxIdx = deviceCountRef.current;
    const allResults = processBlinkFrames(keyFrames);
    const results = allResults.filter(d => d.deviceIndex < maxIdx);
    console.log(`[SpatialReg] CV result: ${allResults.length} raw, ${results.length} after filtering (maxIndex=${maxIdx})`);

    setDecoded(results);
    setPhase("results");
    setStatusText(`${results.length} phones decoded`);

    // draw preview with detected spots on a calibration frame
    const calFrameIdx = frames.findIndex(f => f.timestamp >= blinkStartAt);
    const refFrame = calFrameIdx >= 0 ? frames[calFrameIdx].imageData : frames[0].imageData;
    drawPreview(refFrame, results);
  };

  const drawPreview = (refFrame: ImageData, spots: DecodedDevice[]) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.width = refFrame.width;
    canvas.height = refFrame.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.putImageData(refFrame, 0, 0);

    for (const spot of spots) {
      const x = spot.nx * refFrame.width;
      const y = spot.nz * refFrame.height;

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(x + 10, y - 8, 30, 16);
      ctx.fillStyle = "#fff";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`#${spot.deviceIndex}`, x + 13, y + 4);
    }
  };

  const uploadMapping = async () => {
    setUploading(true);
    setUploadResult(null);
    try {
      const res = await fetch("/api/pixel-mob/map", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({
          mappings: decoded.map((d) => ({
            deviceIndex: d.deviceIndex,
            nx: d.nx,
            nz: d.nz,
            side: d.side,
          })),
        }),
      });
      const data = await res.json();
      setUploadResult(`Updated ${data.updated}/${data.total} devices`);
      onComplete(decoded);
    } catch {
      setUploadResult("Failed to upload mapping");
    }
    setUploading(false);
  };

  const reset = () => {
    cleanup();
    setPhase("idle");
    setDecoded([]);
    setError("");
    setUploadResult(null);
    setStatusText("");
    framesRef.current = [];
  };

  const panel: React.CSSProperties = {
    background: "rgba(12,12,22,0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 20,
    maxWidth: 700,
    margin: "0 auto",
  };

  const btn: React.CSSProperties = {
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    border: "none",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  return (
    <div style={panel}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#fff" }}>
          Spatial Registration
        </h2>
        <button onClick={onClose} style={{ ...btn, background: "rgba(255,255,255,0.05)", color: "#666", padding: "4px 10px" }}>
          Close
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.2)", borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#f55" }}>
          {error}
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {phase === "idle" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.6 }}>
            Point your camera at the audience. This will trigger all phones to blink their binary IDs,
            then decode the camera feed to map each phone&apos;s physical position.
          </p>
          <button onClick={startCamera} style={{ ...btn, background: ACCENT, color: "#fff", padding: "10px 24px", fontSize: 13 }}>
            Open Camera
          </button>
        </div>
      )}

      {(phase === "camera" || phase === "syncing" || phase === "waiting" || phase === "recording") && (
        <div>
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 12, background: "#000" }}>
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ width: "100%", display: "block" }}
            />
            {/* Status overlay */}
            {phase !== "camera" && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: phase === "waiting" ? "rgba(0,0,0,0.5)" : "transparent",
                pointerEvents: "none",
              }}>
                {phase === "waiting" && countdown > 0 && (
                  <div style={{
                    fontSize: 72, fontWeight: 900, color: ACCENT,
                    textShadow: "0 0 30px rgba(255,0,110,0.5)",
                  }}>
                    {countdown}
                  </div>
                )}
                <div style={{
                  background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "6px 12px",
                  fontSize: 12, color: "#fff", marginTop: 8,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {phase === "recording" && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f55", animation: "pulse 1s ease infinite" }} />
                  )}
                  {phase === "syncing" && (
                    <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  )}
                  <span>{statusText}</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {phase === "camera" && (
              <button onClick={startRecording} style={{ ...btn, background: ACCENT, color: "#fff", flex: 1 }}>
                Start Registration
              </button>
            )}
            <button onClick={reset} style={{ ...btn, background: "rgba(255,255,255,0.05)", color: "#888" }}>
              Cancel
            </button>
          </div>
          <style>{`
            @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {phase === "processing" && (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{
            width: 36, height: 36, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: ACCENT,
            borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          <p style={{ fontSize: 13, color: "#888" }}>{statusText || `Processing ${framesRef.current.length} frames...`}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {phase === "results" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <canvas ref={previewCanvasRef} style={{ width: "100%", borderRadius: 8, display: "block" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: decoded.length > 0 ? "#0f0" : "#f55" }}>
              {decoded.length} phones decoded
            </span>
            {decoded.length > 0 && (
              <span style={{ fontSize: 11, color: "#888" }}>
                Confidence: {(decoded.reduce((s, d) => s + d.confidence, 0) / decoded.length * 100).toFixed(0)}% avg
              </span>
            )}
            {decoded.length === 0 && (
              <span style={{ fontSize: 11, color: "#888" }}>
                Try again with better lighting or camera angle
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {decoded.length > 0 && (
              <button
                onClick={uploadMapping}
                disabled={uploading}
                style={{
                  ...btn, background: "rgba(34,197,94,0.2)", color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.3)", flex: 1,
                  opacity: uploading ? 0.5 : 1,
                }}
              >
                {uploading ? "Uploading..." : "Apply Mapping"}
              </button>
            )}
            <button onClick={reset} style={{ ...btn, background: "rgba(255,255,255,0.05)", color: "#888" }}>
              Retry
            </button>
          </div>

          {uploadResult && (
            <div style={{
              marginTop: 10, fontSize: 11,
              color: uploadResult.startsWith("Failed") ? "#f55" : "#0f0",
            }}>
              {uploadResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
