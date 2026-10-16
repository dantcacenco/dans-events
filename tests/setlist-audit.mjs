// WCAG AA check of every visible text on the current screen. The text is made invisible, the page is photographed,
// and each text box is compared with the brightest and darkest background pixel behind it (so gradients count).
// Disabled controls are exempt; icons need 3:1, normal text 4.5:1, large text (24px, or 18.66px bold) 3:1.
export async function audit(pg, label) {
  const items = await pg.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll(".sl *")) {
      if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      if (e.closest(":disabled") || e.classList.contains("emoji") || e.classList.contains("sl-hero") && e.closest(".sl-style, .sl-big, .sl-card-art, .sl-welcome, .sl-thanks")) continue;
      // the box of the element's own text (not its padding, rounded corners or child pills)
      const range = document.createRange();
      const own = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
      range.setStartBefore(own[0]);
      range.setEndAfter(own[own.length - 1]);
      const r = range.getBoundingClientRect();
      const at = (x, y) => document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, x)), Math.min(innerHeight - 1, Math.max(0, y)));
      const covered = [[(r.left + r.right) / 2, (r.top + r.bottom) / 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.top + 2]].some(([x, y]) => {
        const hit = at(x, y);
        return !hit || !(e.contains(hit) || hit.contains(e));
      });
      if (covered) continue; // partly or wholly under the sticky button or a dialog
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
