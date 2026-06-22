import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RuDJLocationPage from "@/components/ru-dj-location-page";
import { ruDjLocations } from "@/lib/ru-dj-locations";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return Object.keys(ruDjLocations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = ruDjLocations[city];
  if (!data) return {};
  return {
    title: `Свадебный диджей ${data.city}, ${data.stateAbbr} — Dan's Events`,
    description: `Свадебный диджей в ${data.city}, ${data.state}. ${data.heroTagline}`,
    alternates: { canonical: `https://dans-events.com/ru/dj/${data.slug}` },
    openGraph: {
      title: `Свадебный диджей ${data.city} — Dan's Events`,
      description: data.introParagraph.slice(0, 160),
      url: `https://dans-events.com/ru/dj/${data.slug}`,
      siteName: "Dan's Events",
    },
  };
}

export default async function RuDJCityPage({ params }: Props) {
  const { city } = await params;
  const data = ruDjLocations[city];
  if (!data) notFound();
  return <RuDJLocationPage data={data} />;
}
