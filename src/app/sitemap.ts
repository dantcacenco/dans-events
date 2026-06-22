import type { MetadataRoute } from "next";

const BASE_URL = "https://dans-events.com";

const citySlugs = [
  "asheville",
  "boone",
  "brevard",
  "charlotte",
  "columbia-sc",
  "gatlinburg",
  "greensboro",
  "greenville-sc",
  "hendersonville",
  "highlands",
  "johnson-city",
  "knoxville",
  "lake-lure",
  "spartanburg",
  "waynesville",
  "winston-salem",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Main pages (English) ─────────────────────────────────────────────
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/lighting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/the-dj`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/the-host`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },

    // ── Main pages (Russian) ─────────────────────────────────────────────
    { url: `${BASE_URL}/ru`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE_URL}/ru/lighting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/ru/the-dj`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/ru/the-host`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

    // ── Original city landing pages (/asheville, /boone, etc.) ──────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // ── DJ location pages (/dj/[city]) ──────────────────────────────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/dj/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // ── Hosting/MC location pages (/hosting/[city]) ──────────────────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/hosting/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // ── Lighting location pages (/lighting/[city]) ───────────────────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/lighting/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // ── Russian DJ location pages (/ru/dj/[city]) ────────────────────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/ru/dj/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // ── Russian Hosting/MC location pages (/ru/hosting/[city]) ──────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/ru/hosting/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),

    // ── Russian Lighting location pages (/ru/lighting/[city]) ────────────
    ...citySlugs.map((slug) => ({
      url: `${BASE_URL}/ru/lighting/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
