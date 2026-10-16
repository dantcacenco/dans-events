// End-to-end check of Dan's admin page (/admin/songs): login, couples list, couple detail, library, exports.
//   SETLIST_ADMIN_PASSWORD=... npx next dev -p 3055 &   (the dev server needs the same password)
//   SETLIST_ADMIN_PASSWORD=... node tests/setlist-admin.mjs [chromium|webkit]
// Screenshots go to $SHOTS (default /tmp/setlist-admin-shots). Exit code 1 if anything fails.
import { chromium, webkit, devices } from "playwright";
import fs from "fs";
import { audit } from "./setlist-audit.mjs";

const BASE = process.env.BASE || "http://localhost:3055";
const SHOTS = process.env.SHOTS || "/tmp/setlist-admin-shots";
const PASSWORD = process.env.SETLIST_ADMIN_PASSWORD;
const engineName = process.argv[2] === "webkit" ? "webkit" : "chromium";
const engine = engineName === "webkit" ? webkit : chromium;
if (!PASSWORD) {
  console.error("Set SETLIST_ADMIN_PASSWORD (same value the dev server uses).");
  process.exit(2);
}
fs.mkdirSync(SHOTS, { recursive: true });

const rnd = () => Math.random().toString(36).slice(2, 8);
const NAMES = [`Zed${rnd()}`, `Quinn${rnd()}`];
const COUPLE = `${NAMES[0]} & ${NAMES[1]}`;
const slug = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
const songs = JSON.parse(fs.readFileSync(new URL("../src/data/setlist-songs.json", import.meta.url), "utf8")).songs;
const [S1, S2, S3, S4, S5] = songs.filter((s) => s.flow === "reception");

let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) failures++; };
const errors = [];
// Run one check; a thrown error (timeout, missing element) is a failure but the run goes on.
async function step(name, fn) {
  try { await fn(); } catch (e) { ok(false, `${name}: ${String(e.message).split("\n")[0]}`); }
}

const browser = await engine.launch();
const watch = (page) => {
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
};
const shotOf = (page, prefix) => async (name, full = true) => {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/${prefix}-${name}.png`, fullPage: full, style: "nextjs-portal{display:none!important}" });
};
const aud = async (page, label) => {
  const r = await audit(page, label);
  ok(r.fails.length === 0, `contrast AA + min size, ${label} (${r.n} text boxes)${r.fails.length ? "\n      " + r.fails.slice(0, 6).join("\n      ") : ""}`);
};
// Every control is at least 44px tall; the page does not scroll sideways.
const layout = async (page, label) => {
  const r = await page.evaluate(() => {
    const small = [...document.querySelectorAll(".ad button, .ad summary, .ad input:not([type=hidden]), .ad select, .ad a.ad-btn, .ad a.ad-card, .ad .ad-link")]
      .filter((e) => e.getClientRects().length && !e.closest(".ad-label--hidden") && getComputedStyle(e).visibility !== "hidden")
      .filter((e) => e.getBoundingClientRect().height < 43.5)
      .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0]} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 20)}" ${Math.round(e.getBoundingClientRect().height)}px`);
    return { small, over: document.documentElement.scrollWidth - innerWidth };
  });
  ok(r.small.length === 0, `tap targets 44px+, ${label}${r.small.length ? " -> " + r.small.slice(0, 5).join("; ") : ""}`);
  ok(r.over <= 1, `no sideways scroll, ${label}`);
};

const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, permissions: engineName === "chromium" ? ["clipboard-read", "clipboard-write"] : [] });
const page = await desktop.newPage();
watch(page);
const shot = shotOf(page, "desktop");
const api = (path, init) => page.request.fetch(`${BASE}${path}`, init);
const json = async (path, init) => (await api(path, init)).json();

// ---------- the doors are locked ----------
{
  const r = await fetch(`${BASE}/api/songs/admin/couples`);
  ok(r.status === 401, `GET /api/songs/admin/couples without a session is 401 (got ${r.status})`);
  for (const [m, p] of [["GET", "/api/songs/admin/library"], ["GET", "/api/songs/admin/export"], ["POST", "/api/songs/admin/couples"]]) {
    const x = await fetch(`${BASE}${p}`, { method: m, headers: { "content-type": "application/json" }, body: m === "POST" ? "{}" : undefined });
    ok(x.status === 401, `${m} ${p} without a session is 401 (got ${x.status})`);
  }
  const html = await fetch(`${BASE}/admin/songs`);
  ok(/noindex/.test(html.headers.get("x-robots-tag") || ""), `/admin/songs has X-Robots-Tag noindex (${html.headers.get("x-robots-tag")})`);
  ok(/<meta name="robots" content="[^"]*noindex/.test(await html.text()), "/admin/songs has the noindex meta tag");
}

// ---------- login ----------
await page.goto(`${BASE}/admin/songs`);
await step("login page", async () => {
  await page.waitForSelector("#ad-pw");
  await shot("00-login", false);
  await page.fill("#ad-pw", "definitely-not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForSelector(".ad-error");
  ok(/wrong password/i.test(await page.locator(".ad-error").innerText()), "wrong password shows an error");
  await page.fill("#ad-pw", PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForSelector(".ad-hero");
  ok(true, "right password opens the admin");
});

// ---------- new couple ----------
let token = "", guestToken = "";
await step("new couple", async () => {
  await page.getByRole("button", { name: "New couple" }).click();
  await page.getByLabel("Partner 1").fill(NAMES[0]);
  await page.getByLabel("Partner 2").fill(NAMES[1]);
  await page.getByLabel("Wedding date (optional)").fill("2027-06-12");
  await shot("01-new-couple-form", false);
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForSelector('code[data-link="Couple link"]');
  const couple = (await page.locator('code[data-link="Couple link"]').innerText()).trim();
  const guest = (await page.locator('code[data-link="Guest link"]').innerText()).trim();
  token = couple.split("/songs/")[1];
  guestToken = guest.split("/songs/g/")[1];
  ok(/^[a-z0-9]{12,40}$/.test(token) && /^[a-z0-9]{12,40}$/.test(guestToken) && token !== guestToken, "creating shows both new links");
  const copy = page.locator(".ad-panel .ad-link-row").first().getByRole("button", { name: "Copy" });
  await copy.click();
  await page.waitForFunction(() => /Copied/.test(document.querySelector(".ad-panel .ad-link-row button")?.textContent || ""), null, { timeout: 3000 });
  ok(true, "Copy button confirms 'Copied'");
  if (engineName === "chromium") ok((await page.evaluate(() => navigator.clipboard.readText())) === couple, "the couple link was really copied to the clipboard");
  await shot("02-new-couple-links", false);
});

await step("couple's own page", async () => {
  const p2 = await desktop.newPage();
  const res = await p2.goto(`${BASE}/songs/${token}`);
  ok(res?.status() === 200, `the new couple link opens (${res?.status()})`);
  const g = await p2.goto(`${BASE}/songs/g/${guestToken}`);
  ok(g?.status() === 200, `the new guest link opens (${g?.status()})`);
  await p2.close();
});

// Seed: the couple finishes their reception picks and presses Send; one guest answers.
await step("seed picks", async () => {
  const now = Date.now();
  const flow = { people: { a: { step: "done", styles: [S1.style], cleanOnly: false, deck: [S1.id, S2.id, S3.id, S4.id], index: 4, answers: { [S1.id]: "love", [S2.id]: "like", [S3.id]: "skip", [S4.id]: "like" }, at: now } }, marks: { [S1.id]: "must", [S4.id]: "never" }, notes: "Please no slow songs before 9", sent: true, hidden: [], metaAt: now };
  const empty = { people: {}, marks: {}, notes: "", sent: false, hidden: [] };
  const put = await api("/api/songs/state", { method: "PUT", headers: { "content-type": "application/json" }, data: JSON.stringify({ token, flows: { reception: flow, ceremony: empty } }) });
  ok(put.ok(), "couple picks saved through the public API");
  const sub = await api("/api/songs/submit", { method: "POST", headers: { "content-type": "application/json" }, data: JSON.stringify({ token, flow: "reception" }) });
  ok(sub.ok(), "couple pressed Send");
  const g = await api("/api/songs/guest", { method: "POST", headers: { "content-type": "application/json" }, data: JSON.stringify({ guestToken, sessionId: "adm" + rnd() + rnd(), name: "Olga", likes: [S1.id, S5.id], skips: [S2.id], extras: [{ title: "Zed Anthem", artist: "The Zeds" }] }) });
  ok(g.ok(), "a guest answered");
});

// ---------- list ----------
await step("list", async () => {
  await page.reload();
  await page.waitForSelector(`.ad-card[data-token="${token}"]`);
  const card = page.locator(`.ad-card[data-token="${token}"]`);
  const txt = await card.innerText();
  ok(txt.includes(COUPLE) && /Jun 12, 2027/.test(txt), "card shows the names and the wedding date");
  ok(/Active/.test(txt) && /New submission/.test(txt), "card shows Active + New submission chips");
  ok(/1 done · 1 started/i.test(txt) && /Guest responses/i.test(txt), "card shows partners finished and guest responses");
  ok(/(In progress|Done)\s+Reception/i.test(txt) && /Last activity/.test(txt), "card shows reception progress and last activity");
  await page.getByRole("button", { name: /^Needs review/ }).click();
  ok((await page.locator(`.ad-card[data-token="${token}"]`).count()) === 1, "'Needs review' filter keeps the new submission");
  await page.getByRole("button", { name: "Off", exact: true }).click();
  ok((await page.locator(`.ad-card[data-token="${token}"]`).count()) === 0, "'Off' filter hides an active couple");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByLabel("Search couples by name").fill(NAMES[1].toLowerCase());
  await page.waitForFunction(() => document.querySelectorAll(".ad-card").length === 1, null, { timeout: 3000 }).catch(() => {});
  ok((await page.locator(`.ad-card[data-token="${token}"]`).count()) === 1 && (await page.locator(".ad-card").count()) === 1, "search by a name finds exactly the couple");
  await page.getByLabel("Search couples by name").fill("no-such-couple-zzz");
  await page.waitForFunction(() => document.querySelectorAll(".ad-card").length === 0, null, { timeout: 3000 }).catch(() => {});
  ok((await page.locator(".ad-card").count()) === 0, "search with no match shows none");
  await page.getByLabel("Search couples by name").fill("");
  const csv = await api("/api/songs/admin/export");
  const body = await csv.text();
  ok(csv.status() === 200 && /csv/.test(csv.headers()["content-type"] || "") && body.includes(NAMES[0]), "Export all (CSV) returns a CSV that lists the couple");
  const link = page.getByRole("link", { name: "Export all (CSV)" });
  ok((await link.getAttribute("href")) === "/api/songs/admin/export", "Export all link points at the export");
  await shot("10-list");
  await aud(page, "list (desktop)");
});

// ---------- detail ----------
await step("detail", async () => {
  await page.locator(`.ad-card[data-token="${token}"]`).click();
  await page.waitForSelector(".ad-names");
  ok(page.url().includes(`?c=${token}`), "opening a couple puts ?c=<token> in the URL");
  ok((await page.locator(".ad-names").innerText()).trim() === COUPLE, "hero is the couple's names");
  const links = page.locator("section[aria-label=Links] .ad-link-row");
  ok((await links.count()) === 2 && (await links.getByRole("button", { name: "Copy" }).count()) === 2 && (await links.getByRole("link", { name: /Open/ }).count()) === 2, "both links have Copy and Open");
  ok((await links.nth(0).locator("code").innerText()).endsWith(`/songs/${token}`) && (await links.nth(1).locator("code").innerText()).endsWith(`/songs/g/${guestToken}`), "couple link and guest link are the right ones");

  // reception: partner a is names[0]
  const rec = page.locator("section[data-flow=reception]");
  const rtxt = await rec.innerText();
  ok(rtxt.includes(NAMES[0]) && rtxt.includes(S1.title) && rtxt.includes("★ Loved") && /Pressed Send/.test(rtxt), "reception shows the partner, loved song and that they pressed Send");
  ok(/Must play[\s\S]*Never play[\s\S]*Both loved/.test(rtxt) && rtxt.includes("Please no slow songs before 9"), "must / never / both loved lists and the couple's notes");
  ok(/Not started/.test(await page.locator("section[data-flow=ceremony]").innerText()), "ceremony shows Not started");

  // master list
  const master = page.locator('[data-block="Song list"]');
  ok((await master.locator("li.ad-song b").first().innerText()) === S1.title, "master list ranks the must-play, most-chosen song first");
  ok(/2/.test(await master.locator("li.ad-song .ad-score").first().innerText()), "…with its count (couple + guest = 2)");
  ok((await page.locator('[data-block="Songs chosen by guests"]').innerText()).includes("Zed Anthem"), "songs chosen by guests lists the guest's extra song");
  ok((await page.locator("section[aria-label=Guests]").innerText()).includes("Olga"), "guests section lists the guest by name");

  // song filter
  await page.locator("#ad-find").fill(S1.title.slice(0, 5));
  ok((await master.locator("li.ad-song").count()) >= 1 && (await master.locator("li.ad-song").count()) < (await songs.length), "find-a-song filters the master list");
  await page.locator("#ad-find").fill("");

  // clip player: one shared audio element, preload none
  ok((await page.locator("audio").count()) === 1 && (await page.locator("audio").getAttribute("preload")) === "none", "one shared <audio preload=none>");
  await master.getByRole("button", { name: new RegExp(`Play clip: ${S1.title.replace(/[()]/g, ".")}`) }).first().click();
  await page.waitForFunction(() => document.querySelector("audio")?.dataset.id, null, { timeout: 3000 });
  ok(true, "▶ points the shared player at the clip");
  await page.locator("audio").evaluate((a) => a.pause());
  await shot("20-detail");
  await aud(page, "detail (desktop, top of page)");
});

await step("reviewed", async () => {
  await page.getByRole("button", { name: "Mark reviewed" }).click();
  await page.getByRole("button", { name: "Reviewed ✓" }).waitFor();
  ok(true, "Mark reviewed toggles to Reviewed");
  await page.reload();
  await page.getByRole("button", { name: "Reviewed ✓" }).waitFor();
  ok(true, "Reviewed survives a reload");
});

await step("history", async () => {
  // go back to the list (we came from it with pushState), then forward again
  await page.goto(`${BASE}/admin/songs`);
  await page.waitForSelector(".ad-card");
  await page.locator(`.ad-card[data-token="${token}"]`).click();
  await page.waitForSelector(".ad-names");
  await page.goBack();
  await page.waitForSelector(".ad-hero");
  ok(!page.url().includes("?c="), "browser Back from a couple returns to the list");
  await page.goForward();
  await page.waitForSelector(".ad-names");
  ok(page.url().includes(`?c=${token}`), "browser Forward returns to the couple");
  const gone = await page.locator(`.ad-card[data-token="${token}"]`).count();
  ok(gone === 0, "the list is not shown on the detail screen");
  await page.getByRole("button", { name: "All couples" }).click();
  await page.waitForSelector(".ad-hero");
  ok(!page.url().includes("?c="), "'All couples' returns to the list");
  const rev = await page.locator(`.ad-card[data-token="${token}"]`).innerText();
  ok(/Reviewed/.test(rev) && !/New submission/.test(rev), "list now shows Reviewed instead of New submission");
  await page.locator(`.ad-card[data-token="${token}"]`).click();
  await page.waitForSelector(".ad-names");
});

await step("private notes", async () => {
  const note = `Call Mom at 5 ${rnd()}`;
  await page.locator("#ad-notes").fill(note);
  await page.locator("#ad-notes").blur();
  await page.waitForFunction(() => /Saved/.test(document.querySelector('section[aria-label="Private notes"] .ad-saved')?.textContent || ""), null, { timeout: 4000 });
  ok(true, "notes autosave on blur and show Saved");
  await page.reload();
  await page.waitForSelector("#ad-notes");
  await page.waitForFunction((n) => document.querySelector("#ad-notes")?.value === n, note, { timeout: 4000 });
  ok(true, "private note persists after reload");
});

await step("edit names / date", async () => {
  const other = `${NAMES[1]}x`;
  await page.getByText("Edit names, date, language").click();
  await page.getByLabel("Partner 2").fill(other);
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForFunction((n) => document.querySelector(".ad-names")?.textContent?.includes(n), other, { timeout: 4000 });
  ok(true, "editing a name updates the hero");
  await page.getByLabel("Partner 2").fill(NAMES[1]);
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForFunction((n) => document.querySelector(".ad-names")?.textContent?.trim() === n, COUPLE, { timeout: 4000 });
});

// ---------- exports ----------
await step("exports", async () => {
  const want = slug(`${NAMES[0]} ${NAMES[1]}`);
  for (const [label, ext, probe] of [["Download CSV", "csv", /Rank,Category/], ["Download text", "txt", /MASTER LIST/], ["Download M3U", "m3u", /^#EXTM3U/]]) {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: label }).click()]);
    const path = await dl.path();
    const body = fs.readFileSync(path, "utf8").replace(/^﻿/, "");
    ok(body.length > 20 && probe.test(body) && body.includes(S1.title), `${label} is a non-empty ${ext} with the songs (${body.length} bytes)`);
    ok(dl.suggestedFilename().startsWith(want) && dl.suggestedFilename().endsWith(`.${ext}`), `${label} file is named after the couple (${dl.suggestedFilename()})`);
  }
  const copy = page.getByRole("button", { name: "Copy text" });
  await copy.click();
  await page.waitForFunction(() => [...document.querySelectorAll("button")].some((b) => b.textContent === "Copied"), null, { timeout: 3000 });
  ok(true, "Copy text confirms 'Copied'");
  if (engineName === "chromium") ok(/MASTER LIST/.test(await page.evaluate(() => navigator.clipboard.readText())), "copied text is the master list");
});

// ---------- the same screens on a phone ----------
const phoneCtx = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: 844 }, storageState: await desktop.storageState() });
const phone = await phoneCtx.newPage();
watch(phone);
const pshot = shotOf(phone, "mobile");
await step("phone screens", async () => {
  await phone.goto(`${BASE}/admin/songs`);
  await phone.waitForSelector(".ad-card");
  await pshot("10-list");
  await aud(phone, "list (390px)");
  await layout(phone, "list (390px)");
  await phone.locator(`.ad-card[data-token="${token}"]`).click();
  await phone.waitForSelector(".ad-names");
  await pshot("20-detail");
  await phone.evaluate(() => window.scrollTo(0, 0));
  await aud(phone, "detail (390px, top of page)");
  await layout(phone, "detail (390px)");
  await phone.getByRole("button", { name: "Library" }).click();
  await phone.waitForSelector(".ad-lib-row");
  await pshot("30-library", false);
  await aud(phone, "library (390px)");
  await layout(phone, "library (390px)");
});
await phoneCtx.close();

// ---------- guest response delete ----------
await step("delete a guest response", async () => {
  const g = page.locator("section[aria-label=Guests]");
  await g.getByRole("button", { name: /Delete response from Olga/ }).click();
  await g.getByRole("button", { name: "Yes, delete" }).click();
  await g.getByText("No guest responses yet.").waitFor();
  ok(true, "deleting a guest response (with confirm) removes it");
  ok(!(await page.locator('[data-block="Songs chosen by guests"]').innerText()).includes("Zed Anthem"), "…and their added song leaves the master list");
});

// ---------- library ----------
let originalLib = null;
await step("library", async () => {
  originalLib = (await json("/api/songs/admin/library")).library;
  await page.goto(`${BASE}/admin/songs`);
  await page.getByRole("button", { name: "Library" }).click();
  await page.waitForSelector(".ad-lib-row");
  const total = await page.locator(".ad-lib-row").count();
  ok(total === songs.length, `library lists every song (${total} of ${songs.length})`);
  await shot("30-library", false);
  await aud(page, "library (desktop)");
  await page.getByLabel("Search songs").fill(S1.title);
  await page.waitForFunction((n) => document.querySelectorAll(".ad-lib-row").length < n, total, { timeout: 4000 });
  ok((await page.locator(`.ad-lib-row[data-song="${S1.id}"]`).count()) === 1, "search by title narrows the list");
  await page.getByLabel("Search songs").fill("");
  await page.waitForFunction((n) => document.querySelectorAll(".ad-lib-row").length === n, total);
  await page.getByRole("group", { name: "Flow" }).getByRole("button", { name: "Ceremony" }).click();
  const cer = await page.locator(".ad-lib-row").count();
  ok(cer === songs.filter((s) => s.flow === "ceremony").length, `Flow: Ceremony shows ceremony songs (${cer})`);
  await page.getByRole("group", { name: "Flow" }).getByRole("button", { name: "All" }).click();
  await page.locator("#lib-style").selectOption(S1.style);
  ok((await page.locator(".ad-lib-row").count()) === songs.filter((s) => s.style === S1.style).length, "Style filter narrows to that style");
  await page.locator("#lib-style").selectOption("all");
  const hasExplicit = songs.some((s) => s.explicit);
  await page.getByRole("group", { name: "Content" }).getByRole("button", { name: "Explicit" }).click();
  ok((await page.locator(".ad-lib-row").count()) === songs.filter((s) => s.explicit).length, `Explicit filter shows only explicit songs${hasExplicit ? "" : " (none exist)"}`);
  await page.getByRole("group", { name: "Content" }).getByRole("button", { name: "Clean" }).click();
  ok((await page.locator(".ad-lib-row .ad-badge", { hasText: "Explicit" }).count()) === 0, "Clean filter shows no explicit songs");
  await page.getByRole("group", { name: "Content" }).getByRole("button", { name: "All" }).click();

  // source link and hook time
  const row = page.locator(`.ad-lib-row[data-song="${S1.id}"]`);
  const rtxt = await row.innerText();
  const m = Math.floor(S1.hookStartSec / 60), s = String(Math.floor(S1.hookStartSec % 60)).padStart(2, "0");
  ok(rtxt.includes(`Hook ${m}:${s}`) && /YouTube/.test(rtxt), `row shows hook start ${m}:${s} and the YouTube source link`);
  ok((await row.locator("a").first().getAttribute("href")) === S1.sourceUrl, "source link points at sourceUrl");

  // hide / unhide
  await row.getByRole("button", { name: `Hide ${S1.title}` }).click();
  await row.getByRole("button", { name: `Unhide ${S1.title}` }).waitFor();
  ok((await json("/api/songs/admin/library")).library.hidden.includes(S1.id), "Hide saves the song as hidden on the server");
  await page.getByRole("group", { name: "Status" }).getByRole("button", { name: "Hidden" }).click();
  ok(await page.locator(`.ad-lib-row[data-song="${S1.id}"]`).count() === 1, "Hidden filter lists it");
  await page.reload();
  await page.getByRole("button", { name: "Library" }).click();
  await page.locator(`.ad-lib-row[data-song="${S1.id}"]`).getByRole("button", { name: `Unhide ${S1.title}` }).waitFor();
  ok(true, "hidden state survives a reload");
  await page.getByRole("group", { name: "Status" }).getByRole("button", { name: "Hidden" }).click();
  await page.locator(`.ad-lib-row[data-song="${S1.id}"]`).getByRole("button", { name: `Unhide ${S1.title}` }).click();
  await page.waitForFunction(async (id) => !(await (await fetch("/api/songs/admin/library")).json()).library.hidden.includes(id), S1.id, { timeout: 4000 });
  ok(true, "Unhide puts it back");
  // flag / unflag
  await page.getByRole("group", { name: "Status" }).getByRole("button", { name: "All" }).click();
  const row2 = page.locator(`.ad-lib-row[data-song="${S2.id}"]`);
  await row2.getByRole("button", { name: `Flag ${S2.title}` }).click();
  await row2.getByRole("button", { name: `Unflag ${S2.title}` }).waitFor();
  ok((await json("/api/songs/admin/library")).library.flagged.includes(S2.id), "Flag saves the song as flagged");
  await row2.getByRole("button", { name: `Unflag ${S2.title}` }).click();
  await row2.getByRole("button", { name: `Flag ${S2.title}` }).waitFor();
});
if (originalLib) await api("/api/songs/admin/library", { method: "PUT", headers: { "content-type": "application/json" }, data: JSON.stringify(originalLib) });

// ---------- switch the links off, then delete ----------
await step("switch off, delete", async () => {
  await page.goto(`${BASE}/admin/songs?c=${token}`);
  await page.waitForSelector(".ad-names");
  await page.getByRole("button", { name: "Switch off" }).click();
  await page.getByRole("button", { name: "Switch on" }).waitFor();
  const a = await fetch(`${BASE}/songs/${token}`);
  const g = await fetch(`${BASE}/songs/g/${guestToken}`);
  ok(a.status === 404, `switched off: the couple link is a 404 (got ${a.status})`);
  ok(g.status === 404, `switched off: the guest link is a 404 (got ${g.status})`);
  ok(/Links off/.test(await page.locator(".ad-dhead").innerText()), "detail shows the Links off chip");
  await page.getByRole("button", { name: "All couples" }).click();
  await page.getByRole("button", { name: "Off", exact: true }).click();
  ok((await page.locator(`.ad-card[data-token="${token}"]`).count()) === 1, "'Off' filter lists the switched-off couple");
  await shot("40-list-off");
  await page.locator(`.ad-card[data-token="${token}"]`).click();
  await page.getByRole("button", { name: "Switch on" }).click();
  await page.getByRole("button", { name: "Switch off" }).waitFor();
  ok((await fetch(`${BASE}/songs/${token}`)).status === 200, "switched back on: the couple link opens again");

  await page.getByText("Delete couple", { exact: true }).first().click();
  const del = page.getByRole("button", { name: "Delete couple" });
  ok(await del.isDisabled(), "Delete stays disabled until DELETE is typed");
  await page.getByLabel("Type DELETE to confirm").fill("delete me");
  ok(await del.isDisabled(), "…and a wrong word does not enable it");
  await page.getByLabel("Type DELETE to confirm").fill("DELETE");
  await del.click();
  await page.waitForSelector(".ad-hero");
  ok(!page.url().includes("?c="), "after deleting, back on the list");
  await page.waitForFunction((t) => !document.querySelector(`.ad-card[data-token="${t}"]`), token);
  ok((await page.locator(`.ad-card[data-token="${token}"]`).count()) === 0, "the couple is gone from the list");
  ok((await api(`/api/songs/admin/couples/${token}`)).status() === 404, "…and from the server");
  ok((await fetch(`${BASE}/songs/${token}`)).status === 404, "…its couple link is a 404");
});

// ---------- sign out ----------
await step("sign out", async () => {
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForSelector("#ad-pw");
  ok(true, "Sign out returns to the login page");
  ok((await api("/api/songs/admin/couples")).status() === 401, "…and the API is locked again");
});

console.log(errors.length ? `console errors:\n${[...new Set(errors)].join("\n")}` : "no console errors");
if (errors.length) failures++;
console.log(`\n[${engineName}] ` + (failures ? `${failures} FAILED` : "ALL PASSED"));
await browser.close();
process.exit(failures ? 1 : 0);
