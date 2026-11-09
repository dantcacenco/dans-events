import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DEFAULT_TITLE, EMPTY_DETAILS, cleanDetails, titleFor } from "@/lib/christmas/config";
import { QUESTIONS, optionFor, parsePrice } from "@/lib/christmas/santa";
import { cleanInput, detectDuplicate, formatWhen, headcounts, recordsToCsv, santaNames, searchRecords, type XmasRecord } from "@/lib/christmas/logic";
import { ADMIN, UI } from "@/lib/christmas/i18n";

const rec = (over: Partial<XmasRecord>): XmasRecord => ({ id: "a", name: "Ana", phone: "8285550101", santa: false, likes: [], gifts: [], arrived: false, at: 1, updatedAt: 1, ...over });
const gifts3 = [{ text: "Warm socks", price: 12 }, { text: "Hot chocolate", price: null }, { text: "A good book", price: 20 }];

describe("cleanInput", () => {
  const base = { name: "  Ana   Petrova ", phone: "828-555-0123", santa: true, likes: ["music", "bogus", "music", "tea"], gifts: [{ text: " Warm  socks ", price: "12,50" }, { text: "Hot chocolate", price: "" }, { text: "Book", price: 20 }, { text: "", price: "7" }] };
  it("normalises name and phone, keeps known likes once and clean gift ideas", () => {
    expect(cleanInput(base)).toEqual({ ok: true, value: { name: "Ana Petrova", phone: "8285550123", santa: true, likes: ["music", "tea"], gifts: [{ text: "Warm socks", price: 12.5 }, { text: "Hot chocolate", price: null }, { text: "Book", price: 20 }] } });
  });
  it("Santa is off unless it is exactly true, and then likes and gifts are dropped", () => {
    for (const santa of [undefined, "true", 1, null]) {
      const r = cleanInput({ ...base, santa });
      expect(r.ok && r.value.santa).toBe(false);
      expect(r.ok && r.value.gifts).toEqual([]);
      expect(r.ok && r.value.likes).toEqual([]);
    }
  });
  it("Santa needs 3 to 5 gift ideas of $20 or less", () => {
    expect(cleanInput({ ...base, gifts: base.gifts.slice(0, 2) })).toEqual({ ok: false, error: "gifts" });
    expect(cleanInput({ ...base, gifts: undefined })).toEqual({ ok: false, error: "gifts" });
    expect(cleanInput({ ...base, gifts: Array.from({ length: 6 }, (_, i) => ({ text: `Idea ${i}`, price: "" })) })).toEqual({ ok: false, error: "gifts" });
    expect(cleanInput({ ...base, gifts: Array.from({ length: 5 }, (_, i) => ({ text: `Idea ${i}`, price: "" })) }).ok).toBe(true);
    expect(cleanInput({ ...base, gifts: [...gifts3.slice(0, 2), { text: "Phone", price: 20.01 }] })).toEqual({ ok: false, error: "price" });
    expect(cleanInput({ ...base, gifts: [...gifts3.slice(0, 2), { text: "Phone", price: "abc" }] })).toEqual({ ok: false, error: "price" });
    expect(cleanInput({ ...base, gifts: [...gifts3.slice(0, 2), { text: "Phone", price: -1 }] })).toEqual({ ok: false, error: "price" });
    expect(cleanInput({ ...base, gifts: [...gifts3.slice(0, 2), { text: "Free", price: 0 }] }).ok).toBe(true);
  });
  it("a gift idea is cut to 60 characters and a one-letter idea does not count", () => {
    const r = cleanInput({ ...base, gifts: [{ text: "x".repeat(200), price: "" }, { text: "y", price: "" }, ...gifts3] });
    expect(r.ok && r.value.gifts[0].text.length).toBe(60);
    expect(r.ok && r.value.gifts.length).toBe(4);
  });
  it("lenient mode (admin edits) keeps what is valid and never fails on gifts", () => {
    const r = cleanInput({ ...base, gifts: [{ text: "Phone", price: 99 }] }, false);
    expect(r).toMatchObject({ ok: true, value: { gifts: [{ text: "Phone", price: null }] } });
    expect(cleanInput({ ...base, gifts: undefined }, false)).toMatchObject({ ok: true, value: { gifts: [] } });
  });
  it("has no party size: an old client that still sends one is ignored, nothing is stored", () => {
    for (const party of [undefined, 0, 3, 21, "x"]) {
      const r = cleanInput({ ...base, party });
      expect(r.ok && Object.keys(r.value)).toEqual(["name", "phone", "santa", "likes", "gifts"]);
    }
  });
  it("rejects a short name and a bad phone", () => {
    expect(cleanInput({ ...base, name: "A" })).toEqual({ ok: false, error: "name" });
    expect(cleanInput({ ...base, phone: "555" })).toEqual({ ok: false, error: "phone" });
    expect(cleanInput(null)).toEqual({ ok: false, error: "name" });
  });
});

describe("Secret Santa questions", () => {
  it("every question and option has EN, RU and UK text, and ids are unique", () => {
    const ids = new Set<string>();
    for (const q of QUESTIONS) {
      for (const l of ["en", "ru", "uk"] as const) expect(q.title[l].length, q.id).toBeGreaterThan(0);
      expect(q.title.ru).toMatch(/[А-Яа-яЁё]/);
      expect(q.title.uk).toMatch(/[А-Яа-яЇїІіЄєҐґ]/);
      for (const o of q.options) {
        expect(ids.has(o.id), o.id).toBe(false);
        ids.add(o.id);
        expect(o.label.ru).toMatch(/[А-Яа-яЁё]/);
        expect(o.label.uk).toMatch(/[А-Яа-яЇїІіЄєҐґ]/);
      }
    }
    expect(optionFor("tea")?.label.en).toBe("Tea");
    expect(optionFor("nope")).toBeUndefined();
  });
  it("parses prices", () => {
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("$12")).toBe(12);
    expect(parsePrice("7,5")).toBe(7.5);
    expect(parsePrice("12.345")).toBeNaN();
    expect(parsePrice("1e3")).toBeNaN();
  });
});

describe("duplicates", () => {
  it("same phone, same submission id is a retry; another id is a duplicate", () => {
    expect(detectDuplicate([rec({ id: "x" })], "8285550101", "x")).toMatchObject({ duplicate: true, sameSubmission: true });
    expect(detectDuplicate([rec({ id: "x" })], "8285550101", "y")).toMatchObject({ duplicate: true, sameSubmission: false });
    expect(detectDuplicate([rec({ id: "x" })], "8285550999", "y")).toEqual({ duplicate: false });
  });
});

describe("counts, filters, export", () => {
  const rows = [rec({ id: "1", name: "Ana", santa: true, arrived: true, likes: ["music", "tea"], gifts: gifts3 }), rec({ id: "2", name: "Boris", phone: "8285550202" }), rec({ id: "3", name: "Vera", phone: "8285550303", santa: true })];
  it("counts registrations (one person each), Santa opt-ins and arrivals", () => {
    expect(headcounts(rows)).toEqual({ registered: 3, santa: 2, arrived: 1 });
    expect(headcounts([])).toEqual({ registered: 0, santa: 0, arrived: 0 });
  });
  it("filters by Santa, arrived and waiting, and searches name or phone", () => {
    expect(searchRecords(rows, "", "santa").map((r) => r.id)).toEqual(["1", "3"]);
    expect(searchRecords(rows, "", "arrived").map((r) => r.id)).toEqual(["1"]);
    expect(searchRecords(rows, "", "waiting").map((r) => r.id)).toEqual(["2", "3"]);
    expect(searchRecords(rows, "bor").map((r) => r.id)).toEqual(["2"]);
    expect(searchRecords(rows, "(828) 555-0303").map((r) => r.id)).toEqual(["3"]);
    expect(searchRecords(rows, "ver", "santa").map((r) => r.id)).toEqual(["3"]);
    expect(searchRecords(rows, "boris", "santa")).toEqual([]);
    expect(searchRecords(rows, "socks").map((r) => r.id)).toEqual(["1"]);
  });
  it("lists Santa names one per line", () => {
    expect(santaNames(rows)).toBe("Ana\nVera");
  });
  it("CSV has a header, Santa column and guards spreadsheet formulas", () => {
    const csv = recordsToCsv([rec({ name: "=HYPERLINK(1)", santa: true, likes: ["music", "tea"], gifts: gifts3 })]);
    expect(csv.split("\r\n")[0]).toContain("Secret Santa");
    expect(csv.split("\r\n")[0]).not.toContain("People");
    expect(csv).toContain("'=HYPERLINK(1)");
    expect(csv).toContain(",yes,");
    expect(csv.split("\r\n")[0]).toContain("Likes");
    expect(csv).toContain("Music; Tea");
    expect(csv).toContain("Warm socks ($12)");
    expect(csv).toContain("Hot chocolate,");
    expect(csv).toContain("A good book ($20)");
  });
});

describe("event details", () => {
  it("keeps valid date, time and text; drops invalid ones", () => {
    expect(cleanDetails({ title: { en: " Xmas  Party " }, date: "2026-12-20", time: "17:30", place: " Church hall " })).toEqual({ title: { en: "Xmas Party", ru: "", uk: "" }, date: "2026-12-20", time: "17:30", place: "Church hall" });
    expect(cleanDetails({ date: "2026-13-40", time: "25:00" })).toEqual(EMPTY_DETAILS);
    expect(cleanDetails("nope")).toEqual(EMPTY_DETAILS);
  });
  it("falls back to the translated default title per language", () => {
    expect(titleFor(EMPTY_DETAILS, "ru")).toBe(DEFAULT_TITLE.ru);
    expect(titleFor({ ...EMPTY_DETAILS, title: { en: "Hi", ru: "", uk: "" } }, "en")).toBe("Hi");
  });
  it("formats the date and time in each language", () => {
    expect(formatWhen("2026-12-20", "17:00", "en")).toBe("Sunday, December 20 · 5:00 PM");
    expect(formatWhen("2026-12-20", "17:00", "ru")).toContain("20 декабря");
    expect(formatWhen("2026-12-20", "", "uk")).toContain("20 грудня");
    expect(formatWhen("", "", "en")).toBe("");
  });
});

describe("translations", () => {
  it("every string has English, Russian and Ukrainian text, and Russian/Ukrainian are really translated", () => {
    for (const table of [UI, ADMIN]) {
      for (const [key, v] of Object.entries(table)) {
        expect(v.en.length, key).toBeGreaterThan(0);
        expect(v.ru.length, key).toBeGreaterThan(0);
        expect(v.uk.length, key).toBeGreaterThan(0);
        // Words must be Cyrillic (the shared tokens such as the phone placeholder and CSV are exempt).
        if (/[A-Za-z]{4,}/.test(v.en) && !["phonePh", "csvSanta", "pricePh"].includes(key)) {
          expect(v.ru, key).toMatch(/[А-Яа-яЁё]/);
          expect(v.uk, key).toMatch(/[А-Яа-яЇїІіЄєҐґ]/);
        }
      }
    }
  });
});

describe("admin auth", () => {
  const OLD = process.env.CHRISTMAS_ADMIN_PASSWORD;
  afterAll(() => {
    if (OLD === undefined) delete process.env.CHRISTMAS_ADMIN_PASSWORD;
    else process.env.CHRISTMAS_ADMIN_PASSWORD = OLD;
  });
  it("matches only the configured password and is off when the env var is missing or too short", async () => {
    const auth = await import("@/lib/christmas/auth");
    delete process.env.CHRISTMAS_ADMIN_PASSWORD;
    expect(auth.adminConfigured()).toBe(false);
    expect(auth.passwordMatches("anything")).toBe(false);
    process.env.CHRISTMAS_ADMIN_PASSWORD = "abc";
    expect(auth.adminConfigured()).toBe(false);
    process.env.CHRISTMAS_ADMIN_PASSWORD = "test-pass-1";
    expect(auth.adminConfigured()).toBe(true);
    expect(auth.passwordMatches("test-pass-1")).toBe(true);
    expect(auth.passwordMatches(" test-pass-1 ")).toBe(true);
    expect(auth.passwordMatches("test-pass-2")).toBe(false);
    expect(auth.passwordMatches("")).toBe(false);
    expect(auth.passwordMatches(null)).toBe(false);
  });
  it("signed sessions verify, expire, and die when the password changes", async () => {
    const auth = await import("@/lib/christmas/auth");
    process.env.CHRISTMAS_ADMIN_PASSWORD = "test-pass-1";
    const now = 1_000_000;
    const s = auth.adminSession(now);
    expect(auth.validAdminSession(s.value, now + 1000)).toBe(true);
    expect(auth.validAdminSession(s.value, now + 8 * 24 * 3600 * 1000)).toBe(false);
    expect(auth.validAdminSession(s.value.slice(0, -2) + "xx", now + 1000)).toBe(false);
    expect(auth.validAdminSession(undefined, now)).toBe(false);
    process.env.CHRISTMAS_ADMIN_PASSWORD = "test-pass-2";
    expect(auth.validAdminSession(s.value, now + 1000)).toBe(false);
  });
});

describe("store (local file KV, isolated in a temp folder)", () => {
  const cwd = process.cwd();
  let store: typeof import("@/lib/christmas/store");
  beforeAll(async () => {
    process.chdir(mkdtempSync(path.join(tmpdir(), "xmas-")));
    vi.resetModules();
    store = await import("@/lib/christmas/store");
  });
  afterAll(() => {
    process.chdir(cwd);
  });
  const input = { name: "Ana Petrova", phone: "8285550123", santa: true, likes: ["music"], gifts: gifts3 };

  it("creates, recognises a retry and a duplicate, and updates on request", async () => {
    const a = await store.submit("id-aaaaaaaa", input, false, 100);
    expect(a.status).toBe("created");
    expect((await store.submit("id-aaaaaaaa", input, false, 200)).status).toBe("retry");
    expect((await store.submit("id-bbbbbbbb", input, false, 300)).status).toBe("duplicate");
    const u = await store.submit("id-bbbbbbbb", { ...input, santa: false, likes: [], gifts: [] }, true, 400);
    expect(u.status).toBe("updated");
    const all = await store.listRecords();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: "id-aaaaaaaa", santa: false, at: 100, updatedAt: 400, arrived: false });
  });
  it("marks arrived, edits (phone clash refused), deletes and restores", async () => {
    await store.submit("id-cccccccc", { name: "Boris", phone: "8285550202", santa: true, likes: ["tea"], gifts: gifts3 }, false, 500);
    expect((await store.setArrived("id-cccccccc", true))?.arrived).toBe(true);
    expect(await store.adminEdit("id-cccccccc", { name: "Boris K", phone: "8285550123", santa: true })).toEqual({ ok: false, error: "phone-taken" });
    const ed = await store.adminEdit("id-cccccccc", { name: "Boris K", party: 2, phone: "8285550909", santa: false });
    expect(ed.ok && ed.record).toMatchObject({ name: "Boris K", phone: "8285550909", arrived: true, santa: false, likes: [], gifts: [] });
    // editing a Santa guest without sending gifts keeps the ideas they gave
    const keep = await store.adminEdit("id-cccccccc", { name: "Boris K", phone: "8285550909", santa: true });
    expect(keep.ok && keep.record).toMatchObject({ santa: true });
    await store.submit("id-ffffffff", { name: "Gala", phone: "8285550777", santa: true, likes: ["tea"], gifts: gifts3 }, false, 600);
    const kept = await store.adminEdit("id-ffffffff", { name: "Gala P", phone: "8285550777", santa: true });
    expect(kept.ok && kept.record).toMatchObject({ name: "Gala P", likes: ["tea"], gifts: gifts3 });
    await store.deleteRecord("id-ffffffff");
    const before = (await store.listRecords()).find((r) => r.id === "id-cccccccc")!;
    await store.deleteRecord("id-cccccccc");
    expect((await store.listRecords()).map((r) => r.id)).toEqual(["id-aaaaaaaa"]);
    expect(await store.restoreRecord(before)).toBe(true);
    expect((await store.listRecords()).map((r) => r.id).sort()).toEqual(["id-aaaaaaaa", "id-cccccccc"]);
    // the phone index came back too: the same phone is a duplicate again
    expect((await store.submit("id-dddddddd", { name: "Boris K", phone: "8285550909", santa: false, likes: [], gifts: [] }, false)).status).toBe("duplicate");
  });
  it("an old record that still has a party size lists fine and the number is dropped", async () => {
    const { kvSet } = await import("@/lib/teo/kv");
    await kvSet("xmas:xmas-2026:rec:id-legacy01", { id: "id-legacy01", name: "Old Guest", party: 4, phone: "8285550606", santa: false, arrived: false, at: 1, updatedAt: 1 });
    const old = (await store.listRecords()).find((r) => r.id === "id-legacy01")!;
    expect(old.name).toBe("Old Guest");
    expect("party" in old).toBe(false);
    expect(headcounts(await store.listRecords()).registered).toBe(3);
    await store.deleteRecord("id-legacy01");
  });
  it("event details persist and survive a wipe; wipe removes every registration", async () => {
    expect(await store.getDetails()).toEqual(EMPTY_DETAILS);
    await store.setDetails({ title: { en: "Party" }, date: "2026-12-20", time: "18:00", place: "Hall" });
    expect((await store.getDetails()).place).toBe("Hall");
    expect(await store.wipeAll()).toBeGreaterThan(0);
    expect(await store.listRecords()).toEqual([]);
    expect((await store.getDetails()).title.en).toBe("Party");
    expect((await store.submit("id-eeeeeeee", input, false)).status).toBe("created"); // phone index was wiped too
  });
});
