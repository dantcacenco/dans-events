// End-to-end check of the couple music picker. Run with the dev server up:
//   npx next dev -p 3055 & node tests/setlist-e2e.mjs [chromium|webkit]
// Screenshots (EN and RU, every screen) go to $SHOTS (default /tmp/setlist-shots).
import { chromium, webkit, devices } from "playwright";
import fs from "fs";
import { audit } from "./setlist-audit.mjs";
import { makeCouple, removeCouple, songsIn, stylesOf } from "./setlist-helpers.mjs";

const BASE = process.env.BASE || "http://localhost:3055";
const SHOTS = process.env.SHOTS || "/tmp/setlist-shots";
const engine = process.argv[2] === "webkit" ? webkit : chromium;
const made = [await makeCouple(["Anna", "Mike"])];
const TOKEN = made[0].token;
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
const nRec = stylesOf("reception").length;
ok((await page.locator(".sl-style").count()) === nRec, `${nRec} reception style cards`);
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
const N = ["pop", "latin", "ru-folk"].reduce((n, st) => n + songsIn(st, true).length, 0);
ok(p1 === `1 / ${N}`, `clean-only deck = the clean pop + latin + Russian folk songs = ${N} (${p1})`);
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
ok(((await progress()) === `2 / ${N}`), "Like moves to song 2");
a = await audio();
ok(a && !a.paused, `next clip started playing on its own (${a?.src})`);
// skip
await page.locator(".sl-act--skip").click();
ok(((await progress()) === `3 / ${N}`), "Skip moves to song 3");
// must play
const titleMust = await page.locator(".sl-title").innerText();
await page.locator(".sl-act--love").click();
ok(((await progress()) === `4 / ${N}`), "Must play moves to song 4");
// undo twice
await page.locator(".sl-undo").click();
ok(((await progress()) === `3 / ${N}`) && (await page.locator(".sl-title").innerText()) === titleMust, "Undo returns to the must-play card");
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
ok(((await progress()) === `5 / ${N}`), "dragging the card right = Like");
// drag left = skip
const b2 = await page.locator(".sl-card-art").boundingBox();
await page.mouse.move(b2.x + b2.width / 2, b2.y + 120);
await page.mouse.down();
await page.mouse.move(b2.x + b2.width / 2 - 170, b2.y + 125, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(300);
ok(((await progress()) === `6 / ${N}`), "dragging the card left = Skip");

// reload mid-swipe resumes at the same card
await page.reload();
await page.waitForSelector(".sl-card");
ok(((await progress()) === `6 / ${N}`), "refresh resumes at song 6 (progress saved)");
ok(await page.locator(".sl-playhint", { hasText: "Tap to play" }).count() === 1, "after refresh the card asks for one tap to play (iOS rule)");

// finish the deck liking everything
for (let i = 6; i <= N; i++) { await page.locator(".sl-act--like").click(); }
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
await page.getByText("Sent. Thank you!").waitFor({ timeout: 8000 }).catch(() => {});
ok(await page.getByRole("button", { name: /Sent. Thank you!/ }).count() === 1, "Send-to-Dan saves the submission");

// ---- Mike picks separately, then the match view ----
await page.getByRole("button", { name: "Who's picking?" }).click();
await page.locator(".sl-who button", { hasText: "Mike" }).click();
await card("Pop hits").click();
await card("R&B & hip-hop").click();
await page.locator(".sl-clean").click(); // clean off for Mike
await page.locator(".sl-cta").click();
await page.waitForSelector(".sl-card");
const mikeTotal = Number((await progress()).match(/\/ (\d+)/)[1]);
const wantMike = songsIn("pop", false).length + songsIn("hiphop", false).length;
ok(mikeTotal === wantMike, `Mike with clean-only OFF gets every pop + hip-hop song = ${wantMike} (${mikeTotal})`);
for (let i = 0; i < mikeTotal; i++) { await page.locator(i % 3 === 2 ? ".sl-act--skip" : ".sl-act--like").click(); }
await page.waitForSelector(".sl-tabs");
await shot("11-results-both");
const tabs = await page.locator(".sl-tabs button").allInnerTexts();
ok(tabs.length === 4 && /Both loved/.test(tabs[0]) && /Master list/.test(tabs[3]), `results has Both / Anna / Mike / Master list tabs (${tabs.join(" | ")})`);
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
const nCer = stylesOf("ceremony").length;
ok((await page.locator(".sl-style").count()) === nCer, `${nCer} ceremony style cards`);
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
  const ru = await makeCouple(["Аня", "Миша"], "ru");
  made.push(ru);
  await pg.goto(`${BASE}/songs/${ru.token}`);
  await pg.waitForSelector(".sl-big");
  ok((await pg.locator("html, .sl").first().evaluate(() => document.querySelector(".sl")?.getAttribute("lang"))) === "ru", "a couple created in Russian opens in Russian");
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
  for (let i = 0; i < 200 && !(await pg.locator(".sl-results").count()); i++) await pg.locator(".sl-act--like").click({ timeout: 2000 }).catch(() => {});
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
  const fresh = await makeCouple(["Anna", "Mike"]);
  made.push(fresh);
  await pg.goto(`${BASE}/songs/${fresh.token}`);
  await pg.waitForSelector(".sl-big");
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

for (const c of made) await removeCouple(c.token);
ok((await fetch(`${BASE}/songs/${TOKEN}`)).status === 404, "a deleted couple's link is a 404");

console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "no console errors");
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
await browser.close();
process.exit(failures ? 1 : 0);
