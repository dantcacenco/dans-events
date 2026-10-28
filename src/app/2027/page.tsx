import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import ScrollReveal from "@/components/scroll-reveal";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { BUNDLE, SERVICE_PRICES, usd } from "@/lib/pricing";

const PAGE_URL = "https://dans-events.com/2027";
const TITLE = "2027 Wedding Package: Host, DJ & Lighting | Dan's Events";
const SAVINGS = BUNDLE.separately - BUNDLE.price;
const DESCRIPTION = `Hosting (English and Russian), DJ with ceremony sound, two wash lights, two spotlights and low fog from one team for ${usd(BUNDLE.price)} instead of ${usd(BUNDLE.separately)} booked separately. For our first ${BUNDLE.spots} couples with 2027 weddings. Asheville, NC and beyond.`;
const SHORT_DESCRIPTION = `Hosting, music and lights from one team: ${usd(BUNDLE.price)} instead of ${usd(BUNDLE.separately)}. For our first ${BUNDLE.spots} couples of 2027.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "The 2027 Full Experience — Dan's Events",
    description: SHORT_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Dan's Events",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 2027 Full Experience — Dan's Events",
    description: SHORT_DESCRIPTION,
  },
};

const [HOSTING, DJ, LIGHTING] = SERVICE_PRICES;

// One block per service, text and photo alternating sides. Photos: 1919 Lighting.
const SERVICES = [
  {
    title: "Hosting & MC",
    service: HOSTING,
    body: "Your host for the whole night, in English and Russian. I run the grand entrance, the toasts and the games, and keep the evening moving so it never drags.",
    photo: { src: "/photos/2027/hosting-mic.jpg", width: 1080, height: 1351, alt: "Wedding host speaking into a microphone under string lights and stage beams" },
  },
  {
    title: "DJ & Ceremony Sound",
    service: DJ,
    body: "Sound for your ceremony and processional, so every guest hears the vows. Then a set built around your crowd and mixed live, from the first dance to the last song.",
    photo: { src: "/photos/2027/dance-floor.jpg", width: 914, height: 1218, alt: "Wedding guests dancing on a crowded dance floor under a starburst of light" },
  },
  {
    title: "Lighting & Low Fog",
    service: LIGHTING,
    body: "Two wash lights on the stage for the toasts and your photos, two spotlights with beams over the dance floor, and low fog that stays on the floor for your first dance.",
    photo: { src: "/photos/2027/low-fog.jpg", width: 1080, height: 1440, alt: "Couple's first dance on a cloud of low fog, lit by two wash lights" },
  },
];

const INCLUDED = [
  "Hosting & MC in English and Russian",
  "Ceremony sound",
  "DJ for the reception and dance party",
  "Two wash lights",
  "Two spotlights",
  "Low fog",
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
      <SiteNav current="/2027" ctaHref="#check-date" />

      <main>
        {/* HERO */}
        <section className="bg-black pt-[clamp(140px,16vw,200px)] pb-[clamp(72px,10vw,128px)] px-6 text-center">
          <div className="hero-headline">
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
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex items-baseline justify-center gap-5 tabular-nums">
                <span className="text-[clamp(22px,2.6vw,32px)] font-semibold text-white/50">
                  <span className="sr-only">Booked separately: </span>
                  <s className="decoration-red decoration-2">{usd(BUNDLE.separately)}</s>
                </span>
                <span className="text-[clamp(44px,6vw,72px)] font-black leading-none text-white tracking-[-1px]">
                  <span className="sr-only">The 2027 Full Experience: </span>
                  {usd(BUNDLE.price)}
                </span>
              </div>
              <p className="text-[clamp(14px,1.4vw,16px)] font-light text-white/70">You save {usd(SAVINGS)}.</p>
              <Link
                href="#check-date"
                className="mt-5 inline-block text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-10 py-5 hover:bg-white hover:text-red transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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

        {/* WHAT'S INCLUDED: one block per service, alternating sides */}
        <section className="bg-black pt-[clamp(80px,12vw,160px)] pb-[clamp(40px,6vw,80px)] px-6">
          <ScrollReveal className="max-w-[700px] mx-auto text-center mb-[clamp(48px,7vw,96px)]">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/50 mb-6">What&apos;s included</p>
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1]">
              Ceremony to <em className="not-italic text-red">last dance.</em>
            </h2>
          </ScrollReveal>
          <ol className="max-w-[1100px] mx-auto list-none flex flex-col gap-[clamp(56px,8vw,112px)]">
            {SERVICES.map((item, i) => {
              const photoRight = i % 2 === 0;
              return (
                <li key={item.title} className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(28px,5vw,80px)] items-center">
                  <ScrollReveal
                    direction={photoRight ? "right" : "left"}
                    className={`relative aspect-[4/5] w-full max-w-[480px] mx-auto overflow-hidden ${photoRight ? "md:order-2" : ""}`}
                  >
                    <Image
                      src={item.photo.src}
                      alt={item.photo.alt}
                      fill
                      sizes="(min-width: 1100px) 480px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover object-center"
                    />
                  </ScrollReveal>
                  <ScrollReveal direction={photoRight ? "left" : "right"} className={photoRight ? "md:order-1" : ""}>
                    <span className="block text-[clamp(56px,7vw,96px)] font-black text-red leading-none tracking-[-2px] mb-6 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[clamp(24px,3vw,40px)] font-black uppercase text-white leading-[1.1] mb-5">{item.title}</h3>
                    <div className="flex items-baseline gap-3 mb-6">
                      {item.service.from && <span className="text-[12px] font-semibold uppercase tracking-[2px] text-white/60">From</span>}
                      <span className="text-[clamp(32px,3.6vw,44px)] font-black text-white leading-none tabular-nums">{usd(item.service.price)}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[2px] text-white/45">On its own</span>
                    </div>
                    <p className="text-[clamp(15px,1.5vw,18px)] font-light text-white/70 leading-[1.8] max-w-[460px]">{item.body}</p>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </section>

        {/* THE PACKAGE */}
        <section className="bg-black pt-[clamp(40px,6vw,80px)] pb-[clamp(80px,12vw,160px)] px-6" id="price">
          <ScrollReveal className="max-w-[1100px] mx-auto bg-white p-[clamp(32px,6vw,80px)] grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-[clamp(40px,6vw,96px)] items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/45 mb-6">All three together</p>
              <h2 className="text-[clamp(28px,4.5vw,52px)] font-black uppercase text-black leading-[1.1] mb-8">
                The 2027 Full <em className="not-italic text-red">Experience</em>
              </h2>
              <ul className="list-none border-t border-black/10">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-baseline gap-4 py-3 border-b border-black/10 text-[clamp(14px,1.4vw,17px)] font-medium text-black/75">
                    <span aria-hidden="true" className="text-red font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[2px] text-black/50 mb-2">Booked separately</p>
              <p className="text-[clamp(24px,2.8vw,34px)] font-semibold text-black/45 tabular-nums mb-6">
                <s className="decoration-red decoration-2">{usd(BUNDLE.separately)}</s>
              </p>
              <p className="text-[12px] font-semibold uppercase tracking-[2px] text-black/50 mb-2">The package</p>
              <p className="text-[clamp(56px,7vw,88px)] font-black text-black leading-none tracking-[-2px] tabular-nums mb-4">{usd(BUNDLE.price)}</p>
              <p className="text-[clamp(15px,1.6vw,19px)] font-semibold text-red mb-8">You save {usd(SAVINGS)}.</p>
              <Link
                href="#check-date"
                className="inline-block text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-10 py-5 hover:bg-black transition-colors"
              >
                Check My Date
              </Link>
              <p className="text-[clamp(13px,1.3vw,15px)] font-light text-black/60 leading-[1.7] mt-8">
                Limited to our first {BUNDLE.spots} couples with 2027 wedding dates. The package is the same for everyone, exactly as listed.
              </p>
              <p className="text-[clamp(13px,1.3vw,15px)] font-light text-black/60 leading-[1.7] mt-3">
                Each service is also available on its own.{" "}
                <Link href="/pricing" className="font-medium text-black underline underline-offset-[3px] decoration-red hover:text-red transition-colors">
                  See all pricing
                </Link>
              </p>
            </div>
          </ScrollReveal>
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
