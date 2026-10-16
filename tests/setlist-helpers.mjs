// Test couples are made (and removed) through the admin API, like Dan does on /admin/songs.
// Needs SETLIST_ADMIN_PASSWORD (the same one the server under test runs with).
import fs from "fs";

const BASE = process.env.BASE || "http://localhost:3055";
let cookie = "";

async function login() {
  if (cookie) return cookie;
  const r = await fetch(`${BASE}/api/songs/admin/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: process.env.SETLIST_ADMIN_PASSWORD }) });
  if (!r.ok) throw new Error(`admin login failed (${r.status}); set SETLIST_ADMIN_PASSWORD`);
  cookie = r.headers.get("set-cookie").split(";")[0];
  return cookie;
}

export async function makeCouple(names = ["Anna", "Mike"], lang = "en") {
  const r = await fetch(`${BASE}/api/songs/admin/couples`, { method: "POST", headers: { "content-type": "application/json", cookie: await login() }, body: JSON.stringify({ names, lang, date: "" }) });
  if (!r.ok) throw new Error(`could not create a test couple (${r.status})`);
  return (await r.json()).couple; // { token, guestToken, ... }
}

export async function removeCouple(token) {
  await fetch(`${BASE}/api/songs/admin/couples/${token}`, { method: "DELETE", headers: { cookie: await login() } });
}

export async function coupleDetail(token) {
  const r = await fetch(`${BASE}/api/songs/admin/couples/${token}`, { headers: { cookie: await login() } });
  return r.ok ? (await r.json()).detail : null;
}

// Catalog facts, so the tests follow the song library as it grows.
const catalog = JSON.parse(fs.readFileSync(new URL("../src/data/setlist-songs.json", import.meta.url), "utf8"));
export const songsIn = (style, cleanOnly) => catalog.songs.filter((s) => s.style === style && (!cleanOnly || !s.explicit));
export const stylesOf = (flow) => catalog.styles.filter((s) => s.flow === flow && catalog.songs.some((x) => x.style === s.id));
