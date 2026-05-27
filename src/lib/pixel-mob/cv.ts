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
  endMarkerValidated: number;
  spotsUsed: number;
  decodedCount: number;
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
const MATCH_RADIUS = 60;
const BINARY_BITS = 9;
const SAMPLE_RADIUS = 6;
const MIN_SEPARATION = 0.25;

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
  radius = MATCH_RADIUS
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
  maxDeviceIndex?: number
): { decoded: DecodedDevice[]; diagnostics: CVDiagnostics } {
  const diagnostics: CVDiagnostics = {
    timestamp: Date.now(),
    thresholdUsed: 0,
    darkFrameUsed: !!darkFrame,
    spotsInCal0: 0,
    spotsInCal1: 0,
    crossMatched: 0,
    endMarkerValidated: 0,
    spotsUsed: 0,
    decodedCount: 0,
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
  const calMatch = matchSpots(cal0Spots, cal1Spots);
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
  console.log(`[CV] Cross-matched: ${refSpots.length} spots present in both calibration frames`);

  if (refSpots.length === 0) {
    console.log("[CV] No cross-matched spots — aborting");
    return { decoded: [], diagnostics };
  }

  // Step 6: End-marker validation (frame 11 should also be all-white)
  const endNorm = normalizeContrast(processed[11]);
  const endSpots = extractBrightSpots(endNorm, threshold, MIN_AREA);
  const endMatch = matchSpots(refSpots, endSpots);

  const validatedSpots: DetectedSpot[] = [];
  for (const [ri] of endMatch.entries()) {
    validatedSpots.push(refSpots[ri]);
  }
  diagnostics.endMarkerValidated = validatedSpots.length;
  console.log(`[CV] End-marker validated: ${validatedSpots.length}/${refSpots.length} spots`);

  // If end-marker validation removes too many, fall back to all cross-matched spots
  const spotsToUse =
    validatedSpots.length >= refSpots.length * 0.5
      ? validatedSpots
      : refSpots;

  if (spotsToUse === refSpots && validatedSpots.length < refSpots.length * 0.5) {
    console.log(`[CV] End-marker too strict (${validatedSpots.length}/${refSpots.length}), using all cross-matched spots`);
  }

  // Step 7: Direct brightness sampling across ALL 12 frames
  // Use the bg-subtracted (but NOT normalized) frames for consistent brightness
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

  // Step 8: Per-spot adaptive binary decode with full tracing
  const decoded: DecodedDevice[] = [];
  const seenIndices = new Set<number>();
  const imgW = frames[0].width;
  const imgH = frames[0].height;
  let rejectedLowSep = 0;
  let rejectedDup = 0;
  let rejectedRange = 0;

  for (const track of tracks) {
    const binaryBrightness = track.frameBrightness.slice(2, 11);
    const calBrightness = (track.frameBrightness[0] + track.frameBrightness[1]) / 2;

    const maxB = Math.max(...binaryBrightness);
    const minB = Math.min(...binaryBrightness);
    const spotThreshold = (maxB + minB) / 2;

    // Decode bits regardless of outcome (for tracing)
    let index = 0;
    const bits: number[] = [];
    for (let bit = 0; bit < BINARY_BITS; bit++) {
      const isOn = binaryBrightness[bit] > spotThreshold;
      bits.push(isOn ? 1 : 0);
      if (isOn) {
        index |= 1 << (BINARY_BITS - 1 - bit);
      }
    }

    const onCount = bits.filter((b) => b === 1).length;
    const offCount = bits.filter((b) => b === 0).length;
    const onValues = binaryBrightness.filter((_, i) => bits[i] === 1);
    const offValues = binaryBrightness.filter((_, i) => bits[i] === 0);
    const avgOn = onValues.length > 0 ? onValues.reduce((s, v) => s + v, 0) / onValues.length : 0;
    const avgOff = offValues.length > 0 ? offValues.reduce((s, v) => s + v, 0) / offValues.length : 0;
    const separation = maxB > 0 ? (avgOn - avgOff) / maxB : 0;

    // Build trace for this spot
    const trace: SpotTrace = {
      x: Math.round(track.spot.x),
      y: Math.round(track.spot.y),
      area: Math.round(track.spot.area),
      calBrightness: Math.round(calBrightness),
      frameBrightness: track.frameBrightness.map((v) => Math.round(v)),
      binaryBrightness: binaryBrightness.map((v) => Math.round(v)),
      bits,
      decodedIndex: index,
      separation: Math.round(separation * 1000) / 1000,
      spotThreshold: Math.round(spotThreshold),
      outcome: "decoded",
    };

    // Apply filters and set outcome
    if (maxB - minB < 5) {
      trace.outcome = "no_variation";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (onCount === 0 || offCount === 0) {
      trace.outcome = "no_variation";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (separation < MIN_SEPARATION) {
      trace.outcome = "low_separation";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (calBrightness < spotThreshold) {
      trace.outcome = "low_cal";
      rejectedLowSep++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (maxDeviceIndex !== undefined && index >= maxDeviceIndex) {
      trace.outcome = "out_of_range";
      rejectedRange++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    if (seenIndices.has(index)) {
      trace.outcome = "duplicate";
      rejectedDup++;
      diagnostics.spotTraces.push(trace);
      continue;
    }

    seenIndices.add(index);
    trace.outcome = "decoded";
    diagnostics.spotTraces.push(trace);

    console.log(
      `[CV] Track: bits=[${bits.join("")}] → index=${index} sep=${separation.toFixed(2)} cal=${calBrightness.toFixed(0)} range=[${minB.toFixed(0)},${maxB.toFixed(0)}]`
    );

    decoded.push({
      deviceIndex: index,
      nx: track.spot.x / imgW,
      nz: track.spot.y / imgH,
      side: track.spot.x / imgW < 0.5 ? 0 : 1,
      confidence: separation,
    });
  }

  diagnostics.decodedCount = decoded.length;
  diagnostics.rejectedLowSeparation = rejectedLowSep;
  diagnostics.rejectedDuplicate = rejectedDup;
  diagnostics.rejectedOutOfRange = rejectedRange;

  console.log(
    `[CV] Final: ${decoded.length} decoded, rejected: ${rejectedLowSep} low-sep, ${rejectedDup} dup, ${rejectedRange} out-of-range`
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
