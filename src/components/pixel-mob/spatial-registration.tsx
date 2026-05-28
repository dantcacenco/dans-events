"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  processBlinkFrames,
  extractFrameFromVideo,
  type DecodedDevice,
  type CVDiagnostics,
} from "@/lib/pixel-mob/cv";

type Phase =
  | "idle"
  | "camera"
  | "dark_capture"
  | "syncing"
  | "waiting"
  | "recording"
  | "processing"
  | "results";

type TimestampedFrame = {
  imageData: ImageData;
  timestamp: number;
};

const ACCENT = "#ff006e";
const BLINK_FRAME_MS = 500;
const TOTAL_FRAMES = 12;
const CAPTURE_FPS = 10;
const FIXED_CAPTURE_DURATION = 14000;
const DARK_FRAME_COUNT = 5;

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
  console.log(
    `[SpatialReg] Clock sync: offset=${offset.toFixed(1)}ms (best RTT=${samples[0].rtt.toFixed(0)}ms)`
  );
  return offset;
}

function alignFramesToBlink(
  frames: TimestampedFrame[],
  blinkStartAt: number
): { aligned: ImageData[]; deltas: number[] } {
  const aligned: ImageData[] = [];
  const deltas: number[] = [];
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const targetTime = blinkStartAt + f * BLINK_FRAME_MS + BLINK_FRAME_MS / 2;
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
    deltas.push(Math.round(bestDelta));
    console.log(
      `[SpatialReg] Align frame ${f}: target=${targetTime}, delta=${bestDelta.toFixed(0)}ms`
    );
  }
  return { aligned, deltas };
}

function averageDarkFrames(frames: ImageData[]): ImageData {
  if (frames.length === 1) return frames[0];
  const w = frames[0].width;
  const h = frames[0].height;
  const out = new ImageData(w, h);
  const n = frames.length;

  for (let i = 0; i < out.data.length; i += 4) {
    let r = 0, g = 0, b = 0;
    for (const frame of frames) {
      r += frame.data[i];
      g += frame.data[i + 1];
      b += frame.data[i + 2];
    }
    out.data[i] = Math.round(r / n);
    out.data[i + 1] = Math.round(g / n);
    out.data[i + 2] = Math.round(b / n);
    out.data[i + 3] = 255;
  }

  return out;
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
  const [diagnostics, setDiagnostics] = useState<CVDiagnostics | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [passNumber, setPassNumber] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const framesRef = useRef<TimestampedFrame[]>([]);
  const darkFrameRef = useRef<ImageData | null>(null);
  const clockOffsetRef = useRef(0);
  const deviceCountRef = useRef(512);
  const allDecodedRef = useRef<DecodedDevice[]>([]);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

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
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
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

  const startRecording = async (retryDetected?: number[]) => {
    setError("");
    framesRef.current = [];

    const isRetry = retryDetected && retryDetected.length > 0;
    if (isRetry) {
      setPassNumber((p) => p + 1);
      console.log(`[SpatialReg] Retry pass — ${retryDetected.length} already detected`);
    } else {
      allDecodedRef.current = [];
      setPassNumber(1);
    }

    // Re-open camera if stream is gone (e.g. coming from results phase)
    if (!streamRef.current || !videoRef.current) {
      console.log("[SpatialReg] Re-opening camera for retry...");
      setPhase("camera");
      // Wait a tick for the video element to mount in the DOM
      await new Promise((r) => setTimeout(r, 50));
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        // Let the camera stabilize before capturing
        await new Promise((r) => setTimeout(r, 500));
      } catch {
        setError("Could not access camera. Check permissions.");
        setPhase("idle");
        return;
      }
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      setError("Camera not available. Try 'Start Over'.");
      setPhase("idle");
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Step 1: Capture dark reference frames
    setPhase("dark_capture");
    setStatusText(isRetry ? "Recapturing background..." : "Capturing background...");
    console.log(
      `[SpatialReg] Capturing ${DARK_FRAME_COUNT} dark reference frames`
    );

    const darkFrames: ImageData[] = [];
    for (let i = 0; i < DARK_FRAME_COUNT; i++) {
      darkFrames.push(extractFrameFromVideo(video, canvas));
      await new Promise((r) => setTimeout(r, 150));
    }
    darkFrameRef.current = averageDarkFrames(darkFrames);
    console.log("[SpatialReg] Dark frame captured and averaged");

    // Step 2: Sync admin clock
    setPhase("syncing");
    setStatusText("Syncing clock...");
    const offset = await syncAdminClock();
    clockOffsetRef.current = offset;

    // Step 3: Get device count
    let deviceCount = 512;
    try {
      const stateRes = await fetch("/api/pixel-mob/state");
      const stateData = await stateRes.json();
      deviceCount = stateData.deviceCount || 512;
      deviceCountRef.current = deviceCount;
      console.log(`[SpatialReg] Device count: ${deviceCount}`);
    } catch {
      /* use default */
    }

    // Step 4: Trigger blink cue (with detectedIndices on retry)
    setStatusText(isRetry ? "Triggering retry blink..." : "Triggering blink...");
    console.log(`[SpatialReg] Triggering blink cue${isRetry ? ` (retry, ${retryDetected.length} detected)` : ""}`);
    let blinkStartAt: number;
    try {
      const cueBody: Record<string, unknown> = { type: "blink_register" };
      if (isRetry) cueBody.detectedIndices = retryDetected;
      const res = await fetch("/api/pixel-mob/cue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(cueBody),
      });
      const data = await res.json();
      blinkStartAt = data.cue.startAt;
      console.log(
        `[SpatialReg] Cue created: startAt=${blinkStartAt} (in ${blinkStartAt - Date.now() - offset}ms local)`
      );
    } catch {
      setError("Failed to trigger blink cue");
      setPhase("camera");
      return;
    }

    // Step 5: Capture frames with countdown UI
    setPhase("waiting");

    const captureStartLocal = Date.now();
    const updateCountdown = () => {
      const serverNow = Date.now() + clockOffsetRef.current;
      const secondsUntilBlink = Math.ceil((blinkStartAt - serverNow) / 1000);
      const localElapsed = Date.now() - captureStartLocal;
      const secondsLeft = Math.ceil(
        (FIXED_CAPTURE_DURATION - localElapsed) / 1000
      );

      if (secondsUntilBlink > 0) {
        setCountdown(secondsUntilBlink);
        setStatusText(`Phones blink in ${secondsUntilBlink}s...`);
      } else {
        const blinkElapsed = serverNow - blinkStartAt;
        const blinkFrame = Math.floor(blinkElapsed / BLINK_FRAME_MS);
        if (blinkFrame < TOTAL_FRAMES) {
          setStatusText(
            `Recording blink ${blinkFrame + 1}/${TOTAL_FRAMES} (${secondsLeft}s left)`
          );
        } else if (secondsLeft > 0) {
          setStatusText(`Finishing capture... ${secondsLeft}s`);
        } else {
          setStatusText("Processing...");
        }
      }
    };

    countdownIntervalRef.current = setInterval(updateCountdown, 200);
    updateCountdown();

    const capturedFrames: TimestampedFrame[] = [];
    const captureInterval = 1000 / CAPTURE_FPS;

    console.log(
      `[SpatialReg] Starting capture at ${CAPTURE_FPS} FPS for ${FIXED_CAPTURE_DURATION / 1000}s`
    );
    setPhase("recording");

    captureIntervalRef.current = setInterval(() => {
      const serverNow = Date.now() + clockOffsetRef.current;
      const frame = extractFrameFromVideo(video, canvas);
      capturedFrames.push({ imageData: frame, timestamp: serverNow });

      const localElapsed = Date.now() - captureStartLocal;
      if (localElapsed >= FIXED_CAPTURE_DURATION) {
        console.log(
          `[SpatialReg] Capture complete: ${capturedFrames.length} frames over ${(localElapsed / 1000).toFixed(1)}s`
        );
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

  const processFrames = (
    frames: TimestampedFrame[],
    blinkStartAt: number
  ) => {
    setPhase("processing");
    setStatusText(`Aligning ${frames.length} frames to blink timing...`);

    console.log(
      `[SpatialReg] Processing: ${frames.length} frames, blinkStartAt=${blinkStartAt}`
    );
    console.log(
      `[SpatialReg] Frame time range: ${frames[0].timestamp} to ${frames[frames.length - 1].timestamp}`
    );

    const { aligned: keyFrames, deltas } = alignFramesToBlink(frames, blinkStartAt);
    console.log(`[SpatialReg] Aligned ${keyFrames.length} key frames`);

    setStatusText("Running detection...");

    const maxIdx = deviceCountRef.current;
    const darkFrame = darkFrameRef.current;

    console.log(
      `[SpatialReg] CV input: darkFrame=${!!darkFrame}, maxDeviceIndex=${maxIdx}`
    );

    const { decoded: allResults, diagnostics: diag } = processBlinkFrames(
      keyFrames,
      darkFrame,
      maxIdx,
      maxIdx
    );

    // Enrich diagnostics with capture metadata
    diag.frameCount = frames.length;
    diag.captureSeconds = Math.round((frames[frames.length - 1].timestamp - frames[0].timestamp) / 1000);
    diag.clockOffset = Math.round(clockOffsetRef.current);
    diag.alignmentDeltas = deltas;

    console.log(
      `[SpatialReg] CV result: ${allResults.length} decoded (pass ${passNumber})`
    );

    // Merge with previous passes (avoid duplicates)
    const existingIndices = new Set(allDecodedRef.current.map((d) => d.deviceIndex));
    const newDevices = allResults.filter((d) => !existingIndices.has(d.deviceIndex));
    const merged = [...allDecodedRef.current, ...newDevices];
    allDecodedRef.current = merged;

    console.log(
      `[SpatialReg] Total decoded after pass ${passNumber}: ${merged.length} (${newDevices.length} new this pass)`
    );

    // Upload diagnostics to server
    fetch("/api/pixel-mob/diagnostics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diag),
    }).catch(() => {/* best-effort */});

    setDecoded(merged);
    setDiagnostics(diag);
    setPhase("results");
    setStatusText(`${merged.length} phones decoded (pass ${passNumber}, +${newDevices.length} new)`);

    const calFrameIdx = frames.findIndex((f) => f.timestamp >= blinkStartAt);
    const refFrame =
      calFrameIdx >= 0
        ? frames[calFrameIdx].imageData
        : frames[0].imageData;
    drawPreview(refFrame, allResults);
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
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
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
    setDiagnostics(null);
    setError("");
    setUploadResult(null);
    setStatusText("");
    framesRef.current = [];
    darkFrameRef.current = null;
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2
          style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#fff" }}
        >
          Spatial Registration
        </h2>
        <button
          onClick={onClose}
          style={{
            ...btn,
            background: "rgba(255,255,255,0.05)",
            color: "#666",
            padding: "4px 10px",
          }}
        >
          Close
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(255,50,50,0.1)",
            border: "1px solid rgba(255,50,50,0.2)",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 12,
            fontSize: 11,
            color: "#f55",
          }}
        >
          {error}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {phase === "idle" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p
            style={{
              fontSize: 13,
              color: "#888",
              marginBottom: 16,
              lineHeight: 1.6,
            }}
          >
            Point your camera at the audience. This will capture a background
            reference, then trigger all phones to blink their binary IDs and
            decode each phone&apos;s position.
          </p>
          <button
            onClick={startCamera}
            style={{
              ...btn,
              background: ACCENT,
              color: "#fff",
              padding: "10px 24px",
              fontSize: 13,
            }}
          >
            Open Camera
          </button>
        </div>
      )}

      {(phase === "camera" ||
        phase === "dark_capture" ||
        phase === "syncing" ||
        phase === "waiting" ||
        phase === "recording") && (
        <div>
          <div
            style={{
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 12,
              background: "#000",
            }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ width: "100%", display: "block" }}
            />
            {phase !== "camera" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    phase === "waiting" || phase === "dark_capture"
                      ? "rgba(0,0,0,0.5)"
                      : "transparent",
                  pointerEvents: "none",
                }}
              >
                {phase === "waiting" && countdown > 0 && (
                  <div
                    style={{
                      fontSize: 72,
                      fontWeight: 900,
                      color: ACCENT,
                      textShadow: "0 0 30px rgba(255,0,110,0.5)",
                    }}
                  >
                    {countdown}
                  </div>
                )}
                <div
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 12,
                    color: "#fff",
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {phase === "recording" && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#f55",
                        animation: "pulse 1s ease infinite",
                      }}
                    />
                  )}
                  {(phase === "syncing" || phase === "dark_capture") && (
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: ACCENT,
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  )}
                  <span>{statusText}</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {phase === "camera" && (
              <button
                onClick={() => startRecording()}
                style={{
                  ...btn,
                  background: ACCENT,
                  color: "#fff",
                  flex: 1,
                }}
              >
                Start Registration
              </button>
            )}
            <button
              onClick={reset}
              style={{
                ...btn,
                background: "rgba(255,255,255,0.05)",
                color: "#888",
              }}
            >
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
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: ACCENT,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: 13, color: "#888" }}>
            {statusText || `Processing ${framesRef.current.length} frames...`}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {phase === "results" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <canvas
              ref={previewCanvasRef}
              style={{ width: "100%", borderRadius: 8, display: "block" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: decoded.length > 0 ? "#0f0" : "#f55",
              }}
            >
              {decoded.length} phones decoded
            </span>
            {decoded.length > 0 && (
              <span style={{ fontSize: 11, color: "#888" }}>
                Avg confidence:{" "}
                {(
                  (decoded.reduce((s, d) => s + d.confidence, 0) /
                    decoded.length) *
                  100
                ).toFixed(0)}
                %
              </span>
            )}
            {decoded.length === 0 && (
              <span style={{ fontSize: 11, color: "#888" }}>
                Try again — ensure phones are visible and blinking
              </span>
            )}
          </div>

          {/* Diagnostics panel */}
          {diagnostics && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 6,
                padding: "8px 10px",
                marginBottom: 12,
                fontSize: 10,
                color: "#666",
                fontFamily: "monospace",
                lineHeight: 1.8,
              }}
            >
              <div>
                Threshold: {diagnostics.thresholdUsed} (auto) | BG sub: {diagnostics.darkFrameUsed ? "yes" : "no"} | Pass {passNumber}
              </div>
              <div>
                Cal: {diagnostics.spotsInCal0}/{diagnostics.spotsInCal1} | Match: {diagnostics.crossMatched} (r={diagnostics.matchRadius}) | Merged: {diagnostics.mergedSpots} (r={diagnostics.mergeRadius})
              </div>
              <div>
                Sweep: sep={diagnostics.bestSweepSep} var={diagnostics.bestSweepVar} score={diagnostics.bestSweepScore} | Expected: {diagnostics.expectedCount}
              </div>
              <div>
                Decoded: {diagnostics.decodedCount} | Rejected: sep {diagnostics.rejectedLowSeparation}, dup {diagnostics.rejectedDuplicate}, range {diagnostics.rejectedOutOfRange}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {decoded.length > 0 && decoded.length < deviceCountRef.current && (
              <button
                onClick={() => {
                  const detectedIndices = decoded.map((d) => d.deviceIndex);
                  startRecording(detectedIndices);
                }}
                style={{
                  ...btn,
                  background: "rgba(255,165,0,0.2)",
                  color: "#ffa500",
                  border: "1px solid rgba(255,165,0,0.3)",
                  flex: 1,
                }}
              >
                Retry {deviceCountRef.current - decoded.length} Undetected
              </button>
            )}
            {decoded.length > 0 && (
              <button
                onClick={uploadMapping}
                disabled={uploading}
                style={{
                  ...btn,
                  background: "rgba(34,197,94,0.2)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.3)",
                  flex: 1,
                  opacity: uploading ? 0.5 : 1,
                }}
              >
                {uploading ? "Uploading..." : "Apply Mapping"}
              </button>
            )}
            <button
              onClick={reset}
              style={{
                ...btn,
                background: "rgba(255,255,255,0.05)",
                color: "#888",
              }}
            >
              Start Over
            </button>
          </div>

          {uploadResult && (
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: uploadResult.startsWith("Failed") ? "#f55" : "#0f0",
              }}
            >
              {uploadResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
