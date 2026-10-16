// End-to-end check of the guest link and the master list: one couple and three guests on separate phones.
//   npx next dev -p 3055 & node tests/setlist-guests.mjs [chromium|webkit]
// Screenshots go to $SHOTS (default /tmp/setlist-guest-shots).
import { chromium, webkit, devices } from "playwright";
import fs from "fs";
import { audit } from "./setlist-audit.mjs";
import { coupleDetail, makeCouple, removeCouple, stylesOf } from "./setlist-helpers.mjs";

const BASE = process.env.BASE || "http://localhost:3055";
const SHOTS = process.env.SHOTS || "/tmp/setlist-guest-shots";
const engine = process.argv[2] === "webkit" ? webkit : chromium;
const rnd = () => Math.random().toString(36).slice(2, 12).padEnd(10, "x");
const made = [await makeCouple(["Anna", "Mike"])];
const TOKEN = made[0].token;
fs.mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) failures++; };
const errors = [];
const browser = await engine.launch();
const phone = () => browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: Number(process.env.HEIGHT || 844) }, acceptDownloads: true });

async function open(url) {
  const ctx = await phone();
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url);
  const shot = async (n) => { await page.waitForTimeout(350); await page.screenshot({ path: `${SHOTS}/${n}.png`, style: "nextjs-portal{display:none!important}" }); };
  const aud = async (label) => { const r = await audit(page, label); ok(r.fails.length === 0, `contrast AA + min size, ${label} (${r.n} text boxes)${r.fails.length ? "\n      " + r.fails.join("\n      ") : ""}`); };
  return { ctx, page, shot, aud };
}
const card = (page, n) => page.locator(`.sl-style:has(.name:text-is("${n}"))`);
const likeAll = async (page, stop = ".sl-results, .sl-thanks") => {
  for (let i = 0; i < 60 && !(await page.locator(stop).count()); i++) await page.locator(".sl-act--like").click({ timeout: 2000 }).catch(() => {});
};

// ---------- the couple: Anna picks, marks one song never play and one must play ----------
const couple = await open(`${BASE}/songs/${TOKEN}`);
{
  const { page } = couple;
  await page.waitForSelector(".sl-big");
  await page.locator(".sl-big--reception").click();
  await page.locator(".sl-who button", { hasText: "Anna" }).click();
  for (const n of ["Pop hits", "Latin"]) await card(page, n).click();
  await page.locator(".sl-sticky .sl-cta").click();
  await page.waitForSelector(".sl-card");
  await likeAll(page, ".sl-results");
  await page.waitForSelector(".sl-results");
  ok(true, "couple finished Anna's reception picks");
}
const rows = (page, sel = ".sl-row") => page.locator(sel).evaluateAll((els) => els.map((e) => ({ title: e.querySelector("b")?.textContent, badge: e.querySelector(".sl-badge")?.textContent, cls: e.className })));

// Mark the second approved song as never play, the first as must play (on Anna's own tab)
const neverTitle = await couple.page.locator(".sl-sec--liked ~ .sl-group .sl-row b").nth(1).innerText();
await couple.page.locator(".sl-sec--liked ~ .sl-group .sl-row", { hasText: neverTitle }).locator(".x").click();
const mustTitle = await couple.page.locator(".sl-sec--liked ~ .sl-group .sl-row b").first().innerText();
await couple.page.locator(".sl-sec--liked ~ .sl-group .sl-row", { hasText: mustTitle }).locator(".flag").click();

// ---------- invite link ----------
await couple.page.locator(".sl-invite").click();
await couple.page.waitForSelector(".sl-invite-msg:has-text('/songs/g/')");
await couple.shot("g01-invite-sheet");
await couple.aud("invite sheet");
const msg = await couple.page.locator(".sl-invite-msg").innerText();
const guestUrl = msg.match(/https?:\/\/\S+\/songs\/g\/[a-z0-9]+/)[0];
ok(!guestUrl.includes(TOKEN), "guest link does not contain the couple's private token");
await couple.page.locator("dialog .sl-lang button", { hasText: "RU" }).click();
ok(/Помогите нам выбрать музыку/.test(await couple.page.locator(".sl-invite-msg").innerText()), "invite message is offered in Russian too");
await couple.shot("g02-invite-sheet-ru");
await couple.page.getByRole("button", { name: /Copy link/ }).click();
await couple.page.keyboard.press("Escape");
const again = await couple.page.evaluate(async (token) => (await (await fetch("/api/songs/guest-link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) })).json()).guestToken, TOKEN);
ok(guestUrl.endsWith(again), "asking again returns the same guest link");
ok((await (await fetch(`${BASE}/songs/g/${TOKEN}`)).status) === 404, "the couple's private token does not open a guest page");
ok((await (await fetch(`${BASE}/songs/g/zzzzzzzzzzzzzzzz`)).status) === 404, "an unknown guest link is a 404");

// ---------- guest 1: Olga, full flow, adds a song while swiping ----------
const g1 = await open(guestUrl);
{
  const { page, shot, aud } = g1;
  await page.waitForSelector(".sl-welcome");
  await shot("g03-guest-welcome");
  await aud("guest welcome");
  ok(await page.locator(".sl-welcome h1", { hasText: "Anna & Mike" }).count() === 1, "welcome shows the couple's names");
  await page.locator(".sl-welcome .sl-input").fill("Olga");
  await page.locator(".sl-sticky .sl-cta").click();
  await page.waitForSelector(".sl-grid");
  ok((await page.locator(".sl-style").count()) === stylesOf("reception").length, "guest sees the same reception genre cards as the couple");
  ok((await page.locator(".sl-clean").getAttribute("aria-pressed")) === "true", "guest: clean-only is ON by default");
  for (const n of ["Pop hits", "80s & 90s", "Classic rock & Motown"]) await card(page, n).click();
  await shot("g04-guest-genres");
  await aud("guest genres");
  await page.locator(".sl-sticky .sl-cta").click();
  await page.waitForSelector(".sl-card");
  ok(await page.locator(".sl-act--love").count() === 0, "guest cards have Like and Skip only (no must-play star)");
  ok(await page.locator(".sl-finish").count() === 0, "Finish is not offered before a few songs are answered");
  await page.locator(".sl-add").click();
  await page.waitForSelector("dialog[open] .sl-input");
  await page.locator("dialog .sl-input").first().fill("Mamma Mia");
  await page.locator("dialog .sl-input").nth(1).fill("ABBA");
  await shot("g05-add-song-step");
  await page.locator("dialog .sl-cta").click();
  await aud("add-a-song step");
  ok(await page.locator("dialog .sl-added li").count() === 1, "the added song is listed in the dialog");
  await page.getByRole("button", { name: "Done" }).click();
  await page.waitForSelector(".sl-card");
  await page.waitForTimeout(300);
  await shot("g06-guest-swipe");
  await aud("guest song card");
  for (let i = 0; i < 9; i++) await page.locator(i % 4 === 3 ? ".sl-act--skip" : ".sl-act--like").click();
  ok(await page.locator(".sl-finish").count() === 1, "Finish appears after eight songs");
  await page.locator(".sl-finish").click();
  await page.waitForSelector(".sl-thanks .sl-row");
  await page.waitForSelector(".sl-sec--extras");
  await shot("g07-guest-thanks");
  await aud("guest thanks + live master list");
  const t = await rows(page);
  ok(t.length > 5 && t.every((r) => /^\d+$/.test(r.badge)), `thanks screen lists songs with counters (${t.length} rows)`);
  ok(!t.some((r) => r.title === neverTitle), "the couple's never-play song is not shown to guests");
  ok(!(await page.locator(".sl-thanks .sl-ic.x, .sl-thanks .sl-ic.flag").count()), "guest view is read-only (no star / remove buttons)");
  ok(!(await page.locator(".sl-thanks").innerText()).match(/Olga/), "guests never see names");
}

// ---------- guest 2: no name, Russian, suggests the same song with different spelling at the end ----------
const g2 = await open(guestUrl);
{
  const { page, shot, aud } = g2;
  await page.waitForSelector(".sl-welcome");
  await page.getByRole("button", { name: "RU", exact: true }).click();
  await shot("g08-guest-welcome-ru");
  await aud("guest welcome RU");
  await page.locator(".sl-sticky .sl-cta").click(); // skipping the name
  await page.waitForSelector(".sl-grid");
  for (const n of ["Поп-хиты", "Латино"]) await card(page, n).click();
  await shot("g09-guest-genres-ru");
  await page.locator(".sl-sticky .sl-cta").click();
  await page.waitForSelector(".sl-card");
  await shot("g10-guest-swipe-ru");
  await aud("guest song card RU");
  await likeAll(page, ".sl-thanks");
  await page.waitForSelector(".sl-thanks");
  await page.locator(".sl-thanks .sl-link", { hasText: "Добавить свою песню" }).click();
  await page.locator("dialog .sl-input").first().fill("  mamma  MIA!! ");
  await page.locator("dialog .sl-input").nth(1).fill("abba");
  await page.locator("dialog .sl-cta").click();
  await page.getByRole("button", { name: "Готово" }).click();
  await page.waitForSelector(".sl-thanks .sl-sec--extras");
  await page.waitForTimeout(600);
  await shot("g11-guest-thanks-ru");
  await aud("guest thanks RU");
}

// ---------- guest 3: suggests a new song, likes some of the same ones ----------
const g3 = await open(guestUrl);
{
  const { page } = g3;
  await page.waitForSelector(".sl-welcome");
  await page.locator(".sl-welcome .sl-input").fill("Sam");
  await page.locator(".sl-sticky .sl-cta").click();
  await card(page, "Pop hits").click();
  await page.locator(".sl-sticky .sl-cta").click();
  await page.waitForSelector(".sl-card");
  await page.locator(".sl-add").click();
  // one that is really in the catalog (counts as a like on that song) and one that is new
  await page.locator("dialog .sl-input").first().fill("Livin' on a Prayer");
  await page.locator("dialog .sl-input").nth(1).fill("Bon Jovi");
  await page.locator("dialog .sl-cta").click();
  await page.locator("dialog .sl-input").first().fill("Wonderwall");
  await page.locator("dialog .sl-input").nth(1).fill("Oasis");
  await page.locator("dialog .sl-cta").click();
  await page.keyboard.press("Escape");
  await likeAll(page, ".sl-thanks");
  await page.waitForSelector(".sl-thanks .sl-row:has-text('Wonderwall')");
  ok(true, "guest 3 finished; the live list on their thank-you screen already shows their own new song");
}

// ---------- the couple looks at the master list ----------
await couple.page.reload();
await couple.page.waitForSelector(".sl-results");
await couple.page.getByRole("button", { name: /Master list/ }).click();
await couple.page.waitForSelector(".sl-master .sl-row");
await couple.page.waitForSelector(".sl-sec--extras");
await couple.page.waitForTimeout(500);
{
  const { page, shot, aud } = couple;
  ok(/3 guests answered/.test(await page.locator(".sl-guests").innerText()), "master list says 3 guests answered");
  const all = await rows(page);
  const extras = await page.locator(".sl-sec--extras ~ .sl-row").evaluateAll((els) => els.map((e) => ({ title: e.querySelector("b")?.textContent, artist: e.querySelector(".t span")?.textContent, badge: e.querySelector(".sl-badge")?.textContent })));
  if (extras.length !== 2) console.log("DEBUG rows:", JSON.stringify(all), JSON.stringify(await page.locator(".sl-master").innerHTML()).slice(-1500));
  ok(extras.length === 2, `two guest-chosen songs (${extras.map((e) => `${e.title} x${e.badge}`).join(", ")})`);
  ok(extras[0].title === "Mamma Mia" && extras[0].badge === "2", "the same extra suggested by two guests (different spelling) is merged: Mamma Mia, counter 2");
  ok(extras[1].title === "Wonderwall" && extras[1].badge === "1", "the new extra counts once and is ranked below");
  ok(!extras.some((e) => /Livin/.test(e.title)) && (await rows(page)).some((r) => /Livin/.test(r.title) && Number(r.badge) >= 1), "a suggestion that is already in the catalog counts on that catalog song instead");
  const songs = all.slice(0, all.length - extras.length);
  ok(!songs.some((r) => r.title === neverTitle), "never-play song is excluded from the master list");
  ok(songs[0].title === mustTitle && songs[0].cls.includes("must"), "must-play song is pinned on top of the first section");
  const counts = songs.slice(1).map((r) => Number(r.badge));
  ok(counts.every((n, i) => i === 0 || counts[i - 1] >= n), `catalog songs are ranked by count (${counts.slice(0, 8).join(",")}…)`);
  const popTop = songs.find((r) => !r.cls.includes("must"));
  ok(Number(popTop.badge) >= 3, `top song counts the partner and guests together (${popTop.title}: ${popTop.badge})`);
  await shot("g12-master-top");
  await aud("master list, top");
  await page.locator(".sl-sec--extras").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await shot("g13-master-both-sections");
  await aud("master list, guest-chosen section");
  // exports carry the count and category columns
  const [csv] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Download CSV/ }).click()]);
  const csvText = fs.readFileSync(await csv.path(), "utf8");
  fs.writeFileSync(`${SHOTS}/master-list.csv`, csvText);
  ok(csvText.includes("People who chose it") && csvText.includes("Songs chosen by guests") && csvText.includes("Mamma Mia"), `master CSV has count + category columns (${csv.suggestedFilename()})`);
  const [txt] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Download text/ }).click()]);
  const txtText = fs.readFileSync(await txt.path(), "utf8");
  fs.writeFileSync(`${SHOTS}/master-list.txt`, txtText);
  ok(txtText.startsWith("MASTER LIST") && txtText.includes("SONGS CHOSEN BY GUESTS") && /Mamma Mia \(2\)/.test(txtText), "master text export lists both sections with counts");
  // removing a guest-added song hides it and can be restored
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(".sl-sec--extras ~ .sl-row", { hasText: "Wonderwall" }).locator(".x").click();
  ok((await page.locator(".sl-sec--extras ~ .sl-row").count()) === 1, "couple can remove a guest-chosen song");
  await page.getByRole("button", { name: /Show removed \(1\)/ }).click();
  ok((await page.locator(".sl-sec--extras ~ .sl-row").count()) === 2, "and bring it back");
}

// ---------- the server has it all: a second phone and Dan's admin page see the same picks ----------
{
  const st = await (await fetch(`${BASE}/api/songs/state?token=${TOKEN}`)).json();
  const a = st.state?.flows?.reception?.people?.a;
  ok(a && Object.keys(a.answers).length > 0, `Anna's picks are saved on the server (${a ? Object.keys(a.answers).length : 0} answers)`);
  const phone2 = await open(`${BASE}/songs/${TOKEN}`);
  await phone2.page.locator(".sl-big--reception").click();
  await phone2.page.waitForSelector(".sl-who");
  await phone2.page.waitForTimeout(800);
  const st2 = await phone2.page.evaluate((t) => JSON.parse(localStorage.getItem(`setlist:${t}`) || "{}"), TOKEN);
  ok(Object.keys(st2.flows?.reception?.people?.a?.answers ?? {}).length === Object.keys(a?.answers ?? {}).length, "a second phone on the couple link gets Anna's picks from the server");
  await phone2.ctx.close();
  const d = await coupleDetail(TOKEN);
  ok(d && d.couple.stats.guests >= 3, `admin sees the guests' answers (${d?.couple.stats.guests})`);
  ok(d && d.flows.reception.people.some((p) => p.pid === "a" && p.liked.length > 0), "admin sees Anna's likes");
  ok(d && d.master.songs.length > 0 && d.master.songs[0].count >= d.master.songs.at(-1).count, "admin master list is ranked by count");
}

// ---------- abuse protection and privacy (API level) ----------
const api = async (path, body, method = "POST") => {
  const r = await fetch(`${BASE}${path}`, { method, headers: { "content-type": "application/json" }, body: body && JSON.stringify(body) });
  return { status: r.status, json: await r.json().catch(() => null) };
};
const gt = guestUrl.split("/").pop();
const before = (await api(`/api/songs/master?guestToken=${gt}`, undefined, "GET")).json.master;
for (let i = 0; i < 3; i++) await api("/api/songs/guest", { guestToken: gt, sessionId: "dupe" + rnd(), name: "x", likes: [], skips: [], extras: [] });
const dupId = "dupe" + rnd();
const vote = { guestToken: gt, sessionId: dupId, name: "Dup", likes: ["pop-1", "pop-1", "pop-1", "nope"], skips: [], extras: [{ title: "Same Song", artist: "X" }, { title: "same   song", artist: "x" }] };
await api("/api/songs/guest", vote);
await api("/api/songs/guest", vote);
await api("/api/songs/guest", vote);
const after = (await api(`/api/songs/master?guestToken=${gt}`, undefined, "GET")).json.master;
ok(after.guests === before.guests + 1, `the same session sent three times counts once (${before.guests} -> ${after.guests} guests)`);
ok((after.guestLikes["pop-1"] ?? 0) === (before.guestLikes["pop-1"] ?? 0) + 1, "a repeated or unknown song id in one vote counts once");
ok(after.extras.find((e) => e.key.startsWith("same song"))?.count === 1, "one guest suggesting the same song twice counts once");
const txt = JSON.stringify(after);
ok(!/never|notes|must|marks/i.test(txt), "what guests can read has counts only: no never-play, must-play or notes");
ok((await api("/api/songs/guest", { guestToken: "x".repeat(20), sessionId: "abcdefghij", likes: ["pop-1"] })).status === 404, "a made-up guest token is rejected");
ok((await api("/api/songs/guest", { guestToken: gt, sessionId: "bad id!", likes: [] })).status === 400, "a malformed session id is rejected");
made.push(await makeCouple(["Other", "Couple"]));
const link2 = (await api("/api/songs/guest-link", { token: made[1].token })).json.guestToken;
let limited = 0;
for (let i = 0; i < 14; i++) if ((await api("/api/songs/guest", { guestToken: link2, sessionId: "dev" + i + rnd(), likes: ["pop-1"], skips: [], extras: [] })).status === 429) limited++;
ok(limited >= 3, `one device cannot open more than 10 sessions a day (${limited} of 14 were refused)`);

for (const c of made) await removeCouple(c.token);
ok((await fetch(`${BASE}/songs/g/${gt}`)).status === 404, "a deleted couple's guest link is a 404");

console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "no console errors");
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
await browser.close();
process.exit(failures ? 1 : 0);
