// Headless Playwright run of the check-in kiosk against a LOCAL server (never a visible browser).
// Usage: BASE=http://localhost:3411 PIN=... OUT=/path/to/shots node tests/checkin-e2e.mjs
import { chromium, devices } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE || "http://localhost:3411";
const PIN = process.env.PIN || "";
const OUT = process.env.OUT || "/tmp/checkin-shots";
fs.mkdirSync(OUT, { recursive: true });
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? "PASS" : "FAIL"} ${msg}`); if (!ok) fails++; };

const browser = await chromium.launch();
const ipadL = { viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, hasTouch: true, isMobile: false };
const ipadP = { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, hasTouch: true, isMobile: false };

async function fill(page, { name, phone, party = 1, overnight, meals = [] }) {
  await page.fill('input[type="text"], input:not([type])', name);
  await page.fill('input[type="tel"]', phone);
  for (let i = 1; i < party; i++) await page.click('button[aria-label="+"]');
  if (overnight !== undefined) await page.click(`.ck-yn button:nth-child(${overnight ? 1 : 2})`);
  for (const i of meals) await page.click(`.ck-meal:nth-child(${i})`);
}

// 1. all four modes, both languages, landscape + portrait
const modes = ["fri-am", "fri-pm", "sat-am", "sat-pm"];
for (const [label, opts] of [["land", ipadL], ["port", ipadP]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  for (const mode of modes) {
    for (const lang of ["en", "ru"]) {
      await page.goto(`${BASE}/checkin?mode=${mode}`);
      await page.evaluate((l) => localStorage.setItem("ck_lang", l), lang);
      await page.reload();
      await page.waitForSelector(".ck-card");
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${OUT}/kiosk-${mode}-${lang}-${label}.png` });
      // the Check in button (last thing on the form) must be on screen without scrolling
      const fits = await page.evaluate(() => { const b = document.querySelector(".ck-go").getBoundingClientRect(); return b.bottom <= window.innerHeight; });
      check(fits, `${mode} ${lang} ${label}: fits without scrolling`);
      const mealCount = await page.locator(".ck-meal").count();
      const expected = { "fri-am": 5, "fri-pm": 3, "sat-am": 3, "sat-pm": 0 }[mode];
      check(mealCount === expected, `${mode} ${lang} ${label}: ${mealCount} meal cards`);
      const yn = await page.locator(".ck-yn").count();
      check(yn === (mode.startsWith("fri") ? 1 : 0), `${mode} ${label}: overnight question ${yn ? "shown" : "hidden"}`);
      const toggleBox = await page.locator(".ck-lang").boundingBox();
      check(toggleBox && toggleBox.x + toggleBox.width > opts.viewport.width - 40 && toggleBox.y < 30, `${mode} ${lang} ${label}: EN/RU toggle top right`);
    }
  }
  await ctx.close();
}

// 2. flow: submit, welcome, auto reset, duplicate, update, offline queue
const ctx = await browser.newContext(ipadL);
const page = await ctx.newPage();
const phone = "828" + String(Math.floor(1000000 + Math.random() * 8999999));
await page.goto(`${BASE}/checkin?mode=fri-am`);
await page.waitForSelector(".ck-card");
await fill(page, { name: "Anna Petrova", phone, party: 3, overnight: true, meals: [1, 3, 4] });
check((await page.inputValue('input[type="tel"]')).startsWith("(828) "), "phone is formatted while typing");
await page.screenshot({ path: `${OUT}/kiosk-fri-am-filled-en.png` });
await page.click(".ck-go");
await page.waitForSelector(".ck-hero");
check((await page.textContent(".ck-hero")) === "Welcome!", "welcome screen");
await page.waitForTimeout(400);
check(await page.evaluate(() => document.querySelector(".ck-go").getBoundingClientRect().bottom <= window.innerHeight), "welcome screen fits on the iPad");
await page.screenshot({ path: `${OUT}/kiosk-welcome-en.png` });
await page.click(".ck-lang button:nth-child(2)");
check((await page.textContent(".ck-hero")) === "Добро пожаловать!", "language toggle flips the welcome screen instantly");
await page.waitForTimeout(300);
check(await page.evaluate(() => document.querySelector(".ck-go").getBoundingClientRect().bottom <= window.innerHeight), "russian welcome screen fits on the iPad");
await page.screenshot({ path: `${OUT}/kiosk-welcome-ru.png` });
await page.waitForSelector(".ck-card:not(.ck-center)", { timeout: 14000 });
check(true, "auto-reset to blank form after ~8s");
check((await page.inputValue('input[type="tel"]')) === "", "form is blank after reset");
await page.click(".ck-lang button:nth-child(1)");

// duplicate
await fill(page, { name: "Anna P", phone, party: 1, overnight: false });
await page.click(".ck-go");
await page.waitForSelector(".ck-hero.small");
check((await page.textContent(".ck-hero")).includes("already"), "duplicate phone shows already checked in");
await page.screenshot({ path: `${OUT}/kiosk-already-en.png` });
await page.click(".ck-go");
await page.waitForSelector(".ck-note");
await page.click(".ck-go");
await page.waitForSelector(".ck-hero");
check((await page.textContent(".ck-hero")) === "Updated!", "update flow works");
await page.waitForSelector(".ck-card:not(.ck-center)", { timeout: 14000 });

// bad phone / validation
await page.fill('input[type="text"], input:not([type])', "Bob");
await page.fill('input[type="tel"]', "555");
await page.click(".ck-go");
check(await page.locator(".ck-hint").innerText().then((t) => t.length > 0), "validation hint shown");
await page.screenshot({ path: `${OUT}/kiosk-validation-en.png` });

// schedule
await page.click(".ck-sched-btn");
await page.waitForSelector(".ck-sheet");
await page.screenshot({ path: `${OUT}/kiosk-schedule-en.png` });
await page.click(".ck-lang button:nth-child(2)");
await page.screenshot({ path: `${OUT}/kiosk-schedule-ru.png` });
await page.click(".ck-close");
await page.click(".ck-lang button:nth-child(1)");

// offline: queue then flush
await page.goto(`${BASE}/checkin?mode=sat-pm`);
await page.waitForSelector(".ck-card");
await ctx.setOffline(true);
await page.waitForTimeout(300);
const phone2 = "828" + String(Math.floor(1000000 + Math.random() * 8999999));
await page.fill('input[type="text"], input:not([type])', "Offline Olga");
await page.fill('input[type="tel"]', phone2);
await page.click(".ck-go");
await page.waitForSelector(".ck-hero");
check(await page.locator(".ck-banner").count().then((n) => n > 0), "offline banner shown");
check((await page.evaluate(() => JSON.parse(localStorage.getItem("ck_queue_v1") || "[]").length)) === 1, "submission queued locally");
await page.screenshot({ path: `${OUT}/kiosk-offline-en.png` });
await ctx.setOffline(false);
await page.waitForFunction(() => JSON.parse(localStorage.getItem("ck_queue_v1") || "[]").length === 0, null, { timeout: 25000 });
check(true, "queue flushed automatically when back online");
await ctx.close();

// 3. staff
const sctx = await browser.newContext(ipadL);
const sp = await sctx.newPage();
const anon = await sp.request.get(`${BASE}/api/checkin/staff/records`);
check(anon.status() === 401, "records API is closed without login");
check((await sp.request.get(`${BASE}/api/checkin/staff/export`)).status() === 401, "CSV export is closed without login");
await sp.goto(`${BASE}/checkin/staff`);
await sp.screenshot({ path: `${OUT}/staff-login.png` });
await sp.fill('input[type="password"]', "wrong-pin");
await sp.click(".ck-go");
await sp.waitForSelector(".ck-hint");
await sp.fill('input[type="password"]', PIN);
await sp.click(".ck-go");
await sp.waitForSelector(".st-stats");
await sp.waitForSelector(".st-list li:not(.st-empty)");
await sp.waitForTimeout(500);
await sp.screenshot({ path: `${OUT}/staff-desktop.png`, fullPage: true });
const stats = await (await sp.request.get(`${BASE}/api/checkin/staff/records`)).json();
const anna = stats.records.find((r) => r.phone === phone);
check(anna && anna.party === 1 && anna.overnight === false, "update replaced the earlier record (one record per phone)");
check(stats.records.filter((r) => r.phone === phone).length === 1, "no duplicate record");
// mode switch from staff
await sp.click(".st-modes button:nth-child(3)");
await sp.waitForTimeout(400);
check((await (await sp.request.get(`${BASE}/api/checkin/mode`)).json()).mode === "sat-am", "staff mode switch is stored server-side");
// search, edit, delete, undo, csv
await sp.fill(".st-search", phone.slice(-4));
check((await sp.locator(".st-list li").count()) >= 1, "search by phone digits");
await sp.click(".st-row-btns button:nth-child(1)");
await sp.waitForSelector(".st-modal");
await sp.click(".st-modal .ck-stepper button:last-child");
await sp.click(".st-btn.primary");
await sp.waitForSelector(".st-undo");
await sp.waitForTimeout(300);
const afterEdit = (await (await sp.request.get(`${BASE}/api/checkin/staff/records`)).json()).records.find((r) => r.phone === phone);
check(afterEdit.party === 2, "staff edit saved");
await sp.click(".st-undo button");
await sp.waitForTimeout(500);
check((await (await sp.request.get(`${BASE}/api/checkin/staff/records`)).json()).records.find((r) => r.phone === phone).party === 1, "undo edit");
await sp.click(".st-row-btns button:nth-child(2)");
await sp.waitForTimeout(500);
check(!(await (await sp.request.get(`${BASE}/api/checkin/staff/records`)).json()).records.some((r) => r.phone === phone), "staff delete");
await sp.click(".st-undo button");
await sp.waitForTimeout(500);
check((await (await sp.request.get(`${BASE}/api/checkin/staff/records`)).json()).records.some((r) => r.phone === phone), "undo delete restores the record");
const csv = await (await sp.request.get(`${BASE}/api/checkin/staff/export`)).text();
check(csv.includes("Anna") && csv.includes("Name,People,Phone"), "CSV export");
// phone-sized staff page
const mctx = await browser.newContext({ ...devices["iPhone 14"] });
const mp = await mctx.newPage();
await mp.goto(`${BASE}/checkin/staff`);
// reuse the session cookie
await mctx.addCookies(await sctx.cookies());
await mp.goto(`${BASE}/checkin/staff`);
await mp.waitForSelector(".st-stats");
await mp.waitForTimeout(500);
await mp.screenshot({ path: `${OUT}/staff-phone.png`, fullPage: true });
check(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "staff page has no sideways scroll on a phone");

// meal head counts come from people, not forms
const s2 = (await (await sp.request.get(`${BASE}/api/checkin/staff/records`)).json()).stats;
check(typeof s2.people === "number" && s2.people >= 1, `stats present (people ${s2.people}, parties ${s2.parties})`);
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nALL PASSED");
process.exit(fails ? 1 : 0);
