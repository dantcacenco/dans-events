// End-to-end check of the couple music picker. Run with the dev server up:
//   npx next dev -p 3055 & node tests/setlist-e2e.mjs [chromium|webkit]
// Screenshots (EN and RU, every screen) go to $SHOTS (default /tmp/setlist-shots).
import { chromium, webkit, devices } from "playwright";
import fs from "fs";

const BASE = process.env.BASE || "http://localhost:3055";
const SHOTS = process.env.SHOTS || "/tmp/setlist-shots";
const engine = process.argv[2] === "webkit" ? webkit : chromium;
const TOKEN = "demo" + Math.random().toString(36).slice(2, 12).padEnd(10, "x");
fs.mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) failures++; };

const browser = await engine.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: Number(process.env.HEIGHT || 700) }, acceptDownloads: true });  // 700px is about what Safari leaves visible; HEIGHT=844 for full-screen shots
await ctx.addInitScript(() => {
  window.__audios = [];
  const A = window.Audio;
  window.Audio = function (...a) { const x = new A(...a); window.__audios.push(x); return x; };
  window.Audio.prototype = A.prototype;
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const shot = async (n) => { await page.waitForTimeout(350); await page.screenshot({ path: `${SHOTS}/${n}.png`, style: "nextjs-portal{display:none!important}" }); };
const audio = () => page.evaluate(() => { const a = window.__audios[0]; return a ? { src: a.dataset.clip?.split("/").pop(), paused: a.paused, t: a.currentTime, loop: a.loop, dur: a.duration } : null; });
const card = (n) => page.locator(`.sl-style:has(.name:text-is("${n}"))`);
const progress = () => page.locator(".sl-prog").innerText();


// WCAG AA check of every visible text on the current screen. The text is made invisible, the page is photographed,
// and each text box is compared with the brightest and darkest background pixel behind it (so gradients count).
// Disabled controls are exempt; icons need 3:1, normal text 4.5:1, large text (24px, or 18.66px bold) 3:1.
async function audit(pg, label) {
  const items = await pg.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll(".sl *")) {
      if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      if (e.closest(":disabled") || e.classList.contains("emoji") || e.classList.contains("sl-hero") && e.closest(".sl-style, .sl-big, .sl-card-art")) continue;
      // the box of the element's own text (not its padding, rounded corners or child pills)
      const range = document.createRange();
      const own = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
      range.setStartBefore(own[0]);
      range.setEndAfter(own[own.length - 1]);
      const r = range.getBoundingClientRect();
      const hit = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, (r.left + r.right) / 2)), Math.min(innerHeight - 1, Math.max(0, (r.top + r.bottom) / 2)));
      if (!hit || !(e.contains(hit) || hit.contains(e))) continue; // scrolled under the sticky button
      if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
      const cs = getComputedStyle(e);
      let op = 1;
      for (let a = e; a; a = a.parentElement) op *= Number(getComputedStyle(a).opacity);
      if (op < 0.05 || cs.visibility === "hidden") continue;
      const m = cs.color.match(/[\d.]+/g).map(Number);
      out.push({
        t: (e.textContent || "").trim().slice(0, 28), cls: String(e.className || e.tagName),
        rgb: m.slice(0, 3), a: (m[3] ?? 1) * op, size: parseFloat(cs.fontSize), bold: Number(cs.fontWeight) >= 700,
        icon: e.getAttribute("aria-hidden") === "true",
        box: [Math.max(0, Math.floor(r.left)), Math.max(0, Math.floor(r.top)), Math.min(innerWidth, Math.ceil(r.right)), Math.min(innerHeight, Math.ceil(r.bottom))],
      });
    }
    return out;
  });
  await pg.addStyleTag({ content: "nextjs-portal{display:none!important}*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important}" }).then((h) => h.evaluate((n) => (n.id = "__audit")));
  const png = (await pg.screenshot({ scale: "css" })).toString("base64");
  await pg.evaluate(() => document.getElementById("__audit")?.remove());
  return pg.evaluate(async ({ b64, items, label }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const g = cv.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
    const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const fails = [];
    for (const it of items) {
      const [x0, y0, x1, y1] = it.box;
      if (x1 - x0 < 1 || y1 - y0 < 1) continue;
      const d = g.getImageData(x0, y0, x1 - x0, y1 - y0).data;
      let hi = null, lo = null, hiL = -1, loL = 2;
      for (let i = 0; i < d.length; i += 4) {
        const px = [d[i], d[i + 1], d[i + 2]], l = L(px);
        if (l > hiL) { hiL = l; hi = px; }
        if (l < loL) { loL = l; lo = px; }
      }
      const worst = Math.min(...[hi, lo].map((bg) => ratio(L(it.rgb.map((v, k) => v * it.a + bg[k] * (1 - it.a))), L(bg))));
      const large = it.size >= 24 || (it.size >= 18.66 && it.bold);
      const need = it.icon || large ? 3 : 4.5;
      if (worst < need) fails.push(`${label}: "${it.t}" (${it.cls.split(" ")[0]}, ${it.size}px) ${worst.toFixed(2)}:1 < ${need}:1 rgb=${it.rgb} a=${it.a} hi=${hi} lo=${lo}`);
      if (it.size < 12 && !it.icon) fails.push(`${label}: "${it.t}" is ${it.size}px (min 12px)`);
    }
    return { n: items.length, fails };
  }, { b64: png, items, label });
}
const auditOk = async (label) => {
  const r = await audit(page, label);
  ok(r.fails.length === 0, `contrast AA + min size, ${label} (${r.n} text boxes)${r.fails.length ? "\n      " + r.fails.join("\n      ") : ""}`);
};

await page.goto(`${BASE}/songs/${TOKEN}`);
await page.waitForSelector(".sl-big");
await shot("01-home");
await auditOk("home");
ok((await page.locator(".sl-big").count()) === 2, "home shows two big choices (ceremony, reception)");
ok(!(await page.locator("a").count()), "no links on the page (no way to the public site)");

// ---- reception, Anna ----
await page.locator(".sl-big--reception").click();
await page.waitForSelector(".sl-who");
await shot("02-who");
await auditOk("who");
ok((await page.locator(".sl-who button").count()) === 3, "who-is-picking shows Anna, Mike and 'just one of us'");
await page.locator(".sl-who button", { hasText: "Anna" }).click();
await page.waitForSelector(".sl-grid");
ok((await page.locator(".sl-style").count()) === 10, "10 reception style cards");
ok(await page.locator(".sl-cta").isDisabled(), "Continue disabled until a style is chosen");
await shot("03-styles-top");
await auditOk("genres");

// sample play on a card
await page.locator(".sl-style").first().locator("button.sl-circle").click();
await page.waitForTimeout(600);
let a = await audio();
ok(a && !a.paused && a.src.startsWith("pop-1"), `style sample plays the first song hook (${a?.src})`);
await page.locator(".sl-style").first().locator("button.sl-circle").click();
a = await audio();
ok(a.paused, "sample pauses on second tap");

for (const name of ["Pop hits", "Latin", "Russian folk"]) await card(name).click();
ok(!(await page.locator(".sl-cta").isDisabled()), "Continue enabled after choosing styles");
ok((await page.locator(".sl-clean").getAttribute("aria-pressed")) === "true", "clean-only is ON by default");
await page.locator(".sl-clean").scrollIntoViewIfNeeded();
await shot("04-styles-chosen");
await auditOk("genres, chosen + clean toggle");
await page.locator(".sl-cta").click();
await page.waitForSelector(".sl-card");
await page.waitForTimeout(800);
const p1 = await progress();
ok(/^1 \/ 11$/.test(p1), `clean-only deck = 6 pop + 2 latin (explicit Gasolina hidden) + 3 folk = 11 (${p1})`);
a = await audio();
ok(a && !a.paused && a.loop, `first song auto-plays after Continue tap, looping (${a?.src}, t=${a?.t?.toFixed(1)})`);
await shot("05-swipe-card");
await auditOk("song card");

// scrub
await page.locator('.sl-scrub input[type="range"]').fill("14");
await page.waitForTimeout(300);
a = await audio();
ok(Math.abs(a.t - 14) < 2, `scrub bar seeks the clip (currentTime ${a.t.toFixed(1)})`);
ok(/0:1[4-6]/.test(await page.locator(".sl-scrub-row span").first().innerText()), "elapsed time label follows the scrub");
await shot("06-swipe-scrubbed");
// tap on the art (not a drag) pauses and plays
await page.locator(".sl-card-art").click({ position: { x: 60, y: 60 } });
await page.waitForTimeout(200);
ok((await audio()).paused, "tapping the card art pauses the clip");
await page.locator(".sl-card-art").click({ position: { x: 60, y: 60 } });
await page.waitForTimeout(300);
ok(!(await audio()).paused, "tapping it again plays");

// like → next song plays by itself
await page.locator(".sl-act--like").click();
await page.waitForTimeout(500);
ok(/^2 \/ 11$/.test(await progress()), "Like moves to song 2");
a = await audio();
ok(a && !a.paused, `next clip started playing on its own (${a?.src})`);
// skip
await page.locator(".sl-act--skip").click();
ok(/^3 \/ 11$/.test(await progress()), "Skip moves to song 3");
// must play
const titleMust = await page.locator(".sl-title").innerText();
await page.locator(".sl-act--love").click();
ok(/^4 \/ 11$/.test(await progress()), "Must play moves to song 4");
// undo twice
await page.locator(".sl-undo").click();
ok(/^3 \/ 11$/.test(await progress()) && (await page.locator(".sl-title").innerText()) === titleMust, "Undo returns to the must-play card");
await page.locator(".sl-act--love").click();
// swipe right with mouse drag (touch-like)
const art = page.locator(".sl-card-art");
const box = await art.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + 120);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 160, box.y + 130, { steps: 8 });
await shot("07-swipe-dragging");
await page.mouse.up();
await page.waitForTimeout(300);
ok(/^5 \/ 11$/.test(await progress()), "dragging the card right = Like");
// drag left = skip
const b2 = await page.locator(".sl-card-art").boundingBox();
await page.mouse.move(b2.x + b2.width / 2, b2.y + 120);
await page.mouse.down();
await page.mouse.move(b2.x + b2.width / 2 - 170, b2.y + 125, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(300);
ok(/^6 \/ 11$/.test(await progress()), "dragging the card left = Skip");

// reload mid-swipe resumes at the same card
await page.reload();
await page.waitForSelector(".sl-card");
ok(/^6 \/ 11$/.test(await progress()), "refresh resumes at song 6 (progress saved)");
ok(await page.locator(".sl-playhint", { hasText: "Tap to play" }).count() === 1, "after refresh the card asks for one tap to play (iOS rule)");

// finish the deck liking everything
for (let i = 6; i <= 11; i++) { await page.locator(".sl-act--like").click(); }
await page.waitForSelector(".sl-results");
await shot("08-results-anna");
await auditOk("results");
ok(await page.locator("h1", { hasText: "Your picks" }).count() === 1, "deck end opens the results");
const mustRows = await page.locator(".sl-row.must").count();
ok(mustRows >= 1, `must-play list shows the starred song(s) (${mustRows})`);

// change of mind: heart off, flag, X
const before = await page.locator(".sl-row .heart[aria-pressed=true]").count();
await page.locator(".sl-row .heart[aria-pressed=true]").first().click();
ok((await page.locator(".sl-row .heart[aria-pressed=true]").count()) === before - 1, "heart toggles a song out of the approved list");
await page.locator("details summary").click();
await shot("09-results-skipped-open");
await page.locator("details .heart[aria-pressed=false]").first().click();
ok((await page.locator(".sl-row .heart[aria-pressed=true]").count()) === before, "skipped song can be added back with the heart");
const mustNow = await page.locator(".sl-row.must").count();
await page.locator(".sl-sec--liked ~ .sl-group .sl-row .flag").first().click();
ok((await page.locator(".sl-row.must").count()) === mustNow + 1, "flag marks a song Always play");
const xBtn = page.locator(".sl-sec--liked ~ .sl-group .sl-row .x").first();
await xBtn.click();
ok((await page.locator(".sl-row.never").count()) >= 1, "X marks a song Never play");

await page.locator(".sl-notes").fill("Please add 'Sweet Home Alabama'. No Macarena.");
await page.locator(".sl-notes").scrollIntoViewIfNeeded();
await shot("10-results-notes-buttons");
await auditOk("results, notes + buttons");

// exports
const [csv] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Download CSV/ }).click()]);
const csvText = fs.readFileSync(await csv.path(), "utf8");
fs.writeFileSync(`${SHOTS}/dance-set.csv`, csvText);
ok(csvText.includes("Priority,Style") && csvText.includes("Always play") && csvText.includes("Never play") && csvText.includes("Sweet Home Alabama"), `CSV downloaded (${csv.suggestedFilename()}, ${csvText.split("\n").length - 2} rows incl. notes)`);
const [txt] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Download text/ }).click()]);
const txtText = fs.readFileSync(await txt.path(), "utf8");
fs.writeFileSync(`${SHOTS}/dance-set.txt`, txtText);
ok(txtText.startsWith("RECEPTION") && txtText.includes("ALWAYS PLAY"), `text downloaded (${txt.suggestedFilename()})`);
await ctx.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
await page.getByRole("button", { name: /Copy list/ }).click();
await page.getByRole("button", { name: /Copied/ }).waitFor({ timeout: 3000 }).catch(() => {});
ok(await page.getByRole("button", { name: /Copied/ }).count() === 1, "copy-to-clipboard shows Copied");
await page.getByRole("button", { name: /Send to Dan/ }).click();
await page.waitForTimeout(300);
ok(await page.getByText("Prototype: nothing was actually sent yet.").count() === 1, "Send-to-Dan is a stub (nothing sent)");

// ---- Mike picks separately, then the match view ----
await page.getByRole("button", { name: "Who's picking?" }).click();
await page.locator(".sl-who button", { hasText: "Mike" }).click();
await card("Pop hits").click();
await card("R&B & hip-hop").click();
await page.locator(".sl-clean").click(); // clean off for Mike
await page.locator(".sl-cta").click();
await page.waitForSelector(".sl-card");
const mikeTotal = Number((await progress()).match(/\/ (\d+)/)[1]);
ok(mikeTotal === 9, `Mike with clean-only OFF gets 6 pop + 3 hip-hop = 9 (${mikeTotal})`);
for (let i = 0; i < mikeTotal; i++) { await page.locator(i % 3 === 2 ? ".sl-act--skip" : ".sl-act--like").click(); }
await page.waitForSelector(".sl-tabs");
await shot("11-results-both");
const tabs = await page.locator(".sl-tabs button").allInnerTexts();
ok(tabs.length === 3 && /Both loved/.test(tabs[0]), `results has Both / Anna / Mike tabs (${tabs.join(" | ")})`);
await page.locator(".sl-tabs button").nth(2).click();
await shot("12-results-mike");
await auditOk("results, Mike");

// ---- Russian UI mid-process ----
await page.getByRole("button", { name: "RU", exact: true }).click();
await page.waitForTimeout(200);
ok(await page.locator("h1", { hasText: "Ваш выбор" }).count() === 1, "RU toggle switches the results page without losing data");
await shot("13-results-ru");
await auditOk("results RU");
await page.locator(".sl-back").click(); // → home
await page.waitForSelector(".sl-big");
await shot("14-home-ru");
await auditOk("home RU");
await page.locator(".sl-big--reception").click(); // both partners done → results
await page.waitForSelector(".sl-tabs");
await page.locator(".sl-tabs button").nth(1).click(); // Anna
await page.getByRole("button", { name: /Выбрать ещё стили/ }).click();
await page.waitForSelector(".sl-grid");
await shot("15-styles-ru");
await auditOk("genres RU");
await page.getByRole("button", { name: "EN", exact: true }).click();

// ---- ceremony ----
await page.locator(".sl-back").click(); // styles → who
await page.locator(".sl-back").click(); // who → home
await page.locator(".sl-big--ceremony").click();
await page.locator(".sl-who button", { hasText: "Mike" }).click();
await page.waitForSelector(".sl-grid");
ok((await page.locator(".sl-style").count()) === 5, "5 ceremony style cards");
ok(await page.locator(".sl-clean").count() === 0, "no clean-only switch on the ceremony side");
await shot("16-ceremony-styles");
await auditOk("ceremony genres");
// the phone's back gesture / button steps up one screen instead of leaving the page
await page.goBack();
await page.waitForSelector(".sl-who");
ok(true, "back gesture on the genre screen returns to who's picking");
await page.goBack();
await page.waitForSelector(".sl-big");
ok(true, "back gesture again returns to home");
await page.locator(".sl-big--ceremony").click();
await page.locator(".sl-who button", { hasText: "Mike" }).click();
await page.waitForSelector(".sl-grid");
for (const n of ["Classical & strings", "Piano & modern", "Joyful exit songs"]) await card(n).click();
await page.locator(".sl-cta").click();
await page.waitForSelector(".sl-card");
ok(await page.locator(".sl-chip--moment").count() === 1, "ceremony card carries its moment tag");
await shot("17-ceremony-card");
await auditOk("ceremony song card");
const cTotal = Number((await progress()).match(/\/ (\d+)/)[1]);
for (let i = 0; i < cTotal; i++) await page.locator(i % 2 ? ".sl-act--skip" : ".sl-act--like").click();
await page.waitForSelector(".sl-results");
await shot("18-ceremony-results");
await auditOk("ceremony results");
const sections = await page.locator(".sl-sub2").allInnerTexts();
ok(sections.length >= 2, `ceremony results grouped by moment (${sections.join(", ")})`);

// ---- persistence across a fresh page load ----
await page.reload();
await page.waitForSelector(".sl-results");
ok(await page.locator(".sl-results").count() === 1, "reload lands back on the results (state in localStorage)");


// ---- Russian walk-through of every screen (fresh couple) ----
{
  const c3 = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: Number(process.env.HEIGHT || 700) } });
  const pg = await c3.newPage();
  const rshot = async (n) => { await pg.waitForTimeout(350); await pg.screenshot({ path: `${SHOTS}/${n}.png`, style: "nextjs-portal{display:none!important}" }); };
  const raudit = async (label) => { const r = await audit(pg, label); ok(r.fails.length === 0, `contrast AA + min size, ${label} (${r.n} text boxes)${r.fails.length ? "\n      " + r.fails.join("\n      ") : ""}`); };
  await pg.goto(`${BASE}/songs/${TOKEN}ru`);
  await pg.waitForSelector(".sl-big");
  await pg.getByRole("button", { name: "RU", exact: true }).click();
  await rshot("ru-1-home");
  await pg.locator(".sl-big--reception").click();
  await pg.waitForSelector(".sl-who");
  await rshot("ru-2-who");
  await raudit("RU who");
  await pg.locator(".sl-who button").first().click();
  await pg.waitForSelector(".sl-grid");
  for (const n of ["Поп-хиты", "Латино"]) await pg.locator(`.sl-style:has(.name:text-is("${n}"))`).click();
  await rshot("ru-3-genres");
  await pg.locator(".sl-cta").click();
  await pg.waitForSelector(".sl-card");
  await rshot("ru-4-swipe-card");
  await raudit("RU song card");
  for (let i = 0; i < 40 && !(await pg.locator(".sl-results").count()); i++) await pg.locator(".sl-act--like").click({ timeout: 2000 }).catch(() => {});
  await pg.waitForSelector(".sl-results");
  await rshot("ru-5-results");
  await pg.locator(".sl-back").click();
  await pg.locator(".sl-big--ceremony").click();
  await pg.locator(".sl-who button").first().click();
  await pg.waitForSelector(".sl-grid");
  await rshot("ru-6-ceremony-genres");
  await pg.locator(".sl-style").first().click();
  await pg.locator(".sl-cta").click();
  await pg.waitForSelector(".sl-card");
  await rshot("ru-7-ceremony-card");
  await raudit("RU ceremony song card");
  await c3.close();
}

// ---- small and large phones: nothing overlaps or overflows sideways ----
for (const [w, h] of [[390, 844], [390, 664], [375, 553], [430, 932]]) {
  const c2 = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: w, height: h } });
  const pg = await c2.newPage();
  await pg.goto(`${BASE}/songs/${TOKEN}`);
  await pg.waitForSelector(".sl-big");
  await pg.evaluate(() => localStorage.clear());
  await pg.reload();
  await pg.locator(".sl-big--reception").click();
  await pg.locator(".sl-who button").first().click();
  await pg.waitForSelector(".sl-grid");
  await pg.locator(".sl-style").first().click();
  const noSide = () => pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  const cardBox = await pg.locator(".sl-style").first().boundingBox();
  ok(cardBox.height > 200 && cardBox.y + cardBox.height < h, `${w}x${h}: genre cover fits on screen (${Math.round(cardBox.height)}px tall)`);
  ok(await noSide(), `${w}x${h}: genre screen has no sideways overflow`);
  await pg.locator(".sl-cta").click();
  await pg.waitForSelector(".sl-card");
  await pg.waitForTimeout(400);
  const lay = await pg.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    return { scrubBottom: r(".sl-scrub").bottom, stickyTop: r(".sl-sticky").top, art: r(".sl-card-art").width, h: innerHeight, sh: document.documentElement.scrollHeight };
  });
  ok(lay.scrubBottom <= lay.stickyTop + 1, `${w}x${h}: song card and scrub bar sit above the buttons (${Math.round(lay.scrubBottom)} <= ${Math.round(lay.stickyTop)}, picture ${Math.round(lay.art)}px)`);
  ok(await noSide(), `${w}x${h}: song screen has no sideways overflow`);
  await c2.close();
}

console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "no console errors");
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
await browser.close();
process.exit(failures ? 1 : 0);
