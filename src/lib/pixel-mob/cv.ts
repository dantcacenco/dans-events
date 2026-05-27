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
};

const BRIGHTNESS_THRESHOLD = 160;
const MIN_AREA = 4;
const MATCH_RADIUS = 40;
const BINARY_BITS = 9;

export function extractBrightSpots(
  imageData: ImageData,
  threshold = BRIGHTNESS_THRESHOLD,
  minArea = MIN_AREA
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

      // flood fill to find connected bright region
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

      if (count >= minArea) {
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

// frames[0], frames[1] = calibration (all white)
// frames[2..10] = 9 binary bit frames
// frames[11] = end marker (all white)
export function processBlinkFrames(
  frames: ImageData[],
  threshold?: number
): DecodedDevice[] {
  if (frames.length < 12) return [];

  // detect spots in calibration frames and merge
  const cal0 = extractBrightSpots(frames[0], threshold);
  const cal1 = extractBrightSpots(frames[1], threshold);

  // use the calibration frame with more spots as the reference
  const refSpots = cal0.length >= cal1.length ? cal0 : cal1;

  if (refSpots.length === 0) return [];

  // initialize tracks from reference spots
  const tracks: TrackedSpot[] = refSpots.map((s, i) => ({
    id: i,
    positions: [{ x: s.x, y: s.y }],
    brightness: [],
  }));

  // for each binary frame, detect spots and match to tracks
  for (let f = 2; f <= 10; f++) {
    if (f >= frames.length) break;

    const spots = extractBrightSpots(frames[f], threshold);
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
        // spot not found = dark = bit 0
        tracks[ti].brightness.push(false);
      }
    }
  }

  // decode binary IDs
  const decoded: DecodedDevice[] = [];
  const imgW = frames[0].width;
  const imgH = frames[0].height;

  for (const track of tracks) {
    if (track.brightness.length < BINARY_BITS - 1) continue;

    let index = 0;
    for (let bit = 0; bit < BINARY_BITS; bit++) {
      if (bit < track.brightness.length && track.brightness[bit]) {
        index |= 1 << (BINARY_BITS - 1 - bit);
      }
    }

    // average position across all observations
    const avgX =
      track.positions.reduce((s, p) => s + p.x, 0) / track.positions.length;
    const avgY =
      track.positions.reduce((s, p) => s + p.y, 0) / track.positions.length;

    const nx = avgX / imgW;
    const nz = avgY / imgH;

    decoded.push({
      deviceIndex: index,
      nx,
      nz,
      side: nx < 0.5 ? 0 : 1,
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
