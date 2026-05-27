export const PAL: Record<string, number[][]> = {
  white: [[255, 255, 255]],
  warm: [[255, 107, 53], [255, 159, 28], [255, 191, 105]],
  cool: [[0, 180, 216], [0, 119, 182], [144, 224, 239]],
  fire: [[255, 0, 0], [255, 69, 0], [255, 215, 0]],
  neon: [[255, 0, 110], [131, 56, 236], [58, 134, 255], [6, 214, 160]],
  sunset: [[247, 37, 133], [181, 23, 158], [114, 9, 183]],
  ocean: [[0, 105, 148], [0, 166, 251], [72, 202, 228]],
  forest: [[45, 106, 79], [64, 145, 108], [82, 183, 136]],
  gold: [[212, 175, 55], [255, 215, 0], [255, 236, 139]],
  rose: [[255, 182, 193], [255, 105, 180], [255, 20, 147]],
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export function pickPal(pal: string, phase: number): [number, number, number] {
  const c = PAL[pal] || PAL.white;
  if (c.length === 1) return c[0] as [number, number, number];
  const p = ((phase % 1) + 1) % 1;
  const ci = p * (c.length - 1);
  const lo = Math.floor(ci);
  const hi = Math.min(lo + 1, c.length - 1);
  const f = ci - lo;
  return [lerp(c[lo][0], c[hi][0], f), lerp(c[lo][1], c[hi][1], f), lerp(c[lo][2], c[hi][2], f)];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

export type PhoneLike = {
  nx: number;
  nz: number;
  seed: number;
  side: number;
};

export function anim(
  preset: string,
  ph: PhoneLike,
  t: number,
  p: { speed: number; width: number; palette: string },
  jOff: number
): [number, number, number, number] {
  const T = t + jOff;
  const { nx, nz, seed, side } = ph;
  const sp = p.speed, w = p.width, pal = p.palette;
  const dist = Math.sqrt((nx - 0.5) ** 2 + (nz - 0.5) ** 2) * 1.414;

  switch (preset) {
    case "chase_lr": {
      const h = ((T * sp * 0.4) % 1.6) - 0.3;
      return [...pickPal(pal, nx + T * 0.1), Math.max(0, 1 - Math.abs(nx - h) / (w * 0.12 + 0.03))];
    }
    case "chase_rl": {
      const h = 1 - ((T * sp * 0.4) % 1.6) + 0.3;
      return [...pickPal(pal, nx), Math.max(0, 1 - Math.abs(nx - h) / (w * 0.12 + 0.03))];
    }
    case "chase_fb": {
      const h = ((T * sp * 0.35) % 1.6) - 0.3;
      return [...pickPal(pal, nz + T * 0.15), Math.max(0, 1 - Math.abs(nz - h) / (w * 0.15 + 0.03))];
    }
    case "chase_bf": {
      const h = 1 - ((T * sp * 0.35) % 1.6) + 0.3;
      return [...pickPal(pal, nz), Math.max(0, 1 - Math.abs(nz - h) / (w * 0.15 + 0.03))];
    }
    case "ripple": {
      const wv = Math.sin((dist * 8 - T * sp * 3) * Math.PI);
      return [...pickPal(pal, dist - T * 0.2), Math.max(0, wv) * Math.max(0, 1 - dist * 0.6)];
    }
    case "waterdrop": {
      const dx2 = 0.3 + Math.sin(T * 0.13) * 0.2, dz2 = 0.3 + Math.cos(T * 0.17) * 0.2;
      const d = Math.sqrt((nx - dx2) ** 2 + (nz - dz2) ** 2);
      const ring = Math.sin((d * 12 - T * sp * 4) * Math.PI);
      const env = Math.exp(-d * 3 / (w * 0.5 + 0.1)) * Math.max(0, Math.sin(T * sp * 0.8));
      return [...pickPal(pal, d * 2), Math.max(0, ring) * env];
    }
    case "sparkle": {
      const hash = Math.sin(seed * 9999 + Math.floor(T * sp * 6) * seed * 31) * 43758.5;
      const r2 = hash - Math.floor(hash);
      return [...pickPal(pal, r2), r2 > 0.85 ? Math.pow((r2 - 0.85) / 0.15, 0.5) : 0];
    }
    case "shimmer":
      return [255, 255, 255, Math.pow(Math.max(0, Math.sin(T * sp * (1 + seed * 2) + seed * 6.28)), 5 + w * 6)];
    case "breathe": {
      const phase = Math.sin(T * sp * 1.2 - dist * w * 3);
      return [...pickPal(pal, dist * 0.5), (phase + 1) / 2 * 0.85 + 0.15];
    }
    case "split_sides": {
      const phase = (T * sp * 0.6) % 2;
      return [...pickPal(pal, side * 0.5), (side === 0 ? phase < 1 : phase >= 1) ? 1 : 0.03];
    }
    case "rainbow": {
      const h = ((nx * 0.5 + nz * 0.5 - T * sp * 0.2) * (w + 0.5) * 360) % 360;
      return [...hslToRgb((h + 360) % 360, 90, 55), 1];
    }
    case "heartbeat": {
      const delay = dist * w * 0.4;
      const dc = ((T * sp * 0.7 - delay) % 2 + 2) % 2;
      let b = 0;
      if (dc < 0.12) b = dc / 0.12;
      else if (dc < 0.24) b = 1 - (dc - 0.12) / 0.12;
      else if (dc < 0.36) b = (dc - 0.24) / 0.12 * 0.5;
      else if (dc < 0.55) b = 0.5 * (1 - (dc - 0.36) / 0.19);
      return [...pickPal(pal, 0.2), b];
    }
    case "vortex": {
      const ang = Math.atan2(nz - 0.5, nx - 0.5);
      const spiral = ((ang / Math.PI + 1) / 2 + dist * w - T * sp * 0.3) % 1;
      return [...pickPal(pal, spiral), Math.pow(Math.max(0, Math.sin(spiral * Math.PI * 2)), 3)];
    }
    case "comet": {
      const angle = T * 0.15;
      const dir = [Math.cos(angle), Math.sin(angle)];
      const proj2 = nx * dir[0] + nz * dir[1];
      const head = ((T * sp * 0.4) % 2) - 0.5;
      const trail = proj2 - head;
      let b = 0;
      if (trail >= 0 && trail < w * 0.25 + 0.05) b = Math.pow(1 - trail / (w * 0.25 + 0.05), 0.6);
      else if (trail < 0 && trail > -0.04) b = 1 + trail / 0.04;
      return [...pickPal(pal, trail * 2 + 0.5), b];
    }
    case "wave_cross": {
      const w1 = Math.sin((nx * 6 - T * sp * 3) * Math.PI);
      const w2 = Math.sin((nz * 6 - T * sp * 2.5) * Math.PI);
      return [...pickPal(pal, nx * 0.5 + nz * 0.5), Math.max(0, (w1 + w2) / 2)];
    }
    case "rain_fall": {
      const col = Math.floor(nx * 20);
      const cs2 = Math.sin(col * 77.7) * 43758.5;
      const rs = cs2 - Math.floor(cs2);
      const drop = ((T * sp * 0.5 + rs * 5) % 1.5) - 0.2;
      return [...pickPal(pal, rs), Math.max(0, 1 - Math.abs(nz - drop) / (w * 0.08 + 0.02)) * 0.9];
    }
    case "all_on":
      return [...pickPal(pal, nx * 0.3 + nz * 0.3), 1];
    default:
      return [0, 0, 0, 0];
  }
}

export function computePosition(
  index: number,
  rows: number,
  colsPerSide: number
): { nx: number; nz: number; side: number; col: number; row: number; seed: number } {
  const perRow = colsPerSide * 2;
  const row = Math.floor(index / perRow);
  const rem = index % perRow;
  const side = rem < colsPerSide ? 0 : 1;
  const col = rem % colsPerSide;

  const aisleW = 1.2, colSpacing = 0.55;
  const totalW = colsPerSide * colSpacing * 2 + aisleW;
  const bx = side === 0
    ? -(aisleW / 2) - (col + 1) * colSpacing
    : (aisleW / 2) + col * colSpacing;
  const nx = (bx + totalW / 2) / totalW;
  const nz = row / Math.max(1, rows - 1);

  const rng = (i: number) => {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const seed = rng(index * 7 + 13);

  return { nx, nz, side, col, row, seed };
}

export const PRESETS = [
  { id: "chase_lr", label: "Chase L→R", icon: "→" },
  { id: "chase_rl", label: "Chase R←L", icon: "←" },
  { id: "chase_fb", label: "Front → Back", icon: "↓" },
  { id: "chase_bf", label: "Back → Front", icon: "↑" },
  { id: "ripple", label: "Ripple", icon: "◎" },
  { id: "waterdrop", label: "Water Drop", icon: "💧" },
  { id: "sparkle", label: "Sparkle Rain", icon: "✦" },
  { id: "shimmer", label: "Star Shimmer", icon: "✧" },
  { id: "breathe", label: "Breathe", icon: "◐" },
  { id: "split_sides", label: "Split Sides", icon: "◧" },
  { id: "rainbow", label: "Rainbow Field", icon: "🌈" },
  { id: "heartbeat", label: "Heartbeat", icon: "♥" },
  { id: "vortex", label: "Vortex Spiral", icon: "@" },
  { id: "comet", label: "Wandering Comet", icon: "☄" },
  { id: "wave_cross", label: "Crosshatch", icon: "╬" },
  { id: "rain_fall", label: "Rain Columns", icon: "⋮" },
  { id: "all_on", label: "All On", icon: "■" },
];
