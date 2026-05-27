export type DetectedSpot = {
  x: number;
  y: number;
  area: number;
  avgBrightness: number;
};

export type DecodedDevice = {
  deviceIndex: number;
  nx: number;
  nz: number;
  side: number;
  confidence: number;
};

export type SpotTrace = {
  x: number;
  y: number;
  area: number;
  calBrightness: number;
  frameBrightness: number[];
  binaryBrightness: number[];
  bits: number[];
  decodedIndex: number;
  separation: number;
  spotThreshold: number;
  outcome: "decoded" | "low_separation" | "no_variation" | "low_cal" | "duplicate" | "out_of_range";
};

export type CVDiagnostics = {
  timestamp: number;
  thresholdUsed: number;
  darkFrameUsed: boolean;
  spotsInCal0: number;
  spotsInCal1: number;
  crossMatched: number;
  mergedSpots: number;
  matchRadius: number;
  mergeRadius: number;
  endMarkerValidated: number;
  spotsUsed: number;
  expectedCount: number;
  decodedCount: number;
  bestSweepSep: number;
  bestSweepVar: number;
  bestSweepScore: number;
  rejectedLowSeparation: number;
  rejectedDuplicate: number;
  rejectedOutOfRange: number;
  frameCount: number;
  captureSeconds: number;
  clockOffset: number;
  alignmentDeltas: number[];
  spotTraces: SpotTrace[];
};

const MIN_AREA = 4;
const MAX_AREA = 50000;
const DEFAULT_MATCH_RADIUS = 60;
const BINARY_BITS = 9;
const SAMPLE_RADIUS = 6;

// ── Background subtraction ───────────────────────────────────────────

function subtractBackground(frame: ImageData, bg: ImageData): ImageData {
  const out = new ImageData(frame.width, frame.height);
  for (let i = 0; i < frame.data.length; i += 4) {
    out.data[i] = Math.max(0, frame.data[i] - bg.data[i]);
    out.data[i + 1] = Math.max(0, frame.data[i + 1] - bg.data[i + 1]);
    out.data[i + 2] = Math.max(0, frame.data[i + 2] - bg.data[i + 2]);
    out.data[i + 3] = 255;
  }
  return out;
}

// ── Otsu's auto-threshold ────────────────────────────────────────────

function otsuThreshold(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const total = width * height;
  const hist = new Uint32Array(256);

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    hist[gray]++;
  }

  let sumTotal = 0;
  for (let i = 0; i < 256; i++) sumTotal += i * hist[i];

  let sumBg = 0;
  let wBg = 0;
  let maxVariance = 0;
  let bestThreshold = 128;

  for (let t = 0; t < 256; t++) {
    wBg += hist[t];
    if (wBg === 0) continue;
    const wFg = total - wBg;
    if (wFg === 0) break;
    sumBg += t * hist[t];
    const meanBg = sumBg / wBg;
    const meanFg = (sumTotal - sumBg) / wFg;
    const variance = wBg * wFg * (meanBg - meanFg) ** 2;
    if (variance > maxVariance) {
      maxVariance = variance;
      bestThreshold = t;
    }
  }

  return bestThreshold;
}

// ── Contrast normalization ───────────────────────────────────────────

function normalizeContrast(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  let min = 255, max = 0;

  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (gray < min) min = gray;
    if (gray > max) max = gray;
  }

  if (max - min < 10) return imageData;

  const out = new ImageData(width, height);
  const range = max - min;
  for (let i = 0; i < data.length; i += 4) {
    out.data[i] = Math.round(((data[i] - min) / range) * 255);
    out.data[i + 1] = Math.round(((data[i + 1] - min) / range) * 255);
    out.data[i + 2] = Math.round(((data[i + 2] - min) / range) * 255);
    out.data[i + 3] = 255;
  }
  return out;
}

// ── Spot detection (flood-fill connected components) ─────────────────

export function extractBrightSpots(
  imageData: ImageData,
  threshold: number,
  minArea = MIN_AREA,
  maxArea = MAX_AREA
): DetectedSpot[] {
  const { width, height, data } = imageData;
  const visited = new Uint8Array(width * height);
  const spots: DetectedSpot[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (visited[idx]) continue;
      const px = idx * 4;
      const gray = (data[px] + data[px + 1] + data[px + 2]) / 3;
      if (gray < threshold) continue;

      const stack = [idx];
      visited[idx] = 1;
      let sumX = 0, sumY = 0, sumBright = 0, count = 0;

      while (stack.length > 0) {
        const ci = stack.pop()!;
        const cx = ci % width;
        const cy = (ci - cx) / width;
        const cpx = ci * 4;
        sumX += cx;
        sumY += cy;
        sumBright += (data[cpx] + data[cpx + 1] + data[cpx + 2]) / 3;
        count++;

        if (count > maxArea) {
          while (stack.length > 0) visited[stack.pop()!] = 1;
          break;
        }

        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const ni = ny * width + nx;
          if (visited[ni]) continue;
          const npx = ni * 4;
          const ng = (data[npx] + data[npx + 1] + data[npx + 2]) / 3;
          if (ng < threshold) continue;
          visited[ni] = 1;
          stack.push(ni);
        }
      }

      if (count >= minArea && count <= maxArea) {
        spots.push({
          x: sumX / count,
          y: sumY / count,
          area: count,
          avgBrightness: sumBright / count,
        });
      }
    }
  }

  return spots;
}

// ── Spot matching between frames ─────────────────────────────────────

function matchSpots(
  prev: DetectedSpot[],
  curr: DetectedSpot[],
  radius = DEFAULT_MATCH_RADIUS
): Map<number, number> {
  const matches = new Map<number, number>();
  const usedCurr = new Set<number>();

  for (let pi = 0; pi < prev.length; pi++) {
    let bestDist = radius * radius;
    let bestCi = -1;

    for (let ci = 0; ci < curr.length; ci++) {
      if (usedCurr.has(ci)) continue;
      const dx = prev[pi].x - curr[ci].x;
      const dy = prev[pi].y - curr[ci].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) {
        bestDist = d2;
        bestCi = ci;
      }
    }

    if (bestCi >= 0) {
      matches.set(pi, bestCi);
      usedCurr.add(bestCi);
    }
  }

  return matches;
}

// ── Filter spots by similar size ─────────────────────────────────────

function filterSimilarSizedSpots(spots: DetectedSpot[]): DetectedSpot[] {
  if (spots.length < 3) return spots;
  const areas = spots.map((s) => s.area).sort((a, b) => a - b);
  const q1 = areas[Math.floor(areas.length * 0.25)];
  const q3 = areas[Math.floor(areas.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return spots.filter((s) => s.area >= Math.max(lower, MIN_AREA) && s.area <= upper);
}

// ── Merge nearby spots into single spots ─────────────────────────────

function mergeNearbySpots(spots: DetectedSpot[], radius: number): DetectedSpot[] {
  if (spots.length === 0) return [];
  const merged: DetectedSpot[] = [];
  const used = new Set<number>();

  for (let i = 0; i < spots.length; i++) {
    if (used.has(i)) continue;
    used.add(i);

    let sumX = spots[i].x * spots[i].area;
    let sumY = spots[i].y * spots[i].area;
    let sumBright = spots[i].avgBrightness * spots[i].area;
    let totalArea = spots[i].area;

    for (let j = i + 1; j < spots.length; j++) {
      if (used.has(j)) continue;
      const dx = spots[i].x - spots[j].x;
      const dy = spots[i].y - spots[j].y;
      if (dx * dx + dy * dy < radius * radius) {
        used.add(j);
        sumX += spots[j].x * spots[j].area;
        sumY += spots[j].y * spots[j].area;
        sumBright += spots[j].avgBrightness * spots[j].area;
        totalArea += spots[j].area;
      }
    }

    merged.push({
      x: sumX / totalArea,
      y: sumY / totalArea,
      area: totalArea,
      avgBrightness: sumBright / totalArea,
    });
  }

  return merged;
}

// ── Direct brightness sampling at a point ────────────────────────────

function sampleBrightness(
  imageData: ImageData,
  cx: number,
  cy: number,
  radius: number
): number {
  const { data, width, height } = imageData;
  let sum = 0, count = 0;
  const r = Math.ceil(radius);

  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = Math.round(cx) + dx;
      const y = Math.round(cy) + dy;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const idx = (y * width + x) * 4;
      sum += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

// ── Main processing pipeline ─────────────────────────────────────────

export function processBlinkFrames(
  frames: ImageData[],
  darkFrame?: ImageData | null,
  maxDeviceIndex?: number,
  expectedCount?: number
): { decoded: DecodedDevice[]; diagnostics: CVDiagnostics } {
  const diagnostics: CVDiagnostics = {
    timestamp: Date.now(),
    thresholdUsed: 0,
    darkFrameUsed: !!darkFrame,
    spotsInCal0: 0,
    spotsInCal1: 0,
    crossMatched: 0,
    mergedSpots: 0,
    matchRadius: 0,
    mergeRadius: 0,
    endMarkerValidated: 0,
    spotsUsed: 0,
    expectedCount: expectedCount ?? 0,
    decodedCount: 0,
    bestSweepSep: 0,
    bestSweepVar: 0,
    bestSweepScore: 0,
    rejectedLowSeparation: 0,
    rejectedDuplicate: 0,
    rejectedOutOfRange: 0,
    frameCount: frames.length,
    captureSeconds: 0,
    clockOffset: 0,
    alignmentDeltas: [],
    spotTraces: [],
  };

  if (frames.length < 12) {
    console.log(`[CV] Not enough frames: ${frames.length} (need 12)`);
    return { decoded: [], diagnostics };
  }

  // Step 1: Background subtraction
  let processed: ImageData[];
  if (darkFrame) {
    console.log("[CV] Applying background subtraction");
    processed = frames.map((f) => subtractBackground(f, darkFrame));
  } else {
    processed = frames;
  }

  // Step 2: Normalize contrast on calibration frames for threshold detection
  const cal0Norm = normalizeContrast(processed[0]);
  const cal1Norm = normalizeContrast(processed[1]);

  // Step 3: Auto-threshold using Otsu's on the bg-subtracted calibration frames
  const thresh0 = otsuThreshold(cal0Norm);
  const thresh1 = otsuThreshold(cal1Norm);
  let threshold = Math.min(thresh0, thresh1);

  // Ensure threshold isn't absurdly low (would pick up noise)
  threshold = Math.max(threshold, 30);
  diagnostics.thresholdUsed = threshold;
  console.log(`[CV] Auto-threshold: Otsu0=${thresh0}, Otsu1=${thresh1}, using=${threshold}`);

  // Step 4: Detect spots in both calibration frames
  const cal0Spots = filterSimilarSizedSpots(
    extractBrightSpots(cal0Norm, threshold)
  );
  const cal1Spots = filterSimilarSizedSpots(
    extractBrightSpots(cal1Norm, threshold)
  );
  diagnostics.spotsInCal0 = cal0Spots.length;
  diagnostics.spotsInCal1 = cal1Spots.length;
  console.log(`[CV] Cal0: ${cal0Spots.length} spots, Cal1: ${cal1Spots.length} spots`);

  if (cal0Spots.length === 0 || cal1Spots.length === 0) {
    console.log("[CV] No spots found in calibration frames — aborting");
    return { decoded: [], diagnostics };
  }

  // Step 5: Cross-match calibration frames — only keep spots visible in both
  // Adaptive match radius: 10x median spot radius (allows for camera movement between frames)
  const allCalAreas = [...cal0Spots.map(s => s.area), ...cal1Spots.map(s => s.area)].sort((a, b) => a - b);
  const medianCalArea = allCalAreas[Math.floor(allCalAreas.length / 2)] || 16;
  const matchRadius = Math.max(15, Math.min(100, Math.ceil(Math.sqrt(medianCalArea / Math.PI) * 10)));
  console.log(`[CV] Match radius: ${matchRadius} (median spot area=${medianCalArea.toFixed(0)})`);
  const calMatch = matchSpots(cal0Spots, cal1Spots, matchRadius);
  const refSpots: DetectedSpot[] = [];
  for (const [i0, i1] of calMatch.entries()) {
    refSpots.push({
      x: (cal0Spots[i0].x + cal1Spots[i1].x) / 2,
      y: (cal0Spots[i0].y + cal1Spots[i1].y) / 2,
      area: (cal0Spots[i0].area + cal1Spots[i1].area) / 2,
      avgBrightness: (cal0Spots[i0].avgBrightness + cal1Spots[i1].avgBrightness) / 2,
    });
  }
  diagnostics.crossMatched = refSpots.length;
  diagnostics.matchRadius = matchRadius;
  console.log(`[CV] Cross-matched: ${refSpots.length} spots present in both calibration frames`);

  if (refSpots.length === 0) {
    console.log("[CV] No cross-matched spots — aborting");
    return { decoded: [], diagnostics };
  }

  // Step 5b: Merge nearby spots — one phone can produce multiple detected spots
  // Use adaptive merge radius: 3x the median spot radius (avoids merging distinct phones)
  const areas = refSpots.map(s => s.area).sort((a, b) => a - b);
  const medianArea = areas[Math.floor(areas.length / 2)];
  const mergeRadius = Math.max(8, Math.ceil(Math.sqrt(medianArea / Math.PI) * 3));
  const mergedSpots = mergeNearbySpots(refSpots, mergeRadius);
  console.log(`[CV] Merged ${refSpots.length} → ${mergedSpots.length} spots (medianArea=${medianArea.toFixed(0)}, mergeRadius=${mergeRadius})`);

  diagnostics.mergedSpots = mergedSpots.length;
  diagnostics.mergeRadius = mergeRadius;
  diagnostics.endMarkerValidated = mergedSpots.length;
  const spotsToUse = mergedSpots;

  // Step 7: Direct brightness sampling across ALL 12 frames
  const sampleRadius = Math.max(
    SAMPLE_RADIUS,
    Math.ceil(Math.sqrt(spotsToUse[0]?.area ?? 16) / 2) + 2
  );
  console.log(`[CV] Sampling brightness with radius=${sampleRadius}`);

  type SpotTrack = {
    spot: DetectedSpot;
    frameBrightness: number[];
  };

  const tracks: SpotTrack[] = spotsToUse.map((spot) => {
    const frameBrightness: number[] = [];
    for (let f = 0; f < 12; f++) {
      frameBrightness.push(
        sampleBrightness(processed[f], spot.x, spot.y, sampleRadius)
      );
    }
    return { spot, frameBrightness };
  });

  diagnostics.spotsUsed = spotsToUse.length;

  // Step 8: Compute per-spot signal data (decode ALL spots, filter later)
  const imgW = frames[0].width;
  const imgH = frames[0].height;

  type AnalyzedSpot = {
    spot: DetectedSpot;
    frameBrightness: number[];
    binaryBrightness: number[];
    calBrightness: number;
    bits: number[];
    index: number;
    separation: number;
    spotThreshold: number;
    variation: number;
    hasOnOff: boolean;
  };

  const analyzed: AnalyzedSpot[] = tracks.map((track) => {
    const binaryBrightness = track.frameBrightness.slice(2, 11);
    const calBrightness = (track.frameBrightness[0] + track.frameBrightness[1]) / 2;
    const maxB = Math.max(...binaryBrightness);
    const minB = Math.min(...binaryBrightness);
    const spotThreshold = (maxB + minB) / 2;

    let index = 0;
    const bits: number[] = [];
    for (let bit = 0; bit < BINARY_BITS; bit++) {
      const isOn = binaryBrightness[bit] > spotThreshold;
      bits.push(isOn ? 1 : 0);
      if (isOn) index |= 1 << (BINARY_BITS - 1 - bit);
    }

    const onCount = bits.filter((b) => b === 1).length;
    const offCount = bits.filter((b) => b === 0).length;
    const onValues = binaryBrightness.filter((_, i) => bits[i] === 1);
    const offValues = binaryBrightness.filter((_, i) => bits[i] === 0);
    const avgOn = onValues.length > 0 ? onValues.reduce((s, v) => s + v, 0) / onValues.length : 0;
    const avgOff = offValues.length > 0 ? offValues.reduce((s, v) => s + v, 0) / offValues.length : 0;
    const separation = maxB > 0 ? (avgOn - avgOff) / maxB : 0;

    return {
      spot: track.spot,
      frameBrightness: track.frameBrightness,
      binaryBrightness,
      calBrightness,
      bits,
      index,
      separation,
      spotThreshold,
      variation: maxB - minB,
      hasOnOff: onCount > 0 && offCount > 0,
    };
  });

  // Step 9: Adaptive parameter sweep — try multiple separation/variation thresholds
  // When expectedCount is known, penalize distance from target to avoid over/under-filtering
  const separationCandidates = [0.02, 0.05, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4];
  const variationCandidates = [1, 2, 3, 5, 8, 12];
  const maxIdx = maxDeviceIndex ?? 512;
  const target = expectedCount ?? 0;

  let bestDecoded: DecodedDevice[] = [];
  let bestSep = 0;
  let bestVar = 0;
  let bestScore = -Infinity;

  for (const minSep of separationCandidates) {
    for (const minVar of variationCandidates) {
      const seen = new Set<number>();
      let unique = 0;
      let dups = 0;

      for (const a of analyzed) {
        if (a.variation < minVar) continue;
        if (!a.hasOnOff) continue;
        if (a.separation < minSep) continue;
        if (a.index >= maxIdx) continue;
        if (seen.has(a.index)) { dups++; continue; }
        seen.add(a.index);
        unique++;
      }

      let score: number;
      if (target > 0) {
        // Penalize distance from expected count + duplicates
        score = unique - Math.abs(unique - target) * 0.5 - dups * 0.3;
      } else {
        score = unique - dups * 0.1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestSep = minSep;
        bestVar = minVar;
      }
    }
  }

  console.log(`[CV] Expected count: ${target || "unknown"}`);
  console.log(`[CV] Parameter sweep: best sep=${bestSep}, var=${bestVar}, score=${bestScore.toFixed(1)}`);
  diagnostics.bestSweepSep = bestSep;
  diagnostics.bestSweepVar = bestVar;
  diagnostics.bestSweepScore = Math.round(bestScore * 10) / 10;

  // Step 10: Apply best parameters and build final results with traces
  const decoded: DecodedDevice[] = [];
  const seenIndices = new Set<number>();
  let rejectedLowSep = 0;
  let rejectedDup = 0;
  let rejectedRange = 0;

  for (const a of analyzed) {
    const trace: SpotTrace = {
      x: Math.round(a.spot.x),
      y: Math.round(a.spot.y),
      area: Math.round(a.spot.area),
      calBrightness: Math.round(a.calBrightness),
      frameBrightness: a.frameBrightness.map((v) => Math.round(v)),
      binaryBrightness: a.binaryBrightness.map((v) => Math.round(v)),
      bits: a.bits,
      decodedIndex: a.index,
      separation: Math.round(a.separation * 1000) / 1000,
      spotThreshold: Math.round(a.spotThreshold),
      outcome: "decoded",
    };

    if (a.variation < bestVar) {
      trace.outcome = "no_variation";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (!a.hasOnOff) {
      trace.outcome = "no_variation";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (a.separation < bestSep) {
      trace.outcome = "low_separation";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (a.index >= maxIdx) {
      trace.outcome = "out_of_range";
      rejectedRange++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (seenIndices.has(a.index)) {
      trace.outcome = "duplicate";
      rejectedDup++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    seenIndices.add(a.index);
    trace.outcome = "decoded";
    diagnostics.spotTraces.push(trace);

    decoded.push({
      deviceIndex: a.index,
      nx: a.spot.x / imgW,
      nz: a.spot.y / imgH,
      side: a.spot.x / imgW < 0.5 ? 0 : 1,
      confidence: a.separation,
    });
  }

  diagnostics.decodedCount = decoded.length;
  diagnostics.rejectedLowSeparation = rejectedLowSep;
  diagnostics.rejectedDuplicate = rejectedDup;
  diagnostics.rejectedOutOfRange = rejectedRange;

  console.log(
    `[CV] Final: ${decoded.length} decoded (sep>=${bestSep}, var>=${bestVar}), rejected: ${rejectedLowSep} low-sep, ${rejectedDup} dup, ${rejectedRange} out-of-range`
  );
  console.log(
    `[CV] Decoded indices: [${decoded.map((d) => d.deviceIndex).sort((a, b) => a - b).join(", ")}]`
  );

  return { decoded, diagnostics };
}

// ── Utility: extract frame from video element ────────────────────────

export function extractFrameFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): ImageData {
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
