import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dans-events.com"),
  title: "Dan's Events — Wedding DJ & MC | Asheville, NC",
  description:
    "Wedding DJ, MC & luxury lighting serving Asheville NC, Greenville SC, Spartanburg SC, Charlotte NC and beyond. 40+ five-star reviews. Custom-mixed music, concert-grade lighting.",
  keywords: [
    "wedding DJ Asheville NC",
    "wedding DJ Greenville SC",
    "wedding DJ Spartanburg SC",
    "wedding DJ Charlotte NC",
    "wedding MC Asheville",
    "wedding host tamada",
    "wedding lighting Asheville",
    "wedding DJ near me",
    "Dan's Events",
    "luxury wedding entertainment",
  ],
  alternates: {
    canonical: "https://dans-events.com",
  },
  openGraph: {
    title: "Dan's Events — Wedding DJ & MC | Asheville, NC",
    description:
      "Wedding DJ, MC & luxury lighting. 40+ five-star reviews. Serving Asheville NC, Greenville SC, Charlotte NC and beyond.",
    type: "website",
    locale: "en_US",
    url: "https://dans-events.com",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan's Events — Wedding DJ & MC | Asheville, NC",
    description:
      "Wedding DJ, MC & luxury lighting. 40+ five-star reviews. Serving Asheville NC, Greenville SC, Charlotte NC and beyond.",
    images: ["/opengraph-image"],
  },
};

// LocalBusiness + EntertainmentBusiness structured data for Google
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EntertainmentBusiness"],
  name: "Dan's Events",
  description:
    "Wedding DJ, MC & luxury lighting serving Asheville NC, Greenville SC, Spartanburg SC, Charlotte NC and beyond. 40+ five-star Google reviews. Custom-mixed music and concert-grade lighting.",
  url: "https://dans-events.com",
  image: "https://dans-events.com/opengraph-image",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Asheville",
    addressRegion: "NC",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "35.5951",
    longitude: "-82.5515",
  },
  areaServed: [
    { "@type": "City", name: "Asheville", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Greenville", containedInPlace: { "@type": "State", name: "South Carolina" } },
    { "@type": "City", name: "Spartanburg", containedInPlace: { "@type": "State", name: "South Carolina" } },
    { "@type": "City", name: "Columbia", containedInPlace: { "@type": "State", name: "South Carolina" } },
    { "@type": "City", name: "Charlotte", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Hendersonville", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Brevard", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Boone", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Waynesville", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Highlands", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Lake Lure", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Winston-Salem", containedInPlace: { "@type": "State", name: "North Carolina" } },
    { "@type": "City", name: "Knoxville", containedInPlace: { "@type": "State", name: "Tennessee" } },
    { "@type": "City", name: "Gatlinburg", containedInPlace: { "@type": "State", name: "Tennessee" } },
    { "@type": "City", name: "Johnson City", containedInPlace: { "@type": "State", name: "Tennessee" } },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Wedding Entertainment Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wedding DJ",
          description: "Custom-mixed wedding DJ services. Musician since age 4, professional music producer. Every set is built for your crowd.",
          url: "https://dans-events.com/the-dj",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wedding MC & Host",
          description: "Tamada-style wedding hosting. Not announcements — emotional anchoring. The art of making 150 strangers feel like family.",
          url: "https://dans-events.com/the-host",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Luxury Wedding Lighting",
          description: "Concert-grade wedding lighting. $20K+ rig, warm white palette, architectural uplighting, cold sparks. In collaboration with 1919 Lighting.",
          url: "https://dans-events.com/lighting",
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    reviewCount: "40",
  },
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
