import { describe, expect, it } from "vitest";
import { MEALS, MODES } from "@/lib/checkin/config";
import { cleanInput, detectDuplicate, formatPhone, headcounts, normalizePhone, phonesForTexting, questionsFor, recordsToCsv, searchRecords, type CheckinRecord } from "@/lib/checkin/logic";

const rec = (over: Partial<CheckinRecord>): CheckinRecord => ({ id: "a", name: "Ana", party: 1, phone: "8285550101", overnight: false, meals: [], mode: "fri-am", at: 1, updatedAt: 1, ...over });

describe("mode -> questions", () => {
  it("friday morning asks overnight and all five meals", () => {
    expect(questionsFor("fri-am")).toEqual({ overnight: true, meals: ["friLunch", "friDinner", "satBreakfast", "satLunch", "satDinner"] });
  });
  it("friday evening drops friday lunch and dinner", () => {
    const q = questionsFor("fri-pm");
    expect(q.overnight).toBe(true);
    expect(q.meals).toEqual(["satBreakfast", "satLunch", "satDinner"]);
  });
  it("saturday morning: no overnight, no friday meals", () => {
    expect(questionsFor("sat-am")).toEqual({ overnight: false, meals: ["satBreakfast", "satLunch", "satDinner"] });
  });
  it("saturday evening: only name, party and phone", () => {
    expect(questionsFor("sat-pm")).toEqual({ overnight: false, meals: [] });
  });
  it("every mode is covered", () => {
    expect(MODES).toHaveLength(4);
  });
});

describe("phone", () => {
  it("accepts common US formats", () => {
    for (const p of ["8285550123", "(828) 555-0123", "828-555-0123", "828.555.0123", "+1 828 555 0123", "1-828-555-0123", " +18285550123 "]) expect(normalizePhone(p)).toBe("8285550123");
  });
  it("rejects bad numbers", () => {
    for (const p of ["", "555-0123", "0285550123", "1285550123", "828555012", "82855501234", "abc8285550123", "+44 20 7946 0958", null, 5]) expect(normalizePhone(p)).toBeNull();
  });
  it("formats while typing", () => {
    expect(formatPhone("828")).toBe("828");
    expect(formatPhone("8285")).toBe("(828) 5");
    expect(formatPhone("8285550123")).toBe("(828) 555-0123");
    expect(formatPhone("+1 828 555 0123 99")).toBe("(828) 555-0123");
  });
});

describe("cleanInput", () => {
  const base = { name: "  Ana   Petrova ", party: 3, phone: "828-555-0123", overnight: true, meals: ["friLunch", "satDinner", "bogus"], mode: "fri-am" };
  it("normalises and keeps only asked meals", () => {
    const r = cleanInput(base);
    expect(r).toEqual({ ok: true, value: { name: "Ana Petrova", party: 3, phone: "8285550123", overnight: true, meals: ["friLunch", "satDinner"], mode: "fri-am" } });
  });
  it("drops meals not asked in the mode and ignores overnight where not asked", () => {
    const r = cleanInput({ ...base, mode: "sat-pm", overnight: true });
    expect(r.ok && r.value.meals).toEqual([]);
    expect(r.ok && r.value.overnight).toBeNull();
    const fp = cleanInput({ ...base, mode: "fri-pm" });
    expect(fp.ok && fp.value.meals).toEqual(["satDinner"]);
  });
  it("party must be 1-20", () => {
    expect(cleanInput({ ...base, party: 0 })).toEqual({ ok: false, error: "party" });
    expect(cleanInput({ ...base, party: 21 })).toEqual({ ok: false, error: "party" });
    expect(cleanInput({ ...base, party: 1.5 })).toEqual({ ok: false, error: "party" });
    expect(cleanInput({ ...base, party: 20 }).ok).toBe(true);
    expect(cleanInput({ ...base, party: 1 }).ok).toBe(true);
  });
  it("requires name, phone, overnight (when asked) and a known mode", () => {
    expect(cleanInput({ ...base, name: "A" })).toEqual({ ok: false, error: "name" });
    expect(cleanInput({ ...base, phone: "123" })).toEqual({ ok: false, error: "phone" });
    expect(cleanInput({ ...base, overnight: undefined })).toEqual({ ok: false, error: "overnight" });
    expect(cleanInput({ ...base, mode: "nope" })).toEqual({ ok: false, error: "mode" });
  });
});

describe("headcounts", () => {
  const rows = [
    rec({ id: "1", party: 4, overnight: true, meals: ["friLunch", "satBreakfast"] }),
    rec({ id: "2", phone: "8285550102", party: 2, overnight: true, meals: ["friLunch", "friDinner", "satDinner"] }),
    rec({ id: "3", phone: "8285550103", party: 1, overnight: false, meals: ["satBreakfast"] }),
    rec({ id: "4", phone: "8285550104", party: 3, overnight: null, meals: [], mode: "sat-pm" }),
  ];
  it("counts people in each party, not forms", () => {
    const s = headcounts(rows);
    expect(s.parties).toBe(4);
    expect(s.people).toBe(10);
    expect(s.overnightParties).toBe(2);
    expect(s.overnightPeople).toBe(6);
    expect(s.meals).toEqual({ friLunch: 6, friDinner: 2, satBreakfast: 5, satLunch: 0, satDinner: 2 });
  });
  it("empty list is all zeros", () => {
    const s = headcounts([]);
    expect(s.people).toBe(0);
    expect(Object.values(s.meals).every((v) => v === 0)).toBe(true);
    expect(Object.keys(s.meals)).toEqual([...MEALS]);
  });
});

describe("duplicates", () => {
  const list = [rec({ id: "a", phone: "8285550123" })];
  it("same phone, new submission = duplicate", () => {
    expect(detectDuplicate(list, "8285550123", "b")).toMatchObject({ duplicate: true, sameSubmission: false });
  });
  it("same phone and same submission id = a retry, not a duplicate person", () => {
    expect(detectDuplicate(list, "8285550123", "a")).toMatchObject({ duplicate: true, sameSubmission: true });
  });
  it("new phone is fine", () => {
    expect(detectDuplicate(list, "8285550999", "c")).toEqual({ duplicate: false });
  });
});

describe("staff helpers", () => {
  const rows = [rec({ id: "1", name: "Ana Petrova", phone: "8285550123" }), rec({ id: "2", name: "Boris", phone: "8285559999" })];
  it("search by name or phone digits", () => {
    expect(searchRecords(rows, "pet").map((r) => r.id)).toEqual(["1"]);
    expect(searchRecords(rows, "(828) 555-9999").map((r) => r.id)).toEqual(["2"]);
    expect(searchRecords(rows, "").length).toBe(2);
  });
  it("phone list for texting", () => {
    expect(phonesForTexting(rows)).toBe("+18285550123, +18285559999");
  });
  it("csv guards spreadsheet formulas and quotes", () => {
    const csv = recordsToCsv([rec({ name: '=HYPERLINK("x")' })]);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
    expect(csv.startsWith("﻿Name,People,Phone")).toBe(true);
  });
});
