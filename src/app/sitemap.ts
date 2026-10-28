import type { MetadataRoute } from "next";
import { BASE_URL, CITIES, SEO_UPDATED } from "@/lib/site";
import { VENUES } from "@/lib/venues";

// Every public page, generated from the same data the pages use. lastmod is the date the content
// last changed (SEO_UPDATED), not the build time, so search engines can trust it.

type Entry = MetadataRoute.Sitemap[number];
const page = (path: string, priority: number, changeFrequency: Entry["changeFrequency"] = "monthly"): Entry => ({
  url: `${BASE_URL}${path}`,
  lastModified: SEO_UPDATED,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = CITIES.map((c) => c.slug);
  return [
    // Main pages (English)
    page("", 1),
    page("/mc", 0.9),
    page("/dj", 0.9),
    page("/lighting", 0.9),
    page("/pricing", 0.9),
    page("/2027", 0.9, "weekly"),
    page("/the-dj", 0.6),
    page("/the-host", 0.6),

    // Effects and guides
    page("/special-effects", 0.85),
    page("/low-fog", 0.85),
    page("/cold-sparklers", 0.85),
    page("/wedding-uplighting", 0.85),

    // About, proof and hubs
    page("/about", 0.8),
    page("/reviews", 0.8, "weekly"),
    page("/faq", 0.8),
    page("/areas", 0.8),
    page("/venues", 0.8),

    // Main pages (Russian)
    page("/ru", 0.9),
    page("/ru/lighting", 0.8),
    page("/ru/the-dj", 0.8),
    page("/ru/the-host", 0.8),

    // City pages: overview, then host, DJ and lighting, then the Russian versions
    ...slugs.map((s) => page(`/${s}`, 0.8)),
    ...slugs.map((s) => page(`/hosting/${s}`, 0.75)),
    ...slugs.map((s) => page(`/dj/${s}`, 0.75)),
    ...slugs.map((s) => page(`/lighting/${s}`, 0.75)),
    ...slugs.map((s) => page(`/ru/hosting/${s}`, 0.7)),
    ...slugs.map((s) => page(`/ru/dj/${s}`, 0.7)),
    ...slugs.map((s) => page(`/ru/lighting/${s}`, 0.7)),

    // Venue guides
    ...VENUES.map((v) => page(`/venues/${v.slug}`, v.tier === "worked" ? 0.75 : 0.65)),
  ];
}
