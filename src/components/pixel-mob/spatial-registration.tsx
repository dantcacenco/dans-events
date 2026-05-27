"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { processBlinkFrames, extractFrameFromVideo, type DecodedDevice } from "@/lib/pixel-mob/cv";

type Phase = "idle" | "camera" | "recording" | "processing" | "results";

const ACCENT = "#ff006e";
const BLINK_FRAME_MS = 500;
const TOTAL_FRAMES = 12;
const CAPTURE_DURATION = (TOTAL_FRAMES * BLINK_FRAME_MS) + 2000; // 8s total
const CAPTURE_FPS = 4;

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const framesRef = useRef<ImageData[]>([]);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
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
    } catch {
      setError("Could not access camera. Check permissions.");
      setPhase("idle");
    }
  };

  const startRecording = async () => {
    setPhase("recording");
    setError("");
    framesRef.current = [];

    // trigger blink registration cue on the server
    try {
      await fetch("/api/pixel-mob/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ type: "blink_register" }),
      });
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

    const interval = 1000 / CAPTURE_FPS;
    const capturedFrames: ImageData[] = [];
    const startTime = performance.now();

    const captureLoop = setInterval(() => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= CAPTURE_DURATION) {
        clearInterval(captureLoop);
        framesRef.current = capturedFrames;
        processFrames(capturedFrames);
        return;
      }
      capturedFrames.push(extractFrameFromVideo(video, canvas));
    }, interval);
  };

  const processFrames = (frames: ImageData[]) => {
    setPhase("processing");

    // select ~12 frames aligned to blink timing (2 per blink step)
    // use every other frame starting from ~1s in (to skip the 5s server delay + sync)
    // with 4fps capture over 8s = ~32 frames
    // blink starts at server time + 5s, each frame is 500ms
    // we captured continuously, so we pick 12 frames spread across the capture

    // simple approach: if we have enough frames, downsample to ~12 key frames
    const keyFrames: ImageData[] = [];
    if (frames.length >= 24) {
      // skip first ~20% (server delay buffer), then pick every 2nd frame for 12 total
      const start = Math.floor(frames.length * 0.25);
      const step = Math.max(1, Math.floor((frames.length - start) / 12));
      for (let i = 0; i < 12 && start + i * step < frames.length; i++) {
        keyFrames.push(frames[start + i * step]);
      }
    } else if (frames.length >= 12) {
      const step = Math.max(1, Math.floor(frames.length / 12));
      for (let i = 0; i < 12 && i * step < frames.length; i++) {
        keyFrames.push(frames[i * step]);
      }
    } else {
      keyFrames.push(...frames);
    }

    const results = processBlinkFrames(keyFrames);
    setDecoded(results);
    setPhase("results");

    // draw preview with detected spots
    drawPreview(frames[Math.floor(frames.length * 0.1)] || frames[0], results);
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
            then decode the camera feed to map each phone's physical position.
          </p>
          <button onClick={startCamera} style={{ ...btn, background: ACCENT, color: "#fff", padding: "10px 24px", fontSize: 13 }}>
            Open Camera
          </button>
        </div>
      )}

      {(phase === "camera" || phase === "recording") && (
        <div>
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 12, background: "#000" }}>
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ width: "100%", display: "block" }}
            />
            {phase === "recording" && (
              <div style={{
                position: "absolute", top: 12, right: 12,
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(0,0,0,0.6)", borderRadius: 4, padding: "4px 8px",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f55", animation: "pulse 1s ease infinite" }} />
                <span style={{ fontSize: 11, color: "#fff" }}>Recording...</span>
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
          <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
        </div>
      )}

      {phase === "processing" && (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{
            width: 36, height: 36, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: ACCENT,
            borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          <p style={{ fontSize: 13, color: "#888" }}>Processing {framesRef.current.length} frames...</p>
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
