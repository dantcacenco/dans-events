export type DetectedSpot = {
  x: number;
  y: number;
  area: number;
};

export type TrackedSpot = {
  id: number;
  positions: { x: number; y: number }[];
  brightness: boolean[];
};

export type DecodedDevice = {
  deviceIndex: number;
  nx: number;
  nz: number;
  side: number;
  confidence: number;
};

const BRIGHTNESS_THRESHOLD = 200;
const MIN_AREA = 30;
const MAX_AREA = 50000;
const MATCH_RADIUS = 60;
const BINARY_BITS = 9;
const MIN_BITS_REQUIRED = 7;

export function extractBrightSpots(
  imageData: ImageData,
  threshold = BRIGHTNESS_THRESHOLD,
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
      let sumX = 0,
        sumY = 0,
        count = 0;

      while (stack.length > 0) {
        const ci = stack.pop()!;
        const cx = ci % width;
        const cy = (ci - cx) / width;
        sumX += cx;
        sumY += cy;
        count++;

        if (count > maxArea) {
          while (stack.length > 0) {
            visited[stack.pop()!] = 1;
          }
          break;
        }

        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
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
        spots.push({ x: sumX / count, y: sumY / count, area: count });
      }
    }
  }

  return spots;
}

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

function filterSimilarSizedSpots(spots: DetectedSpot[]): DetectedSpot[] {
  if (spots.length < 3) return spots;
  const areas = spots.map((s) => s.area).sort((a, b) => a - b);
  const median = areas[Math.floor(areas.length / 2)];
  return spots.filter(
    (s) => s.area >= median * 0.2 && s.area <= median * 5
  );
}

// frames[0], frames[1] = calibration (all white)
// frames[2..10] = 9 binary bit frames
// frames[11] = end marker (all white)
export function processBlinkFrames(
  frames: ImageData[],
  threshold?: number
): DecodedDevice[] {
  if (frames.length < 12) return [];

  const th = threshold ?? BRIGHTNESS_THRESHOLD;

  // detect in both calibration frames, keep only spots present in both
  const cal0 = filterSimilarSizedSpots(extractBrightSpots(frames[0], th));
  const cal1 = filterSimilarSizedSpots(extractBrightSpots(frames[1], th));

  // cross-match calibration frames — only keep spots visible in both
  const matchCal = matchSpots(cal0, cal1);
  const refSpots: DetectedSpot[] = [];
  for (const [i0, i1] of matchCal.entries()) {
    refSpots.push({
      x: (cal0[i0].x + cal1[i1].x) / 2,
      y: (cal0[i0].y + cal1[i1].y) / 2,
      area: (cal0[i0].area + cal1[i1].area) / 2,
    });
  }

  if (refSpots.length === 0) return [];

  const tracks: TrackedSpot[] = refSpots.map((s, i) => ({
    id: i,
    positions: [{ x: s.x, y: s.y }],
    brightness: [],
  }));

  for (let f = 2; f <= 10; f++) {
    if (f >= frames.length) break;

    const spots = extractBrightSpots(frames[f], th);
    const lastPositions: DetectedSpot[] = tracks.map((t) => {
      const last = t.positions[t.positions.length - 1];
      return { x: last.x, y: last.y, area: 0 };
    });

    const matches = matchSpots(lastPositions, spots);

    for (let ti = 0; ti < tracks.length; ti++) {
      const ci = matches.get(ti);
      if (ci !== undefined) {
        tracks[ti].positions.push({
          x: spots[ci].x,
          y: spots[ci].y,
        });
        tracks[ti].brightness.push(true);
      } else {
        tracks[ti].brightness.push(false);
      }
    }
  }

  const decoded: DecodedDevice[] = [];
  const imgW = frames[0].width;
  const imgH = frames[0].height;
  const seenIndices = new Set<number>();

  for (const track of tracks) {
    if (track.brightness.length < MIN_BITS_REQUIRED) continue;

    let index = 0;
    let bitsObserved = 0;
    for (let bit = 0; bit < BINARY_BITS; bit++) {
      if (bit < track.brightness.length) {
        bitsObserved++;
        if (track.brightness[bit]) {
          index |= 1 << (BINARY_BITS - 1 - bit);
        }
      }
    }

    // reject if not enough bits or duplicate index
    const confidence = bitsObserved / BINARY_BITS;
    if (confidence < 0.78) continue;
    if (seenIndices.has(index)) continue;
    seenIndices.add(index);

    const avgX =
      track.positions.reduce((s, p) => s + p.x, 0) / track.positions.length;
    const avgY =
      track.positions.reduce((s, p) => s + p.y, 0) / track.positions.length;

    decoded.push({
      deviceIndex: index,
      nx: avgX / imgW,
      nz: avgY / imgH,
      side: avgX / imgW < 0.5 ? 0 : 1,
      confidence,
    });
  }

  return decoded;
}

export function extractFrameFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): ImageData {
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
