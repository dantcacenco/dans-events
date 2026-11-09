import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DEFAULT_TITLE, EMPTY_DETAILS, cleanDetails, titleFor } from "@/lib/christmas/config";
import { cleanInput, detectDuplicate, formatWhen, headcounts, recordsToCsv, santaNames, searchRecords, type XmasRecord } from "@/lib/christmas/logic";
import { ADMIN, UI } from "@/lib/christmas/i18n";

const rec = (over: Partial<XmasRecord>): XmasRecord => ({ id: "a", name: "Ana", party: 1, phone: "8285550101", santa: false, arrived: false, at: 1, updatedAt: 1, ...over });

describe("cleanInput", () => {
  const base = { name: "  Ana   Petrova ", party: 3, phone: "828-555-0123", santa: true };
  it("normalises name and phone and keeps the Santa choice", () => {
    expect(cleanInput(base)).toEqual({ ok: true, value: { name: "Ana Petrova", party: 3, phone: "8285550123", santa: true } });
  });
  it("Santa is off unless it is exactly true", () => {
    for (const santa of [undefined, "true", 1, null]) {
      const r = cleanInput({ ...base, santa });
      expect(r.ok && r.value.santa).toBe(false);
    }
  });
  it("rejects a short name, a bad party and a bad phone", () => {
    expect(cleanInput({ ...base, name: "A" })).toEqual({ ok: false, error: "name" });
    expect(cleanInput({ ...base, party: 0 })).toEqual({ ok: false, error: "party" });
    expect(cleanInput({ ...base, party: 21 })).toEqual({ ok: false, error: "party" });
    expect(cleanInput({ ...base, phone: "555" })).toEqual({ ok: false, error: "phone" });
    expect(cleanInput(null)).toEqual({ ok: false, error: "name" });
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
  const rows = [rec({ id: "1", name: "Ana", party: 2, santa: true, arrived: true }), rec({ id: "2", name: "Boris", party: 1, phone: "8285550202" }), rec({ id: "3", name: "Vera", party: 3, phone: "8285550303", santa: true })];
  it("counts people, groups, Santa opt-ins and arrivals", () => {
    expect(headcounts(rows)).toEqual({ parties: 3, people: 6, santa: 2, arrivedPeople: 2, arrivedParties: 1 });
    expect(headcounts([])).toEqual({ parties: 0, people: 0, santa: 0, arrivedPeople: 0, arrivedParties: 0 });
  });
  it("filters by Santa, arrived and waiting, and searches name or phone", () => {
    expect(searchRecords(rows, "", "santa").map((r) => r.id)).toEqual(["1", "3"]);
    expect(searchRecords(rows, "", "arrived").map((r) => r.id)).toEqual(["1"]);
    expect(searchRecords(rows, "", "waiting").map((r) => r.id)).toEqual(["2", "3"]);
    expect(searchRecords(rows, "bor").map((r) => r.id)).toEqual(["2"]);
    expect(searchRecords(rows, "(828) 555-0303").map((r) => r.id)).toEqual(["3"]);
    expect(searchRecords(rows, "ver", "santa").map((r) => r.id)).toEqual(["3"]);
    expect(searchRecords(rows, "boris", "santa")).toEqual([]);
  });
  it("lists Santa names one per line", () => {
    expect(santaNames(rows)).toBe("Ana\nVera");
  });
  it("CSV has a header, Santa column and guards spreadsheet formulas", () => {
    const csv = recordsToCsv([rec({ name: "=HYPERLINK(1)", santa: true })]);
    expect(csv.split("\r\n")[0]).toContain("Secret Santa");
    expect(csv).toContain("'=HYPERLINK(1)");
    expect(csv).toContain(",yes,");
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
        if (/[A-Za-z]{4,}/.test(v.en) && !["phonePh", "csvSanta"].includes(key)) {
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
  const input = { name: "Ana Petrova", party: 2, phone: "8285550123", santa: true };

  it("creates, recognises a retry and a duplicate, and updates on request", async () => {
    const a = await store.submit("id-aaaaaaaa", input, false, 100);
    expect(a.status).toBe("created");
    expect((await store.submit("id-aaaaaaaa", input, false, 200)).status).toBe("retry");
    expect((await store.submit("id-bbbbbbbb", input, false, 300)).status).toBe("duplicate");
    const u = await store.submit("id-bbbbbbbb", { ...input, party: 4, santa: false }, true, 400);
    expect(u.status).toBe("updated");
    const all = await store.listRecords();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: "id-aaaaaaaa", party: 4, santa: false, at: 100, updatedAt: 400, arrived: false });
  });
  it("marks arrived, edits (phone clash refused), deletes and restores", async () => {
    await store.submit("id-cccccccc", { name: "Boris", party: 1, phone: "8285550202", santa: true }, false, 500);
    expect((await store.setArrived("id-cccccccc", true))?.arrived).toBe(true);
    expect(await store.adminEdit("id-cccccccc", { name: "Boris K", party: 1, phone: "8285550123", santa: true })).toEqual({ ok: false, error: "phone-taken" });
    const ed = await store.adminEdit("id-cccccccc", { name: "Boris K", party: 2, phone: "8285550909", santa: false });
    expect(ed.ok && ed.record).toMatchObject({ name: "Boris K", phone: "8285550909", arrived: true, santa: false });
    const before = (await store.listRecords()).find((r) => r.id === "id-cccccccc")!;
    await store.deleteRecord("id-cccccccc");
    expect((await store.listRecords()).map((r) => r.id)).toEqual(["id-aaaaaaaa"]);
    expect(await store.restoreRecord(before)).toBe(true);
    expect((await store.listRecords()).map((r) => r.id).sort()).toEqual(["id-aaaaaaaa", "id-cccccccc"]);
    // the phone index came back too: the same phone is a duplicate again
    expect((await store.submit("id-dddddddd", { name: "Boris K", party: 1, phone: "8285550909", santa: false }, false)).status).toBe("duplicate");
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
