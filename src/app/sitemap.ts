import type { MetadataRoute } from "next";

const BASE_URL = "https://dans-events.com";

const locationSlugs = [
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
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/lighting`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...locationSlugs.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
