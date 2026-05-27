import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:3099';
const ADMIN_KEY = 'crowdpixel-admin-2026';
const DIR = '/tmp/pixel-mob-frames';
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

async function countWhitePixels(page, pngPath) {
  const buf = fs.readFileSync(pngPath);
  const b64 = buf.toString('base64');
  return page.evaluate(async (b64) => {
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = 'data:image/png;base64,' + b64; });
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let w = 0;
    for (let j = 0; j < d.length; j += 4) if (d[j] > 200 && d[j+1] > 200 && d[j+2] > 200) w++;
    return w;
  }, b64);
}

async function run() {
  console.log('=== Blink Frame-by-Frame Capture ===\n');

  // Reset
  await fetch(`${BASE}/api/pixel-mob/devices`, { method: 'DELETE', headers: { 'x-admin-key': ADMIN_KEY } });
  await fetch(`${BASE}/api/pixel-mob/cue`, { method: 'DELETE', headers: { 'x-admin-key': ADMIN_KEY } });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 800, height: 600 } });
  const grid = await ctx.newPage();

  grid.on('console', msg => {
    const t = msg.text();
    if (t.startsWith('[TestGrid]') && !t.includes('Device ')) console.log('  ' + t);
  });

  console.log('[1] Registering 50 devices...');
  await grid.goto(`${BASE}/pixel-mob-test`);
  await grid.waitForFunction(() => {
    for (const s of document.querySelectorAll('span'))
      if (s.textContent?.includes('50/50')) return true;
    return false;
  }, { timeout: 90000 });
  console.log('[1] Done\n');

  // Trigger blink
  const cueRes = await fetch(`${BASE}/api/pixel-mob/cue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
    body: JSON.stringify({ type: 'blink_register' })
  });
  const { cue } = await cueRes.json();
  console.log(`[2] Cue: startAt in ${((cue.startAt - Date.now())/1000).toFixed(1)}s, duration=${cue.duration}ms`);
  console.log(`    Blink = 12 frames × 500ms. Capturing every 200ms to catch every frame.\n`);

  // Wait until 500ms before blink starts
  const preWait = cue.startAt - Date.now() - 500;
  if (preWait > 0) await new Promise(r => setTimeout(r, preWait));

  // Capture at ~200ms intervals (5 per second = 2-3 per blink frame)
  console.log('[3] Capturing frames...');
  console.log('    Frame | Status                        | White px | Blink frame');
  console.log('    ------|-------------------------------|----------|------------');

  let i = 0;
  const captureEnd = cue.startAt + cue.duration + 2000;

  while (Date.now() < captureEnd && i < 100) {
    const now = Date.now();
    const relMs = now - cue.startAt;
    const blinkFrame = Math.floor(relMs / 500);
    const phase = relMs < 0 ? 'pre' : (relMs >= cue.duration ? 'post' : `F${blinkFrame.toString().padStart(2)}`);

    const path = `${DIR}/frame-${String(i).padStart(3,'0')}.png`;
    await grid.screenshot({ path });

    const status = await grid.evaluate(() => document.querySelectorAll('span')[0]?.textContent || '');
    const wpx = await countWhitePixels(grid, path);

    const bar = wpx > 100 ? '█'.repeat(Math.min(20, Math.floor(wpx / 50))) : (wpx > 10 ? '▓' : '░');
    console.log(`    ${String(i).padStart(4)}  | ${status.padEnd(29)} | ${String(wpx).padStart(8)} | ${phase} ${bar}`);

    i++;
    // Target 200ms between captures (minus time spent on screenshot/analysis)
    const elapsed = Date.now() - now;
    const sleep = Math.max(50, 200 - elapsed);
    await new Promise(r => setTimeout(r, sleep));
  }

  console.log(`\n[4] Captured ${i} frames to ${DIR}/`);

  // Summary
  const finalStatus = await grid.evaluate(() => document.querySelectorAll('span')[0]?.textContent || '');
  console.log(`[5] Final status: "${finalStatus}"`);

  const ok = finalStatus.includes('ended') || finalStatus.includes('Ready') || finalStatus.includes('waiting');
  console.log(ok ? '\n✅ PASS' : '\n❌ FAIL');

  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
