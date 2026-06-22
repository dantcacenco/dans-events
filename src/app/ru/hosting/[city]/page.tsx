import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RuHostingLocationPage from "@/components/ru-hosting-location-page";
import { ruHostingLocations } from "@/lib/ru-hosting-locations";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return Object.keys(ruHostingLocations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = ruHostingLocations[city];
  if (!data) return {};
  return {
    title: `Ведущий на свадьбу ${data.city}, ${data.stateAbbr} — Dan's Events`,
    description: `Свадебный ведущий и тамада в ${data.city}, ${data.state}. ${data.heroTagline}`,
    alternates: { canonical: `https://dans-events.com/ru/hosting/${data.slug}` },
    openGraph: {
      title: `Ведущий на свадьбу ${data.city} — Dan's Events`,
      description: data.introParagraph.slice(0, 160),
      url: `https://dans-events.com/ru/hosting/${data.slug}`,
      siteName: "Dan's Events",
    },
  };
}

export default async function RuHostingCityPage({ params }: Props) {
  const { city } = await params;
  const data = ruHostingLocations[city];
  if (!data) notFound();
  return <RuHostingLocationPage data={data} />;
}
