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
    "Asheville's premier wedding DJ and MC. 40+ five-star reviews. Hosting your always & forever — from ceremony to last dance.",
  keywords: [
    "wedding DJ Asheville",
    "wedding MC Asheville NC",
    "Asheville wedding entertainment",
    "wedding DJ near me",
    "Dan's Events",
  ],
  alternates: {
    canonical: "https://dans-events.com",
  },
  openGraph: {
    title: "Dan's Events — Wedding DJ & MC | Asheville, NC",
    description:
      "Asheville's premier wedding DJ and MC. 40+ five-star reviews. Hosting your always & forever.",
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
      "Asheville's premier wedding DJ and MC. 40+ five-star reviews. Hosting your always & forever.",
    images: ["/opengraph-image"],
  },
};

// LocalBusiness + Performer structured data for Google
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Performer"],
  name: "Dan's Events",
  description:
    "Wedding DJ and MC serving Asheville, NC and the surrounding Western North Carolina region. 40+ five-star Google reviews.",
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
    "Asheville, NC",
    "Western North Carolina",
    "Hendersonville, NC",
    "Brevard, NC",
    "Waynesville, NC",
    "Lake Lure, NC",
    "Highlands, NC",
    "Boone, NC",
    "Charlotte, NC",
    "Knoxville, TN",
    "Gatlinburg, TN",
    "Greenville, SC",
    "Columbia, SC",
  ],
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
