import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import ScrollReveal from "@/components/scroll-reveal";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { BUNDLE, SERVICE_PRICES, usd } from "@/lib/pricing";

const PAGE_URL = "https://dans-events.com/2027";
const TITLE = "The 2027 Full Experience: Host, DJ & Lighting | Dan's Events";
const DESCRIPTION =
  "Hosting (English and Russian), DJ with ceremony sound, stage lighting, spotlights and low fog from one team for $3,500. For our first 10 couples with 2027 weddings. Asheville, NC and beyond.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "The 2027 Full Experience — Dan's Events",
    description:
      "Hosting, music and lights from one team, for one price: $3,500. For our first 10 couples of 2027.",
    url: PAGE_URL,
    siteName: "Dan's Events",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 2027 Full Experience — Dan's Events",
    description: "Hosting, music and lights from one team, for one price: $3,500. For our first 10 couples of 2027.",
  },
};

const INCLUDED = [
  {
    title: "Hosting & MC",
    body: "Your host for the whole night, in English and Russian. I run the introductions, toasts and games, and keep the evening moving so it never drags.",
  },
  {
    title: "Ceremony Sound",
    body: "Sound for your ceremony and your processional music, so every guest hears the vows.",
  },
  {
    title: "DJ for the Dance Party",
    body: "A set built around your crowd and mixed live, from the grand entrance to the last song.",
  },
  {
    title: "Two Wash Lights",
    body: "Soft light on the stage, where the toasts and games happen. It looks good in the room and in your photos.",
  },
  {
    title: "Two Spotlights",
    body: "Beams and aerial effects over the dance floor once the party starts.",
  },
  {
    title: "Low Fog",
    body: "A low cloud that stays on the floor, for your first dance and the big moments.",
  },
];

const QUESTIONS = [
  {
    q: "Who is it for?",
    a: `Couples with a wedding date in 2027. It's limited to our first ${BUNDLE.spots} couples who book it.`,
  },
  {
    q: "Can I add more lights or hours?",
    a: "Not to this package. It's the same for every couple, exactly as listed. If you want a bigger lighting design or a longer night, each service is also available on its own.",
  },
  {
    q: "Do you host in Russian?",
    a: "Yes. I host in English and Russian, and bilingual weddings are some of my favorite nights.",
  },
  {
    q: "How do I hold a spot?",
    a: "Send your date below. I'll call or text you within 24 hours to tell you if it's open and walk you through the next step.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: BUNDLE.name,
  description: DESCRIPTION,
  url: PAGE_URL,
  price: String(BUNDLE.price),
  priceCurrency: "USD",
  availability: "https://schema.org/LimitedAvailability",
  inventoryLevel: { "@type": "QuantitativeValue", maxValue: BUNDLE.spots },
  seller: { "@type": "LocalBusiness", name: "Dan's Events", url: "https://dans-events.com" },
  itemOffered: {
    "@type": "Service",
    name: "Wedding hosting, DJ and lighting package",
    serviceType: "Wedding entertainment",
    provider: { "@type": "LocalBusiness", name: "Dan's Events", url: "https://dans-events.com" },
    areaServed: { "@type": "State", name: "North Carolina" },
  },
};

export default function FullExperience2027Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav current="/2027" />

      <main>
        {/* HERO */}
        <section className="min-h-svh flex flex-col justify-center items-center text-center px-6 pt-28 pb-20 relative overflow-hidden bg-black">
          <Image
            src="/photos/dj-hero.png"
            alt="Dan's Events DJ booth with spotlights over the dance floor at a wedding reception"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="hero-headline relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[3px] sm:tracking-[6px] text-white/60 mb-8">
              For 2027 weddings — first {BUNDLE.spots} couples
            </p>
            <h1 className="text-[clamp(48px,12.5vw,120px)] font-black leading-[0.92] text-white uppercase tracking-[-2px]">
              <span className="block">The 2027</span>
              <span className="block">Full</span>
              <span className="block text-red">Experience</span>
            </h1>
            <p className="text-[clamp(16px,1.8vw,22px)] font-light text-white/80 max-w-[560px] mx-auto leading-[1.6] mt-8">
              Hosting, music and lights from one team, for one price.
            </p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="text-[clamp(44px,6vw,72px)] font-black leading-none text-white tracking-[-1px]">
                {usd(BUNDLE.price)}
              </div>
              <Link
                href="#check-date"
                className="inline-block text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-10 py-5 hover:bg-white hover:text-red transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Check My Date
              </Link>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
          <ScrollReveal className="max-w-[760px] mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/45 mb-6">Why this package</p>
            <h2 className="text-[clamp(28px,4.5vw,52px)] font-black uppercase text-black leading-[1.1] mb-10">
              Thank you for every couple we&apos;ve <em className="not-italic text-red">served.</em>
            </h2>
            <p className="text-[clamp(16px,1.7vw,20px)] font-light text-black/70 leading-[1.8] mb-6">
              Every wedding has taught me something. The nights people still talk about years later have one thing in common: the hosting, the music and the lights were planned together, by one team, as one night.
            </p>
            <p className="text-[clamp(16px,1.7vw,20px)] font-light text-black/70 leading-[1.8] mb-6">
              I want more couples to have that full experience. So for 2027 I put it into one package, at one price, for our first {BUNDLE.spots} couples of the year.
            </p>
            <p className="text-[clamp(16px,1.7vw,20px)] font-light text-black/70 leading-[1.8]">
              It&apos;s our way of saying thank you, and of making 2027 a year of great memories.
            </p>
          </ScrollReveal>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="bg-black py-[clamp(80px,12vw,160px)] px-6">
          <ScrollReveal className="max-w-[700px] mx-auto text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/50 mb-6">What&apos;s included</p>
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1]">
              Ceremony to <em className="not-italic text-red">last dance.</em>
            </h2>
          </ScrollReveal>
          <ul className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08] list-none">
            {INCLUDED.map((item, i) => (
              <li key={item.title} className="bg-black p-[clamp(28px,4vw,48px)]">
                <span className="text-[10px] font-bold tracking-[3px] uppercase text-red block mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(17px,1.8vw,22px)] font-black uppercase text-white mb-4 leading-tight">{item.title}</h3>
                <p className="text-[clamp(14px,1.3vw,16px)] font-light text-white/70 leading-[1.8]">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-[clamp(80px,12vw,160px)] px-6 text-center relative overflow-hidden bg-black">
          <Image
            src="/photos/romantic.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/80" />
          <ScrollReveal className="relative z-10">
            <span aria-hidden="true" className="text-[clamp(72px,10vw,140px)] font-black text-red leading-[0.5] mb-10 block">&ldquo;</span>
            <blockquote className="text-[clamp(18px,2.6vw,34px)] font-light leading-[1.55] text-white max-w-[880px] mx-auto mb-10 italic">
              The lighting transformed the room before the first song played. The sound was full and immersive — present without ever being intrusive. And Dan as a host is something else entirely: he guided the entire evening with such ease that we never once felt the hand.
            </blockquote>
            <div className="text-xs font-bold uppercase tracking-[4px] text-white/60">
              Laura <span className="text-red">/</span> The Lumen House, 2025
            </div>
          </ScrollReveal>
        </section>

        {/* PRICE */}
        <section className="bg-white py-[clamp(80px,12vw,160px)] px-6" id="price">
          <ScrollReveal className="max-w-[640px] mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/45 mb-6 text-center">The price</p>
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.1] mb-12 text-center">
              One team. <em className="not-italic text-red">One price.</em>
            </h2>
            <dl className="border-t border-black/15">
              {SERVICE_PRICES.map((s) => (
                <div key={s.name} className="flex items-baseline justify-between gap-6 py-5 border-b border-black/10">
                  <dt className="text-[clamp(14px,1.5vw,17px)] font-medium text-black/75">
                    {s.name === "Lighting" ? "Lighting package" : s.name}
                  </dt>
                  <dd className="text-[clamp(15px,1.6vw,18px)] font-semibold text-black/75 tabular-nums">{usd(s.price)}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-6 py-5 border-b border-black/15">
                <dt className="text-[clamp(14px,1.5vw,17px)] font-medium text-black/75">Booked separately</dt>
                <dd className="text-[clamp(15px,1.6vw,18px)] font-semibold text-black/75 tabular-nums">{usd(BUNDLE.separately)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-7 bg-black -mx-4 px-4 sm:-mx-6 sm:px-6 mt-4">
                <dt className="text-[clamp(15px,1.8vw,20px)] font-black uppercase text-white tracking-[1px]">{BUNDLE.name}</dt>
                <dd className="text-[clamp(28px,4vw,44px)] font-black text-white tabular-nums leading-none">{usd(BUNDLE.price)}</dd>
              </div>
            </dl>
            <p className="text-[clamp(14px,1.4vw,16px)] font-light text-black/65 leading-[1.8] mt-8">
              Limited to our first {BUNDLE.spots} couples with 2027 wedding dates. The package is the same for everyone, exactly as listed. Lighting in the package is two wash lights, two spotlights and low fog.
            </p>
            <p className="text-[clamp(14px,1.4vw,16px)] font-light text-black/65 leading-[1.8] mt-4">
              Each service is also available on its own.{" "}
              <Link href="/pricing" className="font-medium text-black underline underline-offset-[3px] decoration-red hover:text-red transition-colors">
                See all pricing
              </Link>
            </p>
          </ScrollReveal>
        </section>

        {/* QUESTIONS */}
        <section className="bg-black py-[clamp(80px,12vw,160px)] px-6">
          <ScrollReveal className="max-w-[760px] mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/50 mb-6">Good to know</p>
            <h2 className="text-[clamp(28px,4.5vw,52px)] font-black uppercase text-white leading-[1.1] mb-12">
              Questions <em className="not-italic text-red">couples ask</em>
            </h2>
            <dl className="divide-y divide-white/10 border-y border-white/10">
              {QUESTIONS.map((item) => (
                <div key={item.q} className="py-7">
                  <dt className="text-[clamp(15px,1.6vw,19px)] font-bold uppercase tracking-[1px] text-white mb-3">{item.q}</dt>
                  <dd className="text-[clamp(14px,1.4vw,17px)] font-light text-white/70 leading-[1.8]">{item.a}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </section>

        {/* CHECK YOUR DATE */}
        <section className="bg-red flex flex-col items-center justify-center px-6 py-[clamp(80px,10vw,140px)] scroll-mt-16" id="check-date">
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white text-center mb-5 leading-none tracking-[-2px]">
            Check<br />My Date
          </h2>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/85 text-center max-w-[500px] mb-12 leading-relaxed">
            Tell me your date and venue. If it&apos;s open, one of the {BUNDLE.spots} spots can be yours.
          </p>
          <ContactForm interest={BUNDLE.name} />
          <p className="mt-6 text-[11px] font-normal text-white/75 tracking-[2px] uppercase">
            I respond personally within 24 hours
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
