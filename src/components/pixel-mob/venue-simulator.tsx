"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PAL, lerp, pickPal, hslToRgb, anim, PRESETS } from "@/lib/pixel-mob/animations";
import type { ShowState } from "@/lib/pixel-mob/types";

type Phone = {
  id: number; x: number; y: number; z: number;
  personH: number; armUp: number; nx: number; nz: number;
  side: number; col: number; row: number; seed: number;
  timeOffset: number; armAngle: number;
};

type Cam = { x: number; y: number; z: number; yaw: number; pitch: number; fov: number };

function buildPhones(rows: number, cols: number, aisleW: number, rd: number, cs: number, sitting: boolean): Phone[] {
  const phones: Phone[] = [];
  const rng = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  let id = 0;
  for (let r = 0; r < rows; r++) {
    const z = r * rd;
    for (let side = 0; side < 2; side++) {
      for (let c = 0; c < cols; c++) {
        const bx = side === 0 ? -(aisleW / 2) - (c + 1) * cs : (aisleW / 2) + c * cs;
        const jx = (rng(id * 3) - 0.5) * cs * 0.22, jz = (rng(id * 3 + 1) - 0.5) * rd * 0.18;
        const pH = sitting ? 0.75 : 1.3, aU = sitting ? 0.45 + rng(id * 3 + 2) * 0.15 : 0.6 + rng(id * 3 + 2) * 0.2;
        const tw = cols * cs * 2 + aisleW;
        phones.push({
          id, x: bx + jx, y: pH + aU, z: z + jz, personH: pH, armUp: aU,
          nx: (bx + tw / 2) / tw, nz: r / Math.max(1, rows - 1), side, col: c, row: r,
          seed: rng(id * 7 + 13), timeOffset: (rng(id * 11 + 7) - 0.5) * 2, armAngle: (rng(id * 5 + 3) - 0.5) * 0.3,
        });
        id++;
      }
    }
  }
  return phones;
}

function project(px: number, py: number, pz: number, cam: Cam, W: number, H: number) {
  const dx = px - cam.x, dy = py - cam.y, dz = pz - cam.z;
  const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
  const rx = dx * cy - dz * sy, rz = dx * sy + dz * cy;
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  const ry = dy * cp - rz * sp, rz2 = dy * sp + rz * cp;
  if (rz2 < 0.3) return null;
  const f = cam.fov || 750;
  return { sx: W / 2 + rx * f / rz2, sy: H / 2 - ry * f / rz2, sc: f / rz2, d: rz2 };
}

function drawPerson(ctx: CanvasRenderingContext2D, sx: number, sy: number, sc: number, _ph: Phone, r: number, g: number, b: number, a: number, sitting: boolean) {
  const s = sc * 0.04; if (s < 0.6) return;
  const headR = Math.max(1.5, s * 2.2), bodyW = Math.max(2, s * 3);
  const bodyH = sitting ? Math.max(3, s * 4) : Math.max(5, s * 7);
  const armLen = Math.max(3, s * 4.5);
  ctx.fillStyle = "rgba(18,18,35,0.5)";
  ctx.beginPath(); ctx.ellipse(sx, sy + headR + bodyH * 0.5, bodyW, bodyH * 0.55, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(30,28,45,0.55)";
  ctx.beginPath(); ctx.arc(sx, sy - armLen + headR * 0.5, headR, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(25,23,40,0.4)"; ctx.lineWidth = Math.max(1, s * 0.7);
  ctx.beginPath(); ctx.moveTo(sx - bodyW * 0.7, sy + headR * 0.3); ctx.quadraticCurveTo(sx - bodyW * 0.3, sy - armLen * 0.5, sx - s * 0.5, sy - armLen); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + bodyW * 0.7, sy + headR * 0.3); ctx.quadraticCurveTo(sx + bodyW * 0.3, sy - armLen * 0.5, sx + s * 0.5, sy - armLen); ctx.stroke();
  const pw = Math.max(2.5, s * 1.8), phH = pw * 1.7, phoneY = sy - armLen;
  if (a > 0.008) {
    const gr = pw * 2 + a * pw * 5;
    const grd = ctx.createRadialGradient(sx, phoneY, pw * 0.3, sx, phoneY, gr);
    grd.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${a * 0.22})`);
    grd.addColorStop(0.5, `rgba(${r | 0},${g | 0},${b | 0},${a * 0.05})`);
    grd.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
    ctx.fillStyle = grd; ctx.fillRect(sx - gr, phoneY - gr, gr * 2, gr * 2);
    if (a > 0.15 && s > 1.5) {
      const fg = ctx.createRadialGradient(sx, sy - armLen + headR * 1.5, 0, sx, sy - armLen + headR * 1.5, headR * 3);
      fg.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${a * 0.08})`); fg.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
      ctx.fillStyle = fg; ctx.fillRect(sx - headR * 3, sy - armLen - headR, headR * 6, headR * 5);
    }
    ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`;
    ctx.shadowColor = `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, a * 1.2)})`; ctx.shadowBlur = 5 + a * 10;
    ctx.fillRect(sx - pw / 2, phoneY - phH / 2, pw, phH); ctx.shadowBlur = 0;
    if (a > 0.5) { ctx.fillStyle = `rgba(255,255,255,${(a - 0.5) * 0.25})`; ctx.fillRect(sx - pw * 0.25, phoneY - phH * 0.25, pw * 0.5, phH * 0.5); }
  } else { ctx.fillStyle = "rgba(20,20,35,0.3)"; ctx.fillRect(sx - pw / 2, phoneY - phH / 2, pw, phH); }
}

function drawStage(ctx: CanvasRenderingContext2D, cam: Cam, W: number, H: number, sl: number, t: number) {
  const stageZ = -1.5, stageW = 4, pH = 0.15;
  const corners = [project(-stageW, pH, stageZ - 2, cam, W, H), project(stageW, pH, stageZ - 2, cam, W, H), project(stageW, pH, stageZ + 1, cam, W, H), project(-stageW, pH, stageZ + 1, cam, W, H)];
  if (corners.every(c => c)) {
    ctx.fillStyle = `rgba(35,30,45,${0.3 + sl * 0.2})`; ctx.beginPath();
    ctx.moveTo(corners[0]!.sx, corners[0]!.sy); corners.slice(1).forEach(c => ctx.lineTo(c!.sx, c!.sy)); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = `rgba(180,160,130,${0.2 + sl * 0.35})`; ctx.lineWidth = 2.5;
  const archH = 2.8;
  for (const px of [-1.5, 1.5]) {
    const b = project(px, pH, stageZ - 1, cam, W, H), tp = project(px, archH, stageZ - 1, cam, W, H);
    if (b && tp) { ctx.beginPath(); ctx.moveTo(b.sx, b.sy); ctx.lineTo(tp.sx, tp.sy); ctx.stroke(); }
  }
  const aL = project(-1.5, archH, stageZ - 1, cam, W, H), aM = project(0, archH + 0.5, stageZ - 1, cam, W, H), aR = project(1.5, archH, stageZ - 1, cam, W, H);
  if (aL && aM && aR) {
    ctx.beginPath(); ctx.moveTo(aL.sx, aL.sy); ctx.quadraticCurveTo(aM.sx, aM.sy, aR.sx, aR.sy); ctx.stroke();
    ctx.strokeStyle = `rgba(220,200,180,${0.08 + sl * 0.18})`; ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      const fr = i / 6, dx2 = lerp(-1.5, 1.5, fr), dy = archH + 0.4 * Math.sin(fr * Math.PI) - Math.abs(fr - 0.5) * 0.3 + Math.sin(t * 0.5 + i) * 0.02;
      const pp = project(dx2, dy, stageZ - 1, cam, W, H); const pfr = (i - 1) / 6;
      const prev = project(lerp(-1.5, 1.5, pfr), archH + 0.4 * Math.sin(pfr * Math.PI) - Math.abs(pfr - 0.5) * 0.3 + Math.sin(t * 0.5 + i - 1) * 0.02, stageZ - 1, cam, W, H);
      if (pp && prev && i > 0) { ctx.beginPath(); ctx.moveTo(prev.sx, prev.sy); ctx.lineTo(pp.sx, pp.sy); ctx.stroke(); }
    }
  }
  const spots = [{ x: 0, c: [255, 240, 220] }, { x: -2.2, c: [220, 200, 255] }, { x: 2.2, c: [255, 220, 200] }];
  for (const sp of spots) {
    const tp = project(sp.x, 5, stageZ - 1, cam, W, H), bL = project(sp.x - 1, pH, stageZ - 2, cam, W, H), bR = project(sp.x + 1, pH, stageZ, cam, W, H);
    if (tp && bL && bR) {
      const grd = ctx.createLinearGradient(tp.sx, tp.sy, tp.sx, (bL.sy + bR.sy) / 2);
      grd.addColorStop(0, `rgba(${sp.c[0]},${sp.c[1]},${sp.c[2]},${sl * 0.18})`);
      grd.addColorStop(0.4, `rgba(${sp.c[0]},${sp.c[1]},${sp.c[2]},${sl * 0.09})`);
      grd.addColorStop(1, `rgba(${sp.c[0]},${sp.c[1]},${sp.c[2]},0)`);
      ctx.fillStyle = grd; ctx.beginPath(); ctx.moveTo(tp.sx, tp.sy); ctx.lineTo(bL.sx, bL.sy); ctx.lineTo(bR.sx, bR.sy); ctx.closePath(); ctx.fill();
    }
  }
  const fc = project(0, pH + 0.01, stageZ - 1, cam, W, H);
  if (fc) {
    const pr = fc.sc * 2; const pool = ctx.createRadialGradient(fc.sx, fc.sy, 0, fc.sx, fc.sy, pr);
    pool.addColorStop(0, `rgba(255,230,200,${sl * 0.13})`); pool.addColorStop(1, "rgba(255,230,200,0)");
    ctx.fillStyle = pool; ctx.fillRect(fc.sx - pr, fc.sy - pr, pr * 2, pr * 2);
  }
  const figs = [
    { x: 0, z: stageZ - 1, h: 1.65, w: 0.22 }, { x: -0.55, z: stageZ - 0.7, h: 1.55, w: 0.2 },
    { x: 0.55, z: stageZ - 0.7, h: 1.7, w: 0.18 }, { x: -1.8, z: stageZ - 0.5, h: 1.55, w: 0.17 },
    { x: -2.3, z: stageZ - 0.5, h: 1.58, w: 0.17 }, { x: 1.8, z: stageZ - 0.5, h: 1.68, w: 0.17 },
    { x: 2.3, z: stageZ - 0.5, h: 1.65, w: 0.17 },
  ];
  for (const fig of figs) {
    const ft = project(fig.x, pH, fig.z, cam, W, H), hd = project(fig.x, fig.h + pH, fig.z, cam, W, H);
    if (!ft || !hd) continue;
    const fH = ft.sy - hd.sy, fW = Math.max(3, ft.sc * fig.w), hr = Math.max(2, fW * 0.7);
    const bg2 = ctx.createLinearGradient(ft.sx, hd.sy, ft.sx, ft.sy);
    bg2.addColorStop(0, `rgba(65,58,75,${0.35 + sl * 0.45})`); bg2.addColorStop(1, `rgba(42,38,52,${0.25 + sl * 0.3})`);
    ctx.fillStyle = bg2; ctx.beginPath(); ctx.ellipse(ft.sx, hd.sy + fH * 0.55, fW, fH * 0.45, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(78,70,90,${0.35 + sl * 0.45})`; ctx.beginPath(); ctx.arc(ft.sx, hd.sy + hr * 0.3, hr, 0, Math.PI * 2); ctx.fill();
    if (sl > 0.15) {
      const hl = ctx.createRadialGradient(ft.sx, hd.sy + fH * 0.3, 0, ft.sx, hd.sy + fH * 0.3, fW * 2.5);
      hl.addColorStop(0, `rgba(255,240,220,${sl * 0.09})`); hl.addColorStop(1, "rgba(255,240,220,0)");
      ctx.fillStyle = hl; ctx.fillRect(ft.sx - fW * 2.5, hd.sy, fW * 5, fH);
    }
  }
}

const Slider = ({ label, value, onChange, min = 0, max = 1, step = 0.01, unit = "" }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string;
}) => (
  <div style={{ marginBottom: 7 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
      <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 10, color: "#bbb", fontFamily: "monospace" }}>{typeof value === "number" ? value.toFixed(step < 0.1 ? 2 : 0) : value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: "#ff006e", height: 3 }} />
  </div>
);

function CompassDial({ angle, onChange }: { angle: number; onChange: (a: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const getAngle = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const svg = svgRef.current; if (!svg) return angle;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const a = Math.atan2(clientX - cx, -(clientY - cy)) * 180 / Math.PI;
    return ((a % 360) + 360) % 360;
  };
  const onDown = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); dragging.current = true; onChange(getAngle(e)); };
  const onMove = useCallback((e: MouseEvent | TouchEvent) => { if (dragging.current) { e.preventDefault(); onChange(getAngle(e)); } }, [onChange]);
  const onUp = useCallback(() => { dragging.current = false; }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false }); window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [onMove, onUp]);
  const rad = angle * Math.PI / 180;
  const r = 38;
  const kx = 50 + r * Math.sin(rad), ky = 50 - r * Math.cos(rad);
  const labels = [{ a: 0, l: "Audience", y: -1 }, { a: 180, l: "Altar", y: 1 }, { a: 90, l: "Right", x: 1 }, { a: 270, l: "Left", x: -1 }];
  return (
    <svg ref={svgRef} viewBox="0 0 100 100" width="120" height="120" style={{ cursor: "pointer", touchAction: "none" }}
      onMouseDown={onDown} onTouchStart={onDown}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="18" strokeDasharray="2 4" />
      {labels.map(lb => {
        const a2 = lb.a * Math.PI / 180; const lx = 50 + 46 * Math.sin(a2), ly = 50 - 46 * Math.cos(a2);
        return <text key={lb.a} x={lx} y={ly + (lb.y || 0) * 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="monospace">{lb.l}</text>;
      })}
      <line x1="50" y1="50" x2={kx} y2={ky} stroke="rgba(255,0,110,0.3)" strokeWidth="1.5" />
      <circle cx={kx} cy={ky} r={7} fill="rgba(255,0,110,0.7)" stroke="rgba(255,0,110,1)" strokeWidth="1" />
      <text x="50" y="52" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">{Math.round(angle)}°</text>
    </svg>
  );
}

export default function VenueSimulator() {
  const [rows, setRows] = useState(14);
  const [colsPerSide, setColsPerSide] = useState(8);
  const [sitting, setSitting] = useState(true);
  const [camAngle, setCamAngle] = useState(180);
  const [camHeight, setCamHeight] = useState(2.2);
  const [camDist, setCamDist] = useState(6);
  const [camPitch, setCamPitch] = useState(0.1);
  const [jitter, setJitter] = useState(0);
  const [preset, setPreset] = useState("ripple");
  const [speed, setSpeed] = useState(1);
  const [width, setWidth] = useState(1);
  const [palette, setPalette] = useState("neon");
  const [playing, setPlaying] = useState(true);
  const [stageLight, setStageLight] = useState(0.7);
  const [savedPresets, setSavedPresets] = useState<{ name: string; preset: string; speed: number; width: number; palette: string; id: number }[]>([]);
  const [presetName, setPresetName] = useState("");
  const [deviceCount, setDeviceCount] = useState(0);
  const [liveStatus, setLiveStatus] = useState<"idle" | "sent" | "error">("idle");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t0 = useRef(performance.now());
  const aisleW = 1.2, rowDepth = 0.85, colSpacing = 0.55;
  const phones = useMemo(() => buildPhones(rows, colsPerSide, aisleW, rowDepth, colSpacing, sitting), [rows, colsPerSide, sitting]);
  const total = phones.length;

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/pixel-mob/devices");
        const data = await res.json();
        setDeviceCount(data.count);
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  const triggerCue = async () => {
    try {
      const res = await fetch("/api/pixel-mob/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animation: preset, speed, width, palette, duration: 30000 }),
      });
      if (res.ok) setLiveStatus("sent");
      else setLiveStatus("error");
    } catch { setLiveStatus("error"); }
    setTimeout(() => setLiveStatus("idle"), 3000);
  };

  const triggerBlackout = async () => {
    await fetch("/api/pixel-mob/cue", { method: "DELETE" });
    setLiveStatus("idle");
  };

  const savePreset = () => {
    const name = presetName.trim() || `Scene ${savedPresets.length + 1}`;
    setSavedPresets(p => [...p, { name, preset, speed, width, palette, id: Date.now() }]);
    setPresetName("");
  };
  const loadPreset = (sp: typeof savedPresets[0]) => { setPreset(sp.preset); setSpeed(sp.speed); setWidth(sp.width); setPalette(sp.palette); };
  const deletePreset = (id: number) => setSavedPresets(p => p.filter(x => x.id !== id));

  const triggerSavedCue = async (sp: typeof savedPresets[0]) => {
    loadPreset(sp);
    try {
      const res = await fetch("/api/pixel-mob/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animation: sp.preset, speed: sp.speed, width: sp.width, palette: sp.palette, duration: 30000 }),
      });
      if (res.ok) setLiveStatus("sent");
    } catch { /* ignore */ }
    setTimeout(() => setLiveStatus("idle"), 3000);
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#040410"); bg.addColorStop(0.5, "#060614"); bg.addColorStop(1, "#0a0a1a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const venueDepth = rows * rowDepth;
    const centerX = 0, centerZ = venueDepth / 2;
    const angRad = camAngle * Math.PI / 180;
    const orbitR = camDist + venueDepth / 2;
    const cx = centerX + orbitR * Math.sin(angRad);
    const cz = centerZ - orbitR * Math.cos(angRad);
    const dirX = centerX - cx, dirZ = centerZ - cz;
    const viewYaw = Math.atan2(dirX, dirZ);

    const cam: Cam = { x: cx, y: camHeight, z: cz, yaw: viewYaw, pitch: camPitch, fov: 750 };
    const t = (performance.now() - t0.current) / 1000;

    drawStage(ctx, cam, W, H, stageLight, t);

    const halfW = colsPerSide * colSpacing + aisleW / 2 + 0.5;
    ctx.lineWidth = 1;
    for (let r = 0; r <= rows; r++) {
      const z = r * rowDepth;
      const p1 = project(-halfW, 0, z, cam, W, H), p2 = project(halfW, 0, z, cam, W, H);
      if (p1 && p2) { ctx.strokeStyle = "rgba(255,255,255,0.018)"; ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke(); }
    }
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    for (const s of [-1, 1]) {
      const x = s * aisleW / 2;
      const p1 = project(x, 0, 0, cam, W, H), p2 = project(x, 0, venueDepth, cam, W, H);
      if (p1 && p2) { ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke(); }
    }

    const projected: { sx: number; sy: number; sc: number; d: number; r: number; g: number; b: number; a: number; ph: Phone }[] = [];
    for (const ph of phones) {
      const p = project(ph.x, ph.y, ph.z, cam, W, H);
      if (!p || p.sx < -100 || p.sx > W + 100 || p.sy < -100 || p.sy > H + 100) continue;
      const jOff = jitter * ph.timeOffset / 1000;
      const [r, g, b, a] = anim(preset, ph, t, { speed, width, palette }, jOff);
      projected.push({ ...p, r, g, b, a, ph });
    }
    projected.sort((a, b) => b.d - a.d);
    for (const p of projected) drawPerson(ctx, p.sx, p.sy, p.sc, p.ph, p.r, p.g, p.b, p.a, sitting);

    ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.font = "13px monospace"; ctx.textAlign = "left";
    ctx.fillText(`${total} phones · ${rows}r × ${colsPerSide * 2}c · ${Math.round(camAngle)}°`, 14, H - 12);
    if (playing) animRef.current = requestAnimationFrame(render);
  }, [phones, camAngle, camHeight, camDist, camPitch, jitter, preset, speed, width, palette, playing, rows, colsPerSide, total, sitting, stageLight]);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const resize = () => {
      const r = c.parentElement?.getBoundingClientRect(); if (!r) return;
      c.width = r.width * 2; c.height = 500 * 2; c.style.width = r.width + "px"; c.style.height = "500px";
    };
    resize(); window.addEventListener("resize", resize); return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    if (playing) animRef.current = requestAnimationFrame(render);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [render, playing]);

  const panel: React.CSSProperties = { background: "rgba(12,12,22,0.92)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14 };
  const lbl: React.CSSProperties = { fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "block" };
  const btn: React.CSSProperties = { borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 10, border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div style={{ background: "#050510", color: "#ddd", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 12 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Crowd Pixel — Admin</h1>
          <span style={{ fontSize: 11, color: "#444" }}>{total} sim pixels · {deviceCount} phones connected</span>
        </div>

        {/* LIVE CONTROL BAR */}
        <div style={{ ...panel, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: deviceCount > 0 ? "#0f0" : "#555", boxShadow: deviceCount > 0 ? "0 0 6px #0f0" : "none" }} />
            <span style={{ fontSize: 11, color: "#aaa" }}>{deviceCount} device{deviceCount !== 1 ? "s" : ""}</span>
          </div>
          <button onClick={triggerCue} style={{ ...btn, background: "rgba(255,0,110,0.2)", color: "#ff006e", border: "1px solid rgba(255,0,110,0.4)", padding: "8px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            GO
          </button>
          <button onClick={triggerBlackout} style={{ ...btn, background: "rgba(255,50,50,0.1)", color: "#f55", border: "1px solid rgba(255,50,50,0.2)", padding: "8px 16px", fontSize: 11 }}>
            BLACKOUT
          </button>
          {liveStatus === "sent" && <span style={{ fontSize: 11, color: "#0f0" }}>Cue sent — starts in 5s</span>}
          {liveStatus === "error" && <span style={{ fontSize: 11, color: "#f55" }}>Failed to send cue</span>}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#444" }}>
            Current: {PRESETS.find(p => p.id === preset)?.label} · {palette} · {speed}×
          </span>
        </div>

        <div style={{ ...panel, padding: 0, overflow: "hidden", marginBottom: 10, position: "relative" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
          <div style={{ position: "absolute", top: 10, right: 12, display: "flex", gap: 5 }}>
            <button onClick={() => setPlaying(!playing)} style={{ ...btn, background: "rgba(0,0,0,0.5)", color: "#fff" }}>{playing ? "❚❚" : "▶"}</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {/* col 1: animations */}
          <div style={panel}>
            <span style={lbl}>Animation</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, maxHeight: 440, overflowY: "auto" }}>
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => setPreset(p.id)} style={{
                  ...btn, textAlign: "left", display: "flex", gap: 4, alignItems: "center",
                  background: preset === p.id ? "rgba(255,0,110,0.15)" : "rgba(255,255,255,0.02)",
                  border: preset === p.id ? "1px solid rgba(255,0,110,0.4)" : "1px solid rgba(255,255,255,0.04)",
                  color: preset === p.id ? "#ff006e" : "#777",
                }}><span style={{ fontSize: 11, width: 15, textAlign: "center" }}>{p.icon}</span>{p.label}</button>
              ))}
            </div>
          </div>
          {/* col 2: params */}
          <div style={panel}>
            <span style={lbl}>Effect Parameters</span>
            <Slider label="Speed" value={speed} onChange={setSpeed} min={0.1} max={4} step={0.1} unit="×" />
            <Slider label="Width / Spread" value={width} onChange={setWidth} min={0.1} max={3} step={0.1} />
            <Slider label="Sync Jitter" value={jitter} onChange={setJitter} min={0} max={500} step={1} unit="ms" />
            <div style={{ marginTop: 6 }}><span style={lbl}>Palette</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {Object.entries(PAL).map(([k, cols]) => (
                  <button key={k} onClick={() => setPalette(k)} style={{
                    ...btn, display: "flex", alignItems: "center", gap: 3,
                    background: palette === k ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
                    border: palette === k ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.05)",
                  }}><div style={{ display: "flex", gap: 1 }}>{cols.slice(0, 4).map((c, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: `rgb(${c.join(",")})` }} />
                  ))}</div>
                    <span style={{ fontSize: 9, color: "#777" }}>{k}</span></button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
              <span style={lbl}>Stage Lighting</span>
              <Slider label="Intensity" value={stageLight} onChange={setStageLight} min={0} max={1} step={0.05} />
            </div>
          </div>
          {/* col 3: venue + camera */}
          <div style={panel}>
            <span style={lbl}>Venue</span>
            <Slider label="Rows" value={rows} onChange={v => setRows(Math.round(v))} min={4} max={100} step={1} />
            <Slider label="Seats/side" value={colsPerSide} onChange={v => setColsPerSide(Math.round(v))} min={3} max={50} step={1} />
            <button onClick={() => setSitting(!sitting)} style={{
              ...btn, width: "100%", marginBottom: 8,
              background: sitting ? "rgba(0,180,216,0.12)" : "rgba(255,159,28,0.12)",
              border: `1px solid ${sitting ? "rgba(0,180,216,0.3)" : "rgba(255,159,28,0.3)"}`,
              color: sitting ? "#00b4d8" : "#ff9f1c",
            }}>{sitting ? "🪑 Seated" : "🧍 Standing"}</button>
            <span style={lbl}>Camera Orbit</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CompassDial angle={camAngle} onChange={setCamAngle} />
              <div style={{ flex: 1 }}>
                <Slider label="Height" value={camHeight} onChange={setCamHeight} min={0.8} max={8} step={0.1} unit="m" />
                <Slider label="Distance" value={camDist} onChange={setCamDist} min={1} max={15} step={0.5} unit="m" />
                <Slider label="Tilt" value={camPitch} onChange={setCamPitch} min={-0.4} max={0.5} step={0.01} />
              </div>
            </div>
          </div>
          {/* col 4: saved scenes */}
          <div style={panel}>
            <span style={lbl}>Saved Scenes (Cue List)</span>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Scene name..."
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 5, padding: "5px 8px", color: "#ccc", fontSize: 10, outline: "none"
                }}
                onKeyDown={e => { if (e.key === "Enter") savePreset(); }} />
              <button onClick={savePreset} style={{ ...btn, background: "rgba(255,0,110,0.15)", color: "#ff006e", border: "1px solid rgba(255,0,110,0.3)" }}>Save</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 370, overflowY: "auto" }}>
              {savedPresets.length === 0 && <span style={{ fontSize: 10, color: "#444", padding: 8, textAlign: "center" }}>No saved scenes yet. Configure animation + params, then save.</span>}
              {savedPresets.map(sp => {
                const pr = PRESETS.find(p => p.id === sp.preset);
                const pc = PAL[sp.palette] || PAL.white;
                return (
                  <div key={sp.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button onClick={() => triggerSavedCue(sp)} style={{
                      ...btn, flex: 1, textAlign: "left", background: "rgba(255,255,255,0.03)", color: "#aaa",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: 11 }}>{pr?.icon || "?"}</span><span style={{ flex: 1 }}>{sp.name}</span>
                      <div style={{ display: "flex", gap: 1 }}>{pc.slice(0, 3).map((c, i) => (
                        <div key={i} style={{ width: 5, height: 5, borderRadius: 1, background: `rgb(${c.join(",")})` }} />
                      ))}</div>
                      <span style={{ fontSize: 9, color: "#555" }}>{sp.speed}×</span>
                      <span style={{ fontSize: 8, color: "#ff006e", padding: "1px 4px", background: "rgba(255,0,110,0.1)", borderRadius: 3 }}>GO</span>
                    </button>
                    <button onClick={() => { loadPreset(sp); }} style={{ ...btn, background: "rgba(255,255,255,0.03)", color: "#777", padding: "5px 6px", fontSize: 9 }}>Load</button>
                    <button onClick={() => deletePreset(sp.id)} style={{ ...btn, background: "rgba(255,50,50,0.08)", color: "#f55", border: "1px solid rgba(255,50,50,0.15)", padding: "5px 6px" }}>✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
