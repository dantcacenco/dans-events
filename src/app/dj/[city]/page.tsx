import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DJLocationPage from "@/components/dj-location-page";
import { djLocations } from "@/lib/dj-locations";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return Object.keys(djLocations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = djLocations[city];
  if (!data) return {};

  const title = `Wedding DJ in ${data.city}, ${data.stateAbbr} — Dan's Events`;
  const description = `Asheville-based wedding DJ serving ${data.city}. Curated music, intentional transitions, 40+ five-star reviews. Dan's Events.`;

  return {
    title,
    description,
    keywords: [
      `wedding DJ ${data.city} ${data.stateAbbr}`,
      `${data.city} wedding DJ`,
      `best wedding DJ ${data.city}`,
      `${data.city} wedding music`,
      `${data.state} wedding DJ`,
    ],
    alternates: { canonical: `https://dans-events.com/dj/${city}` },
    openGraph: {
      title,
      description,
      url: `https://dans-events.com/dj/${city}`,
      siteName: "Dan's Events",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export default async function DJCityPage({ params }: Props) {
  const { city } = await params;
  const data = djLocations[city];
  if (!data) notFound();
  return <DJLocationPage data={data} />;
}
