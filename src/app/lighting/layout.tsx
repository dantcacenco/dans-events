import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Wedding Lighting — Dan's Events | Asheville, NC",
  description:
    "Concert-grade wedding lighting serving Asheville NC, Greenville SC, Charlotte NC and beyond. $20K+ rig, warm white palette, architectural uplighting. Most DJs bring a $200 par kit — we don't.",
  keywords: [
    "wedding lighting Asheville NC",
    "wedding uplighting Greenville SC",
    "luxury wedding lighting",
    "wedding lighting designer",
    "cold sparks wedding",
    "wedding lighting Asheville",
  ],
  alternates: { canonical: "https://dans-events.com/lighting" },
  openGraph: {
    title: "Luxury Wedding Lighting — Dan's Events",
    description:
      "Concert-grade wedding lighting. Warm white palette, $20K+ rig, architectural uplighting. Asheville NC, Greenville SC, Charlotte NC.",
    url: "https://dans-events.com/lighting",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Luxury Wedding Lighting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Wedding Lighting — Dan's Events",
    description: "Concert-grade wedding lighting. Warm white palette, $20K+ rig. Asheville NC, Greenville SC, Charlotte NC.",
    images: ["/opengraph-image"],
  },
};

export default function LightingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
