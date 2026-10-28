import type { Metadata } from "next";
import { BASE_URL, CITIES } from "./site";

// Page metadata with canonical, Open Graph and Twitter set the same way everywhere.
export function pageMeta({ path, title, description, image = "/opengraph-image" }: { path: string; title: string; description: string; image?: string }): Metadata {
  const url = `${BASE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Dan's Events", type: "website", locale: "en_US", images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function serviceLd({ name, path, description, serviceType }: { name: string; path: string; description: string; serviceType: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: `${BASE_URL}${path}`,
    provider: { "@id": `${BASE_URL}/#business` },
    areaServed: CITIES.map((c) => ({ "@type": "City", name: `${c.name}, ${c.stateAbbr}` })),
  };
}

export function webPageLd({ path, name, description, type = "WebPage", about }: { path: string; name: string; description: string; type?: string; about?: object }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${BASE_URL}${path}#webpage`,
    url: `${BASE_URL}${path}`,
    name,
    description,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    inLanguage: "en-US",
    ...(about ? { about } : {}),
  };
}
