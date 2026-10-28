import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

import { BASE_URL, CITIES, FACTS } from "@/lib/site";
import { REVIEW_COUNT, REVIEW_RATING } from "@/lib/reviews";
import { BUNDLE, SERVICE_PRICES } from "@/lib/pricing";

const SITE_TITLE = "Dan's Events: Wedding MC, DJ & Lighting, Asheville NC";
const SITE_DESCRIPTION = `Wedding host (MC) in English and Russian, DJ, warm lighting, low fog and cold sparks from one Asheville team. Rated ${REVIEW_RATING} from ${REVIEW_COUNT} Google reviews.`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: BASE_URL,
    languages: { "en-US": BASE_URL, "ru-RU": `${BASE_URL}/ru` },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events: wedding MC, DJ and lighting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

// Site-wide structured data: the business, its owner and the website.
// No aggregateRating or Review markup on purpose: Google treats self-serving review markup on a
// LocalBusiness as ineligible (and possibly spam). The real Google rating is shown as visible text instead.
const servicePrice = (href: string) => SERVICE_PRICES.find((s) => s.href === href)!;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "EntertainmentBusiness"],
      "@id": `${BASE_URL}/#business`,
      name: "Dan's Events",
      description:
        "Wedding entertainment from Asheville, NC: a wedding host (MC, tamada) in English and Russian, DJ and ceremony sound, warm-white wedding lighting, low fog and cold spark effects, planned and run by one team.",
      url: BASE_URL,
      image: `${BASE_URL}/opengraph-image`,
      logo: `${BASE_URL}/logos/logo-black-transparent.png`,
      founder: { "@id": `${BASE_URL}/#dan` },
      employee: { "@id": `${BASE_URL}/#dan` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Asheville",
        addressRegion: "NC",
        addressCountry: "US",
      },
      geo: { "@type": "GeoCoordinates", latitude: "35.5951", longitude: "-82.5515" },
      areaServed: CITIES.map((c) => ({
        "@type": "City",
        name: c.name,
        containedInPlace: { "@type": "State", name: c.state },
      })),
      knowsLanguage: FACTS.languages,
      sameAs: [FACTS.googleProfileUrl],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Wedding entertainment services",
        itemListElement: [
          {
            "@type": "Offer",
            price: String(servicePrice("/mc").price),
            priceCurrency: "USD",
            itemOffered: { "@type": "Service", name: "Wedding MC & host (English and Russian)", url: `${BASE_URL}/mc` },
          },
          {
            "@type": "Offer",
            price: String(servicePrice("/dj").price),
            priceCurrency: "USD",
            itemOffered: { "@type": "Service", name: "Wedding DJ & ceremony sound", url: `${BASE_URL}/dj` },
          },
          {
            "@type": "Offer",
            priceSpecification: { "@type": "PriceSpecification", minPrice: String(servicePrice("/lighting").price), priceCurrency: "USD" },
            itemOffered: { "@type": "Service", name: "Wedding lighting", url: `${BASE_URL}/lighting` },
          },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Low fog (dancing on a cloud)", url: `${BASE_URL}/low-fog` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cold spark machines", url: `${BASE_URL}/cold-sparklers` } },
          {
            "@type": "Offer",
            name: BUNDLE.name,
            url: `${BASE_URL}${BUNDLE.path}`,
            price: String(BUNDLE.price),
            priceCurrency: "USD",
            availability: "https://schema.org/LimitedAvailability",
            itemOffered: { "@type": "Service", name: "Wedding hosting, DJ & lighting package", url: `${BASE_URL}${BUNDLE.path}` },
          },
        ],
      },
      priceRange: "$$",
      subOrganization: { "@id": "https://www.1919.lighting/#business" },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#dan`,
      name: FACTS.owner,
      jobTitle: "Wedding host (MC) and DJ",
      worksFor: [{ "@id": `${BASE_URL}/#business` }, { "@id": "https://dans-music.studio/#business" }],
      knowsLanguage: FACTS.languages,
      url: `${BASE_URL}/about`,
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Dan's Events",
      publisher: { "@id": `${BASE_URL}/#business` },
      inLanguage: ["en-US", "ru-RU"],
    },
  ],
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
