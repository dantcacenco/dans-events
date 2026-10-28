import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { FIVE_STAR_COUNT, GOOGLE_REVIEWS, REVIEW_COUNT, REVIEW_RATING, FEATURED_REVIEWS } from "@/lib/reviews";
import { LIGHTING_PAGE_REVIEW } from "@/lib/review-quotes";
import { VENUES, venueForName } from "@/lib/venues";
import { CITIES } from "@/lib/site";
import sitemap from "@/app/sitemap";

describe("reviews", () => {
  it("count and rating match the review list", () => {
    expect(GOOGLE_REVIEWS.length).toBe(REVIEW_COUNT);
    expect(GOOGLE_REVIEWS.filter((r) => r.stars === 5).length).toBe(FIVE_STAR_COUNT);
    const avg = GOOGLE_REVIEWS.reduce((s, r) => s + r.stars, 0) / GOOGLE_REVIEWS.length;
    expect(avg.toFixed(1)).toBe(REVIEW_RATING);
  });

  it("featured reviews are real, written reviews", () => {
    expect(FEATURED_REVIEWS.length).toBeGreaterThanOrEqual(8);
    for (const r of FEATURED_REVIEWS) expect(r.text.length).toBeGreaterThan(40);
  });

  it("the lighting page quote is copied verbatim from the review list", () => {
    const r = GOOGLE_REVIEWS.find((x) => x.name === LIGHTING_PAGE_REVIEW.name);
    expect(r?.text).toBe(LIGHTING_PAGE_REVIEW.text);
  });

  it("the site carries no self-serving rating schema", () => {
    const layout = fs.readFileSync(path.resolve(__dirname, "../../src/app/layout.tsx"), "utf8");
    expect(layout).not.toMatch(/aggregateRating\s*:/);
  });
});

describe("venue guides", () => {
  const slugs = new Set(CITIES.map((c) => c.slug));

  it("every venue is complete and belongs to a city page", () => {
    expect(VENUES.length).toBeGreaterThan(30);
    for (const v of VENUES) {
      expect(slugs.has(v.citySlug), v.slug).toBe(true);
      expect(v.title.length, v.slug).toBeLessThanOrEqual(60);
      expect(v.description.length, v.slug).toBeLessThanOrEqual(160);
      expect(v.sections.length, v.slug).toBeGreaterThanOrEqual(3);
      expect(v.faq.length, v.slug).toBeGreaterThanOrEqual(3);
      expect(v.sources.length, v.slug).toBeGreaterThanOrEqual(1);
      expect(JSON.stringify(v), v.slug).not.toMatch(/[–—]/);
    }
  });

  it("only venues we have worked say we worked there", () => {
    for (const v of VENUES.filter((x) => x.tier === "guide")) {
      expect(JSON.stringify(v), v.slug).not.toMatch(/I hosted|I have (worked|hosted|played)|My team and I have worked/);
    }
  });

  it("city venue lists link to the right guide", () => {
    expect(venueForName("The Omni Grove Park Inn")?.slug).toBe("omni-grove-park-inn");
    expect(venueForName("Biltmore Estate — Antler Hill Barn")?.slug).toBe("biltmore-estate");
    expect(venueForName("Duke Mansion")?.slug).toBe("the-duke-mansion");
    expect(venueForName("Kimpton Tryon Park Hotel")).toBeUndefined();
  });
});

describe("sitemap", () => {
  it("lists every venue guide and city page once", () => {
    const urls = sitemap().map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const v of VENUES) expect(urls).toContain(`https://dans-events.com/venues/${v.slug}`);
    for (const c of CITIES) expect(urls).toContain(`https://dans-events.com/${c.slug}`);
  });
});
