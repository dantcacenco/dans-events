import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RuLightingLocationPage from "@/components/ru-lighting-location-page";
import { ruLightingLocations } from "@/lib/ru-lighting-locations";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return Object.keys(ruLightingLocations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = ruLightingLocations[city];
  if (!data) return {};
  return {
    title: `Свадебное освещение ${data.city}, ${data.stateAbbr} — Dan's Events`,
    description: `Атмосферное свадебное освещение в ${data.city}, ${data.state}. ${data.heroTagline}`,
    alternates: { canonical: `https://dans-events.com/ru/lighting/${data.slug}` },
    openGraph: {
      title: `Свадебное освещение ${data.city} — Dan's Events`,
      description: data.introParagraph.slice(0, 160),
      url: `https://dans-events.com/ru/lighting/${data.slug}`,
      siteName: "Dan's Events",
    },
  };
}

export default async function RuLightingCityPage({ params }: Props) {
  const { city } = await params;
  const data = ruLightingLocations[city];
  if (!data) notFound();
  return <RuLightingLocationPage data={data} />;
}
