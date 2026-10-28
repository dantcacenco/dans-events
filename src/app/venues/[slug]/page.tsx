import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "@/components/seo/guide-page";
import { PHOTOS, type Photo } from "@/lib/photos";
import { pageMeta, webPageLd } from "@/lib/seo";
import { cityBySlug, cityLabel } from "@/lib/site";
import { VENUES, venueBySlug, venuesInCity } from "@/lib/venues";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return VENUES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = venueBySlug((await params).slug);
  if (!v) return {};
  return pageMeta({ path: `/venues/${v.slug}`, title: v.title, description: v.description });
}

// No photos from these venues yet, so each page shows one of our effects photos, captioned as such.
const EXAMPLE_PHOTOS: Photo[] = [
  PHOTOS.longTableRetro,
  PHOTOS.firstDanceCloud,
  PHOTOS.drapedCeiling,
  PHOTOS.stageWarmBeams,
  PHOTOS.danceBeamsHaze,
  PHOTOS.sparkFountains,
];

export default async function VenuePage({ params }: Props) {
  const v = venueBySlug((await params).slug);
  if (!v) notFound();
  const city = cityBySlug(v.citySlug);
  const idx = VENUES.findIndex((x) => x.slug === v.slug);
  const photo = EXAMPLE_PHOTOS[idx % EXAMPLE_PHOTOS.length];
  const neighbors = venuesInCity(v.citySlug).filter((x) => x.slug !== v.slug);

  // Put the example photo on the lighting section (the third), or the last one.
  const sections = v.sections.map((s, i) =>
    i === Math.min(2, v.sections.length - 1)
      ? { ...s, photo, caption: `Our warm lighting and effects at another wedding, not at ${v.name}. Photos from ${v.name} coming soon.` }
      : s,
  );
  const cityLinks: [string, string][] = city
    ? [
        [`/${city.slug}`, `Weddings in ${cityLabel(city)}`],
        [`/hosting/${city.slug}`, `MC & host in ${city.name}`],
        [`/dj/${city.slug}`, `DJ in ${city.name}`],
        [`/lighting/${city.slug}`, `Lighting in ${city.name}`],
      ]
    : [];

  const placeLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: v.name,
    address: {
      "@type": "PostalAddress",
      ...(v.address ? { streetAddress: v.address } : {}),
      addressLocality: v.town,
      addressRegion: v.state,
      addressCountry: "US",
    },
    ...(v.sources[0] ? { sameAs: v.sources[0].url } : {}),
  };

  return (
    <GuidePage
      current="/venues"
      crumbs={[
        { name: "Venues", href: "/venues" },
        ...(city ? [{ name: cityLabel(city), href: `/${city.slug}` }] : []),
        { name: v.name, href: `/venues/${v.slug}` },
      ]}
      eyebrow={`${v.town}, ${v.state} / ${v.tier === "worked" ? "Venue we have worked" : "Venue guide"}`}
      h1={v.h1}
      lede={v.lede}
      facts={v.facts}
      factsTitle={`${v.name} at a glance`}
      sections={sections}
      faq={v.faq}
      related={[
        ...cityLinks,
        ...neighbors.slice(0, 4).map((n) => [`/venues/${n.slug}`, n.name] as [string, string]),
        ["/special-effects", "Special effects"],
        ["/venues", "All venue guides"],
      ]}
      relatedTitle={city ? `More around ${city.name}` : "Keep reading"}
      sources={v.sources}
      sourcesNote={`Venue facts come from these pages, checked ${v.asOf}. Venues change their rules and spaces, so confirm details with ${v.name} directly.`}
      jsonLd={[
        webPageLd({ path: `/venues/${v.slug}`, name: v.title, description: v.description, about: placeLd }),
      ]}
    />
  );
}
