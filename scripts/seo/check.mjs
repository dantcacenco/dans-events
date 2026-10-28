// SEO check for a running build (npm run build && npm start, or next start -p 3123).
//   node scripts/seo/check.mjs [baseUrl] [--old-urls file]
// Crawls every internal link from the home page and checks: status 200, click depth <= 3, one <h1>,
// title <= 60 and description <= 160 characters, canonical = the page URL, JSON-LD parses, <img> alt text,
// every sitemap URL resolves and every crawled page is in the sitemap, robots.txt and llms.txt render,
// no en/em dashes in the copy of new pages, and near-duplicate copy between pages.
// Exits 1 on errors. Legacy pages (existing before seo-2026) only warn on title length and dashes.
import fs from "node:fs";

const BASE = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "http://localhost:3123").replace(/\/$/, "");
const oldUrlsArg = process.argv.indexOf("--old-urls");
const SITE = "https://dans-events.com";
const NEW_PREFIXES = ["/venues", "/areas", "/reviews", "/about", "/faq", "/low-fog", "/cold-sparklers", "/wedding-uplighting", "/special-effects"];
const isNew = (p) => NEW_PREFIXES.some((x) => p === x || p.startsWith(x + "/"));

const errors = [];
const warnings = [];
const pages = new Map(); // path -> { depth, html }
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function get(path) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  return { status: r.status, location: r.headers.get("location"), body: r.status === 200 ? await r.text() : "" };
}

function links(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    let h = decode(m[1]);
    if (h.startsWith(SITE)) h = h.slice(SITE.length) || "/";
    if (!h.startsWith("/") || h.startsWith("//")) continue;
    h = h.split("#")[0].split("?")[0];
    if (!h) continue;
    if (h.length > 1) h = h.replace(/\/$/, "");
    out.add(h);
  }
  return out;
}

// 1) Crawl
const queue = [["/", 0]];
pages.set("/", { depth: 0 });
while (queue.length) {
  const [path, depth] = queue.shift();
  const r = await get(path);
  if (r.status !== 200) {
    errors.push(`${path}: HTTP ${r.status}${r.location ? " -> " + r.location : ""}`);
    continue;
  }
  pages.get(path).html = r.body;
  for (const l of links(r.body)) {
    if (/\.(png|jpe?g|webp|svg|ico|pdf|txt|xml)$/.test(l) || l.startsWith("/_next") || l.startsWith("/api")) continue;
    if (!pages.has(l)) {
      pages.set(l, { depth: depth + 1 });
      queue.push([l, depth + 1]);
    }
  }
}

// 2) Per-page checks
const shingles = {};
const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<nav[\s\S]*?<\/nav>/g, " ")
      .replace(/<footer[\s\S]*?<\/footer>/g, " ")
      .replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ")
      .replace(/<form[\s\S]*?<\/form>/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const words = {};
for (const [path, p] of pages) {
  if (!p.html) continue;
  const html = p.html;
  const url = path === "/" ? SITE : SITE + path;
  if (p.depth > 3) errors.push(`${path}: ${p.depth} clicks from home`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${path}: ${h1} <h1>`);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const bucket = isNew(path) ? errors : warnings;
  if (!title || title.length > 60) bucket.push(`${path}: title ${title.length} chars "${title}"`);
  if (!desc || desc.length > 160) bucket.push(`${path}: description ${desc.length} chars`);
  if (canon !== url) errors.push(`${path}: canonical ${canon} (expected ${url})`);
  if (!/<meta property="og:title"/.test(html)) bucket.push(`${path}: no og:title`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      errors.push(`${path}: JSON-LD does not parse: ${e.message}`);
    }
  }
  if (/"aggregateRating"|"@type":"Review"/.test(html)) errors.push(`${path}: review/rating schema found`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errors.push(`${path}: img without alt: ${m[0].slice(0, 100)}`);
    else if (/\balt=""/.test(m[0])) (isNew(path) ? errors : warnings).push(`${path}: decorative img with empty alt`);
    if (isNew(path) && !/\bwidth="\d+"/.test(m[0]) && !/data-nimg="fill"/.test(m[0])) errors.push(`${path}: img without width/height`);
  }
  const text = strip(html);
  words[path] = text.split(" ").length;
  if (/[–—]/.test(text)) (isNew(path) ? errors : warnings).push(`${path}: en/em dash in copy`);
  if (isNew(path) && words[path] < 400 && path !== "/reviews") warnings.push(`${path}: only ${words[path]} words`);
  const w = text.toLowerCase().replace(/[^a-z0-9а-яё ]/g, "").split(" ");
  const set = new Set();
  for (let i = 0; i + 6 < w.length; i++) set.add(w.slice(i, i + 6).join(" "));
  shingles[path] = set;
}

// 3) Near-duplicates among new pages (share of 6-word phrases also found on one other page)
for (const a of Object.keys(shingles).filter(isNew)) {
  let worst = 0, other = "";
  for (const b of Object.keys(shingles)) {
    if (a === b) continue;
    let c = 0;
    for (const s of shingles[a]) if (shingles[b].has(s)) c++;
    const share = c / Math.max(1, shingles[a].size);
    if (share > worst) [worst, other] = [share, b];
  }
  if (worst > 0.2) errors.push(`${a}: ${(worst * 100).toFixed(0)}% of phrases also on ${other}`);
}

// 4) Sitemap, robots, llms.txt
const sm = await get("/sitemap.xml");
const smUrls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");
if (!sm.body.includes("<lastmod>")) errors.push("sitemap: no lastmod");
for (const u of smUrls) {
  const p = pages.get(u);
  if (!p) {
    const r = await get(u);
    errors.push(`sitemap URL not reachable by links from home${r.status !== 200 ? ` (HTTP ${r.status})` : ""}: ${u}`);
  }
}
for (const [path, p] of pages) if (p.html && !smUrls.includes(path) && !/^\/(songs|admin|teo|pixel)/.test(path)) errors.push(`${path}: not in sitemap`);
const robots = await get("/robots.txt");
for (const bot of ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"]) {
  if (!robots.body.includes(bot)) errors.push(`robots.txt: ${bot} missing`);
}
const llms = await get("/llms.txt");
if (llms.status !== 200 || !llms.body.startsWith("# Dan's Events")) errors.push("llms.txt missing");

// 5) Old URLs still resolve
if (oldUrlsArg > 0) {
  const old = fs.readFileSync(process.argv[oldUrlsArg + 1], "utf8").split("\n").filter(Boolean);
  for (const u of old) {
    const r = await get(u);
    if (r.status !== 200 && !(r.status === 301 || r.status === 308)) errors.push(`old URL ${u}: HTTP ${r.status}`);
  }
  console.log(`old URLs checked: ${old.length}`);
}

const depths = [...pages.values()].filter((p) => p.html).map((p) => p.depth);
const count = (pre) => [...pages.keys()].filter((p) => p.startsWith(pre)).length;
console.log(`${pages.size} pages crawled from home; max click depth ${Math.max(...depths)}; sitemap URLs ${smUrls.length}`);
console.log(`venues ${count("/venues/")}, new-page words min ${Math.min(...Object.entries(words).filter(([p]) => isNew(p)).map(([, n]) => n))}`);
if (warnings.length) console.log(`WARNINGS (${warnings.length}):\n  ` + warnings.join("\n  "));
if (errors.length) {
  console.log(`ERRORS (${errors.length}):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log("OK: links, depth, h1, titles, descriptions, canonicals, JSON-LD, images, sitemap, robots, llms.txt");
