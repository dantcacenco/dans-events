import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import ScrollReveal from "@/components/scroll-reveal";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { BUNDLE, SERVICE_PRICES, usd } from "@/lib/pricing";

const PAGE_URL = "https://dans-events.com/pricing";
const DESCRIPTION =
  "Wedding hosting and MC (English and Russian) $1,800. DJ with ceremony sound $1,500. Lighting from $1,500. Clear prices from Dan's Events in Asheville, NC.";

export const metadata: Metadata = {
  title: "Pricing: Wedding MC, DJ & Lighting | Dan's Events, Asheville NC",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Pricing — Dan's Events",
    description: "Hosting & MC $1,800. DJ & ceremony sound $1,500. Lighting from $1,500.",
    url: PAGE_URL,
    siteName: "Dan's Events",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Dan's Events pricing",
  url: PAGE_URL,
  itemListElement: [
    ...SERVICE_PRICES.map((s) => ({
      "@type": "Offer",
      name: s.name,
      url: `https://dans-events.com${s.href}`,
      priceCurrency: "USD",
      ...(s.from
        ? { priceSpecification: { "@type": "PriceSpecification", minPrice: String(s.price), priceCurrency: "USD" } }
        : { price: String(s.price) }),
      itemOffered: { "@type": "Service", name: `Wedding ${s.name}` },
    })),
    {
      "@type": "Offer",
      name: BUNDLE.name,
      url: `https://dans-events.com${BUNDLE.path}`,
      price: String(BUNDLE.price),
      priceCurrency: "USD",
      availability: "https://schema.org/LimitedAvailability",
      itemOffered: { "@type": "Service", name: "Wedding hosting, DJ and lighting package" },
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav current="/pricing" />

      <main>
        {/* HEADER */}
        <section className="bg-black pt-[clamp(140px,16vw,200px)] pb-[clamp(56px,8vw,96px)] px-6 text-center">
          <p className="hero-location text-[11px] font-semibold uppercase tracking-[3px] sm:tracking-[6px] text-white/60 mb-8">
            Dan&apos;s Events — Asheville, NC
          </p>
          <h1 className="hero-headline text-[clamp(48px,11vw,130px)] font-black leading-[0.9] text-white uppercase tracking-[-2px]">
            Pricing
          </h1>
          <p className="text-[clamp(16px,1.8vw,21px)] font-light text-white/75 max-w-[560px] mx-auto leading-[1.7] mt-8">
            Every service is available on its own, with the price listed, so you can compare and choose what fits your day.
          </p>
        </section>

        {/* SERVICES */}
        <section className="bg-black pb-[clamp(80px,12vw,160px)] px-6">
          <ul className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08] list-none">
            {SERVICE_PRICES.map((s, i) => (
              <li key={s.name} className="bg-black p-[clamp(32px,4vw,52px)] flex flex-col">
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-red block mb-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[clamp(20px,2vw,26px)] font-black uppercase text-white leading-tight mb-5">{s.name}</h2>
                <div className="flex items-baseline gap-2 mb-6">
                  {s.from && <span className="text-[12px] font-semibold uppercase tracking-[2px] text-white/60">From</span>}
                  <span className="text-[clamp(40px,4.5vw,56px)] font-black text-white leading-none tabular-nums">{usd(s.price)}</span>
                </div>
                <p className="text-[clamp(14px,1.3vw,16px)] font-light text-white/70 leading-[1.8]">{s.desc}</p>
                {s.note && <p className="text-[clamp(14px,1.3vw,16px)] font-medium text-white/85 leading-[1.8] mt-3">{s.note}</p>}
                <Link
                  href={s.href}
                  className="mt-auto pt-8 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[3px] text-white hover:text-red transition-colors"
                >
                  {s.linkLabel} <span className="text-red" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 2027 PACKAGE */}
        <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
          <ScrollReveal className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-[clamp(40px,6vw,96px)] items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/45 mb-6">For 2027 weddings</p>
              <h2 className="text-[clamp(28px,4.5vw,52px)] font-black uppercase text-black leading-[1.1] mb-8">
                The 2027 Full <em className="not-italic text-red">Experience</em>
              </h2>
              <p className="text-[clamp(15px,1.6vw,19px)] font-light text-black/70 leading-[1.8] mb-5">
                Hosting, DJ with ceremony sound, two wash lights, two spotlights and low fog, all from one team for one price.
              </p>
              <p className="text-[clamp(15px,1.6vw,19px)] font-light text-black/70 leading-[1.8]">
                For our first {BUNDLE.spots}{" "}couples of 2027, as a thank-you for every couple we&apos;ve served.
              </p>
            </div>
            <div className="bg-black p-[clamp(32px,4vw,52px)]">
              <div className="flex items-baseline justify-between gap-4 pb-5 border-b border-white/15">
                <span className="text-[14px] font-medium text-white/70">Booked separately</span>
                <span className="text-[17px] font-semibold text-white/70 tabular-nums">{usd(BUNDLE.separately)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-5 mb-8">
                <span className="text-[15px] font-black uppercase tracking-[1px] text-white">2027 Full Experience</span>
                <span className="text-[clamp(32px,4vw,44px)] font-black text-white tabular-nums leading-none">{usd(BUNDLE.price)}</span>
              </div>
              <Link
                href={BUNDLE.path}
                className="block text-center text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-8 py-5 hover:bg-white hover:text-red transition-colors"
              >
                See the 2027 package
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* CHECK YOUR DATE */}
        <section className="bg-red flex flex-col items-center justify-center px-6 py-[clamp(80px,10vw,140px)] scroll-mt-16" id="check-date">
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white text-center mb-5 leading-none tracking-[-2px]">
            Check<br />My Date
          </h2>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/85 text-center max-w-[500px] mb-12 leading-relaxed">
            Most couples who reach out wish they&apos;d done it sooner. Peak season Saturdays book 12+ months in advance.
          </p>
          <ContactForm />
          <p className="mt-6 text-[11px] font-normal text-white/75 tracking-[2px] uppercase">
            I respond personally within 24 hours
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
