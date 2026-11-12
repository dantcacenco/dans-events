import { describe, expect, it } from "vitest";
import {
  coupleGreeting,
  DEFAULT_TEMPLATES,
  fillTemplate,
  firstName,
  GOOGLE_REVIEW_URL,
  mergeYears,
  messageForCouple,
  messageForVendor,
  messageForVenue,
  pickVariant,
  prettyPhone,
  shortDate,
  whenDate,
  yearsOf,
  type Couple,
  type ThanksData,
  type Vendor,
  type Venue,
} from "@/lib/thanks/messages";

const couple: Couple = {
  id: "c-2026-05-21", year: 2026, date: "2026-05-21", couple: "Ben & Anna", venue: "Example Hall", town: "Town, NC", role: "mixed",
  bride: { name: "Anna Test", phone: "+18640000001" }, groom: { name: "Ben Sample", phone: "+18640000002" },
};
const vendor: Vendor = { id: "v-kate-2605", name: "Kate", company: "Example Weddings", role: "coordinator", kind: "coordinator", phone: "+17040000000", email: null, instagram: null, weddings: [{ date: "2026-05-21", couple: "Ben & Anna" }] };
const venue: Venue = { id: "ve-dream-forest-venue", year: 2026, name: "Dream Forest Venue", town: "Pacolet, SC", weddings: [{ date: "2026-04-12", couple: "Couple A" }, { date: "2026-07-24", couple: "Couple B" }] };

describe("thank-you messages", () => {
  it("adds the year to older dates only", () => {
    expect(whenDate("2026-05-21", 2026)).toBe("May 21");
    expect(whenDate("2023-10-28", 2026)).toBe("Oct 28, 2023");
  });

  it("formats dates and phones", () => {
    expect(shortDate("2026-05-21")).toBe("May 21");
    expect(prettyPhone("+18645551234")).toBe("(864) 555-1234");
  });

  it("greets people by first name, never a company", () => {
    expect(firstName("Hunter Smith")).toBe("Hunter");
    expect(firstName("Wild Willow Company")).toBe("");
    expect(firstName("Lumen House Operations")).toBe("");
    expect(firstName("Mila / Liudmila")).toBe("Mila");
    expect(coupleGreeting(couple)).toBe("Ben and Anna");
  });

  it("fills every placeholder and leaves no braces", () => {
    for (let i = 0; i < DEFAULT_TEMPLATES.couple.length; i++) {
      const m = messageForCouple(couple, DEFAULT_TEMPLATES, GOOGLE_REVIEW_URL, i);
      expect(m).not.toMatch(/[{}]/);
      expect(m).toContain(GOOGLE_REVIEW_URL);
      expect(m).toContain("Ben and Anna");
    }
    const v = messageForVendor(vendor, DEFAULT_TEMPLATES, GOOGLE_REVIEW_URL, () => "Example Hall", 0);
    expect(v).toContain("Hi Kate!");
    expect(v).toContain("Ben & Anna's wedding on May 21");
    const ve = messageForVenue(venue, DEFAULT_TEMPLATES, GOOGLE_REVIEW_URL, 0);
    expect(ve).toContain(`Dream Forest Venue (Apr 12, Jul 24${new Date().getFullYear() === 2026 ? "" : ", 2026"})`);
  });

  it("drops the phrase when a piece is missing", () => {
    expect(fillTemplate("Hi {first}! Your wedding at {venue} on {date}. {review}", { review: "R" })).toBe("Hi! Your wedding. R");
  });

  it("keeps messages short (2-4 lines, under 320 chars)", () => {
    for (const list of Object.values(DEFAULT_TEMPLATES))
      for (const t of list) {
        const m = fillTemplate(t, { first: "Sam", couple: "Sam & Lee", date: "Oct 22", venue: "Example Barn", weddings: "Oct 22", review: GOOGLE_REVIEW_URL });
        expect(m.split("\n").length).toBeLessThanOrEqual(4);
        expect(m.replace(GOOGLE_REVIEW_URL, "").length).toBeLessThan(320);
      }
  });

  it("picks a stable variant per row", () => {
    expect(pickVariant("c-2026-05-21", 3)).toBe(pickVariant("c-2026-05-21", 3));
    const spread = new Set(["a", "b", "c", "d", "e", "f", "g"].map((x) => pickVariant(`c-${x}`, 3)));
    expect(spread.size).toBeGreaterThan(1);
  });
});

describe("year merge", () => {
  const base: ThanksData = { version: 1, reviewLinks: { google: GOOGLE_REVIEW_URL }, couples: [couple], vendors: [vendor], venues: [venue] };
  it("adds an older year without touching the current one", () => {
    const old: ThanksData = { ...base, couples: [{ ...couple, id: "c-2025-06-06", year: 2025, date: "2025-06-06", couple: "Couple C" }], vendors: [], venues: [] };
    const m = mergeYears(base, old, [2025]);
    expect(m.couples.map((c) => c.id)).toEqual(["c-2026-05-21", "c-2025-06-06"]);
    expect(m.vendors).toHaveLength(1);
    expect(yearsOf(m)).toEqual([2026, 2025]);
  });
  it("re-importing a year replaces it", () => {
    const again: ThanksData = { ...base, couples: [{ ...couple, couple: "Benjamin & Anna" }] };
    expect(mergeYears(base, again, [2026]).couples[0].couple).toBe("Benjamin & Anna");
  });
});

describe("already reviewed", () => {
  it("thanks without asking again", () => {
    const m = messageForCouple({ ...couple, reviewed: "Anna left a Google review" }, DEFAULT_TEMPLATES, GOOGLE_REVIEW_URL, 0, "reviewed");
    expect(m).not.toContain(GOOGLE_REVIEW_URL);
    expect(m).toContain("review");
    expect(m).not.toMatch(/[{}]/);
  });
});
