import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LightingLocationPage from "@/components/lighting-location-page";
import { lightingLocations } from "@/lib/lighting-locations";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return Object.keys(lightingLocations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = lightingLocations[city];
  if (!data) return {};

  const title = `Wedding Lighting in ${data.city}, ${data.stateAbbr} — Dan's Events`;
  const description = `Atmospheric wedding lighting for ${data.city} venues. Warm-white palette, restrained and elegant. Transforms the room — and every photograph. Dan's Events Lighting.`;

  return {
    title,
    description,
    keywords: [
      `wedding lighting ${data.city} ${data.stateAbbr}`,
      `${data.city} wedding uplighting`,
      `${data.city} wedding atmosphere lighting`,
      `wedding lighting designer ${data.city}`,
      `${data.state} wedding lighting`,
    ],
    alternates: {
      canonical: `https://dans-events.com/lighting/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://dans-events.com/lighting/${city}`,
      siteName: "Dan's Events",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding Lighting" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function LightingCityPage({ params }: Props) {
  const { city } = await params;
  const data = lightingLocations[city];
  if (!data) notFound();
  return <LightingLocationPage data={data} />;
}
