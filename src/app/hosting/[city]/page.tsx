import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HostingLocationPage from "@/components/hosting-location-page";
import { hostingLocations } from "@/lib/hosting-locations";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return Object.keys(hostingLocations).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = hostingLocations[city];
  if (!data) return {};

  const title = `Wedding MC & Host in ${data.city}, ${data.stateAbbr} — Dan's Events`;
  const description = `Wedding MC and host serving ${data.city}. The tamada tradition — emotional anchor of your celebration, not someone who reads off a card. Dan's Events.`;

  return {
    title,
    description,
    keywords: [
      `wedding MC ${data.city} ${data.stateAbbr}`,
      `wedding host ${data.city}`,
      `wedding emcee ${data.city}`,
      `${data.city} wedding MC`,
      `ведущий свадьба ${data.city}`,
    ],
    alternates: { canonical: `https://dans-events.com/hosting/${city}` },
    openGraph: {
      title,
      description,
      url: `https://dans-events.com/hosting/${city}`,
      siteName: "Dan's Events",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding MC & Host" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export default async function HostingCityPage({ params }: Props) {
  const { city } = await params;
  const data = hostingLocations[city];
  if (!data) notFound();
  return <HostingLocationPage data={data} />;
}
