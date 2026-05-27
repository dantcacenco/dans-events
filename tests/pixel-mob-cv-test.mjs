import { chromium } from 'playwright';

const BASE = 'http://localhost:3099';
const ADMIN_KEY = 'admin';
const PHONE_COUNT = 50;

async function run() {
  console.log('=== Automated CV Registration Test ===\n');

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  page.on('console', msg => {
    const t = msg.text();
    if (t.startsWith('[TestGrid]') && !t.includes('Device ')) console.log('  ' + t);
  });

  // Step 1: Open test grid (auto-resets + registers 50 devices)
  console.log('[1] Opening test grid (resets devices, registers 50)...');
  await page.goto(`${BASE}/pixel-mob-test`);
  await page.waitForFunction(() => {
    for (const s of document.querySelectorAll('span'))
      if (s.textContent?.includes('50/50')) return true;
    return false;
  }, { timeout: 120000 });
  console.log('[1] 50 devices registered\n');

  // Step 2: Capture dark frame (all phones showing black "ready" screen)
  console.log('[2] Capturing dark frame...');
  const darkScreenshot = await page.screenshot({ type: 'png' });
  console.log('[2] Dark frame captured\n');

  // Step 3: Trigger blink cue
  console.log('[3] Triggering blink cue...');
  const cueRes = await fetch(`${BASE}/api/pixel-mob/cue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
    body: JSON.stringify({ type: 'blink_register' }),
  });
  const { cue } = await cueRes.json();
  const blinkStartAt = cue.startAt;
  console.log(`[3] Cue created: startAt in ${((blinkStartAt - Date.now()) / 1000).toFixed(1)}s\n`);

  // Step 4: Capture frames at ~100ms intervals through the entire blink
  console.log('[4] Capturing frames...');
  const preWait = blinkStartAt - Date.now() - 1000;
  if (preWait > 0) await new Promise(r => setTimeout(r, preWait));

  const captureEnd = blinkStartAt + 12 * 500 + 2000;
  const screenshots = [];
  let i = 0;

  while (Date.now() < captureEnd && i < 200) {
    const timestamp = Date.now();
    const png = await page.screenshot({ type: 'png' });
    screenshots.push({ png, timestamp });
    i++;
    const elapsed = Date.now() - timestamp;
    const sleep = Math.max(30, 100 - elapsed);
    await new Promise(r => setTimeout(r, sleep));
  }
  console.log(`[4] Captured ${screenshots.length} frames\n`);

  // Step 5: Process frames in browser context (has Canvas API)
  console.log('[5] Running CV processing in browser...');

  const result = await page.evaluate(async ({ darkPng, framePngs, blinkStartAt }) => {
    // Helper: PNG buffer to ImageData
    async function pngToImageData(b64) {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = 'data:image/png;base64,' + b64;
      });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, c.width, c.height);
    }

    // Convert dark frame
    const darkFrame = await pngToImageData(darkPng);

    // Convert all captured frames
    const frames = [];
    for (const f of framePngs) {
      const imageData = await pngToImageData(f.png);
      frames.push({ imageData, timestamp: f.timestamp });
    }

    // Align frames to blink timing
    const BLINK_FRAME_MS = 500;
    const TOTAL_FRAMES = 12;
    const aligned = [];
    const deltas = [];

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
    }

    // === Inline CV processing (simplified for test) ===

    function subtractBg(frame, bg) {
      const out = new ImageData(frame.width, frame.height);
      for (let i = 0; i < frame.data.length; i += 4) {
        out.data[i] = Math.max(0, frame.data[i] - bg.data[i]);
        out.data[i + 1] = Math.max(0, frame.data[i + 1] - bg.data[i + 1]);
        out.data[i + 2] = Math.max(0, frame.data[i + 2] - bg.data[i + 2]);
        out.data[i + 3] = 255;
      }
      return out;
    }

    function otsu(imageData) {
      const hist = new Uint32Array(256);
      const { data, width, height } = imageData;
      const total = width * height;
      for (let i = 0; i < data.length; i += 4) {
        hist[Math.round((data[i] + data[i+1] + data[i+2]) / 3)]++;
      }
      let sumTotal = 0;
      for (let i = 0; i < 256; i++) sumTotal += i * hist[i];
      let sumBg = 0, wBg = 0, maxVar = 0, best = 128;
      for (let t = 0; t < 256; t++) {
        wBg += hist[t];
        if (wBg === 0) continue;
        const wFg = total - wBg;
        if (wFg === 0) break;
        sumBg += t * hist[t];
        const v = wBg * wFg * ((sumBg/wBg) - ((sumTotal-sumBg)/wFg)) ** 2;
        if (v > maxVar) { maxVar = v; best = t; }
      }
      return best;
    }

    function normContrast(imageData) {
      const { data, width, height } = imageData;
      let min = 255, max = 0;
      for (let i = 0; i < data.length; i += 4) {
        const g = (data[i]+data[i+1]+data[i+2])/3;
        if (g < min) min = g;
        if (g > max) max = g;
      }
      if (max - min < 10) return imageData;
      const out = new ImageData(width, height);
      const range = max - min;
      for (let i = 0; i < data.length; i += 4) {
        out.data[i] = Math.round(((data[i]-min)/range)*255);
        out.data[i+1] = Math.round(((data[i+1]-min)/range)*255);
        out.data[i+2] = Math.round(((data[i+2]-min)/range)*255);
        out.data[i+3] = 255;
      }
      return out;
    }

    function findSpots(imageData, threshold, minArea = 4) {
      const { width, height, data } = imageData;
      const visited = new Uint8Array(width * height);
      const spots = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (visited[idx]) continue;
          const px = idx * 4;
          if ((data[px]+data[px+1]+data[px+2])/3 < threshold) continue;
          const stack = [idx]; visited[idx] = 1;
          let sx=0,sy=0,sb=0,cnt=0;
          while (stack.length > 0) {
            const ci = stack.pop();
            const cx = ci % width, cy = (ci-cx)/width;
            const cpx = ci*4;
            sx+=cx; sy+=cy; sb+=(data[cpx]+data[cpx+1]+data[cpx+2])/3; cnt++;
            if (cnt > 50000) { while(stack.length) visited[stack.pop()]=1; break; }
            for (const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
              const nx=cx+dx, ny=cy+dy;
              if (nx<0||nx>=width||ny<0||ny>=height) continue;
              const ni = ny*width+nx;
              if (visited[ni]) continue;
              const npx=ni*4;
              if ((data[npx]+data[npx+1]+data[npx+2])/3 < threshold) continue;
              visited[ni]=1; stack.push(ni);
            }
          }
          if (cnt >= minArea && cnt <= 50000) {
            spots.push({x:sx/cnt, y:sy/cnt, area:cnt, avgBrightness:sb/cnt});
          }
        }
      }
      return spots;
    }

    function matchSpots(prev, curr, radius=60) {
      const matches = new Map();
      const used = new Set();
      for (let pi=0; pi<prev.length; pi++) {
        let bd=radius*radius, bc=-1;
        for (let ci=0; ci<curr.length; ci++) {
          if (used.has(ci)) continue;
          const d = (prev[pi].x-curr[ci].x)**2 + (prev[pi].y-curr[ci].y)**2;
          if (d<bd) { bd=d; bc=ci; }
        }
        if (bc>=0) { matches.set(pi,bc); used.add(bc); }
      }
      return matches;
    }

    function mergeSpots(spots, radius) {
      const merged = [];
      const used = new Set();
      for (let i=0; i<spots.length; i++) {
        if (used.has(i)) continue;
        used.add(i);
        let sx=spots[i].x*spots[i].area, sy=spots[i].y*spots[i].area;
        let sb=spots[i].avgBrightness*spots[i].area, ta=spots[i].area;
        for (let j=i+1; j<spots.length; j++) {
          if (used.has(j)) continue;
          if ((spots[i].x-spots[j].x)**2+(spots[i].y-spots[j].y)**2 < radius*radius) {
            used.add(j);
            sx+=spots[j].x*spots[j].area; sy+=spots[j].y*spots[j].area;
            sb+=spots[j].avgBrightness*spots[j].area; ta+=spots[j].area;
          }
        }
        merged.push({x:sx/ta, y:sy/ta, area:ta, avgBrightness:sb/ta});
      }
      return merged;
    }

    function sampleBright(imageData, cx, cy, r) {
      const { data, width, height } = imageData;
      let sum=0, cnt=0;
      const ri = Math.ceil(r);
      for (let dy=-ri; dy<=ri; dy++) {
        for (let dx=-ri; dx<=ri; dx++) {
          if (dx*dx+dy*dy>r*r) continue;
          const x=Math.round(cx)+dx, y=Math.round(cy)+dy;
          if (x<0||x>=width||y<0||y>=height) continue;
          const idx=(y*width+x)*4;
          sum+=(data[idx]+data[idx+1]+data[idx+2])/3;
          cnt++;
        }
      }
      return cnt>0 ? sum/cnt : 0;
    }

    // Process
    const processed = aligned.map(f => subtractBg(f, darkFrame));
    const cal0N = normContrast(processed[0]);
    const cal1N = normContrast(processed[1]);
    const thresh = Math.max(30, Math.min(otsu(cal0N), otsu(cal1N)));

    const cal0S = findSpots(cal0N, thresh);
    const cal1S = findSpots(cal1N, thresh);
    // Adaptive match radius: 10x median spot radius
    const allCalAreas = [...cal0S.map(s=>s.area),...cal1S.map(s=>s.area)].sort((a,b)=>a-b);
    const medCalArea = allCalAreas[Math.floor(allCalAreas.length/2)] || 16;
    const dynMatchR = Math.max(15, Math.min(100, Math.ceil(Math.sqrt(medCalArea/Math.PI)*10)));
    console.log(`[CV-test] Match radius: ${dynMatchR} (median area: ${medCalArea.toFixed(0)})`);
    const calMatch = matchSpots(cal0S, cal1S, dynMatchR);
    const refSpots = [];
    for (const [i0,i1] of calMatch.entries()) {
      refSpots.push({
        x:(cal0S[i0].x+cal1S[i1].x)/2, y:(cal0S[i0].y+cal1S[i1].y)/2,
        area:(cal0S[i0].area+cal1S[i1].area)/2,
        avgBrightness:(cal0S[i0].avgBrightness+cal1S[i1].avgBrightness)/2
      });
    }

    // Adaptive merge radius: 3x median spot radius
    const refAreas = refSpots.map(s => s.area).sort((a,b) => a-b);
    const medArea = refAreas[Math.floor(refAreas.length/2)] || 16;
    const mRadius = Math.max(8, Math.ceil(Math.sqrt(medArea / Math.PI) * 3));
    console.log(`[CV-test] Merge radius: ${mRadius} (median area: ${medArea.toFixed(0)})`);
    const merged = mergeSpots(refSpots, mRadius);
    const sr = Math.max(6, Math.ceil(Math.sqrt(merged[0]?.area??16)/2)+2);

    // Sample brightness for each spot across all frames
    const tracks = merged.map(spot => {
      const fb = [];
      for (let f=0; f<12; f++) fb.push(sampleBright(processed[f], spot.x, spot.y, sr));
      return { spot, fb };
    });

    // Analyze all spots
    const analyzed = tracks.map(t => {
      const bb = t.fb.slice(2, 11);
      const maxB = Math.max(...bb), minB = Math.min(...bb);
      const th = (maxB+minB)/2;
      let idx=0; const bits=[];
      for (let b=0; b<9; b++) {
        const on = bb[b]>th; bits.push(on?1:0);
        if (on) idx |= 1<<(8-b);
      }
      const onC = bits.filter(b=>b===1).length;
      const onVals = bb.filter((_,i)=>bits[i]===1);
      const offVals = bb.filter((_,i)=>bits[i]===0);
      const avgOn = onVals.length>0 ? onVals.reduce((s,v)=>s+v,0)/onVals.length : 0;
      const avgOff = offVals.length>0 ? offVals.reduce((s,v)=>s+v,0)/offVals.length : 0;
      const sep = maxB>0 ? (avgOn-avgOff)/maxB : 0;
      return { x:t.spot.x, y:t.spot.y, area:t.spot.area, bb, bits, idx, sep, var:maxB-minB, hasOnOff:onC>0&&onC<9 };
    });

    // Parameter sweep with expected count
    const sepCands = [0.02, 0.05, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4];
    const varCands = [1, 2, 3, 5, 8, 12];
    const expectedCount = 50;
    let bestDec=[], bestSep=0, bestVar=0, bestScore=-Infinity;

    for (const ms of sepCands) {
      for (const mv of varCands) {
        const seen = new Set();
        let unique=0, dups=0;
        for (const a of analyzed) {
          if (a.var<mv||!a.hasOnOff||a.sep<ms||a.idx>=expectedCount) continue;
          if (seen.has(a.idx)) { dups++; continue; }
          seen.add(a.idx); unique++;
        }
        const score = unique - Math.abs(unique - expectedCount) * 0.5 - dups * 0.3;
        if (score > bestScore) { bestScore=score; bestSep=ms; bestVar=mv; }
      }
    }

    // Apply best params
    const finalSeen = new Set();
    const decoded = [];
    for (const a of analyzed) {
      if (a.var<bestVar||!a.hasOnOff||a.sep<bestSep||a.idx>=expectedCount) continue;
      if (finalSeen.has(a.idx)) continue;
      finalSeen.add(a.idx);
      decoded.push({ idx: a.idx, sep: a.sep, bits: a.bits.join('') });
    }

    return {
      threshold: thresh,
      cal0Spots: cal0S.length,
      cal1Spots: cal1S.length,
      crossMatched: refSpots.length,
      merged: merged.length,
      totalAnalyzed: analyzed.length,
      bestSep, bestVar, bestScore,
      decoded: decoded.sort((a,b) => a.idx - b.idx),
      decodedCount: decoded.length,
      deltas,
    };
  }, {
    darkPng: darkScreenshot.toString('base64'),
    framePngs: screenshots.map(s => ({ png: s.png.toString('base64'), timestamp: s.timestamp })),
    blinkStartAt,
  });

  // Report
  console.log(`\n=== RESULTS ===`);
  console.log(`Threshold: ${result.threshold}`);
  console.log(`Cal spots: ${result.cal0Spots} / ${result.cal1Spots}`);
  console.log(`Cross-matched: ${result.crossMatched} → Merged: ${result.merged}`);
  console.log(`Best params: sep=${result.bestSep}, var=${result.bestVar}`);
  console.log(`Alignment deltas: ${result.deltas}`);
  console.log(`\nDECODED: ${result.decodedCount} / ${PHONE_COUNT}`);
  console.log(`Indices: [${result.decoded.map(d => d.idx).join(', ')}]`);

  const missing = [];
  for (let i = 0; i < PHONE_COUNT; i++) {
    if (!result.decoded.find(d => d.idx === i)) missing.push(i);
  }
  console.log(`Missing: [${missing.join(', ')}]`);
  console.log(`\n${result.decodedCount >= PHONE_COUNT * 0.8 ? '✅ PASS' : '❌ FAIL'} (${result.decodedCount}/${PHONE_COUNT}, need ≥${Math.ceil(PHONE_COUNT*0.8)})`);

  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
