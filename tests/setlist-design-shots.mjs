// Phone screenshots of every screen in every design, plus side-by-side contact sheets.
//   npx next dev -p 3055 & node tests/setlist-design-shots.mjs [outDir]
import { chromium, devices } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.BASE || "http://localhost:3055";
const OUT = process.argv[2] || "/tmp/setlist-designs";
const DESIGNS = [
  [1, "Tiles"],
  [2, "Vinyl"],
  [3, "Poster"],
  [4, "Paper"],
  [5, "Cinema"],
];
const SCREENS = ["1-home", "2-who", "3-genres", "4-swipe", "5-results"];
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const errors = [];

for (const [d] of DESIGNS) {
  const ctx = await browser.newContext({ ...devices["iPhone 14"], viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  // hide the Next.js dev badge so the shots look like production
  await page.addInitScript(() => document.addEventListener("DOMContentLoaded", () => document.head.insertAdjacentHTML("beforeend", "<style>nextjs-portal{display:none!important}</style>")));
  page.on("pageerror", (e) => errors.push(`d${d}: ${e}`));
  const shot = (n) => page.screenshot({ path: path.join(OUT, `d${d}-${n}.png`) });
  const token = `shots${d}` + "x".repeat(10);
  await page.goto(`${BASE}/songs/${token}?design=${d}`);
  await page.waitForSelector(".sl-big");
  await page.waitForTimeout(400);
  await shot("1-home");
  await page.locator(".sl-big--reception").click();
  await page.waitForSelector(".sl-who");
  await shot("2-who");
  await page.locator(".sl-who button", { hasText: "Anna" }).click();
  await page.waitForSelector(".sl-grid");
  for (const n of ["Pop hits", "Latin", "Russian folk"]) await page.locator(`.sl-style:has(.name:text-is("${n}"))`).click();
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector(".sl-grid")?.scrollTo({ left: 0 });
  });
  await page.waitForTimeout(300);
  await shot("3-genres");
  await page.locator(".sl-cta").click();
  await page.waitForSelector(".sl-card");
  await page.locator(".sl-act--like").click();
  await page.waitForTimeout(700);
  await page.locator('.sl-scrub input[type="range"]').fill("9");
  await page.waitForTimeout(400);
  await shot("4-swipe");
  // a realistic mix: likes, one must-play, a few skips, then one never-play on the results page
  const total = Number((await page.locator(".sl-prog").innerText()).split("/")[1]);
  for (let i = 1; i < total; i++) {
    const sel = i === 2 ? ".sl-act--love" : i % 4 === 3 ? ".sl-act--skip" : ".sl-act--like";
    await page.locator(sel).click();
  }
  await page.waitForSelector(".sl-results");
  await page.locator(".sl-sec--liked ~ .sl-group .sl-row .x").last().click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  await shot("5-results");
  await ctx.close();
}

// contact sheets: one per screen (5 designs side by side) and one overview (genres, swipe, results)
const sheet = async (file, rows, scale) => {
  const img = (f) => `data:image/png;base64,${fs.readFileSync(path.join(OUT, f)).toString("base64")}`;
  const html = `<html><body style="margin:0;background:#2a2627;font-family:Montserrat,Helvetica,Arial,sans-serif;color:#fff">
  <div style="display:grid;grid-template-columns:repeat(5,390px);gap:28px;padding:28px">
  ${DESIGNS.map(([d, n]) => `<div style="font-size:40px;font-weight:900;text-align:center">${d} · ${n}</div>`).join("")}
  ${rows.map((s) => DESIGNS.map(([d]) => `<img src="${img(`d${d}-${s}.png`)}" style="width:390px;border-radius:18px;display:block">`).join("")).join("")}
  </div></body></html>`;
  const ctx = await browser.newContext({ viewport: { width: 5 * 390 + 6 * 28, height: 400 }, deviceScaleFactor: scale });
  const p = await ctx.newPage();
  await p.setContent(html);
  await p.screenshot({ path: path.join(OUT, file), fullPage: true });
  await ctx.close();
};
for (const s of SCREENS) await sheet(`sheet-${s}.png`, [s], 1.5);
await sheet("sheet-overview.png", ["3-genres", "4-swipe", "5-results"], 0.75);

await browser.close();
console.log(errors.length ? `page errors:\n${errors.join("\n")}` : "no page errors");
console.log(`saved to ${OUT}`);
