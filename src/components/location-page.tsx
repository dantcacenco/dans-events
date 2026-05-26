import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./scroll-reveal";

export type Venue = {
  name: string;
  location: string;
  description: string;
};

export type LocationData = {
  city: string;
  state: string;
  stateAbbr: string;
  slug: string;
  heroTagline: string;
  introParagraph: string;
  regionDescription: string;
  venues: Venue[];
  nearbyAreas: string[];
  faq: { question: string; answer: string }[];
};

export default function LocationPage({ data }: { data: LocationData }) {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-white/[0.08] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="block">
          <Image
            src="/logos/logo-white-transparent.png"
            alt="Dan's Events"
            width={200}
            height={23}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link href="/#craft" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">The Craft</Link></li>
          <li><Link href="/#services" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Services</Link></li>
          <li><Link href="/#proof" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Proof</Link></li>
          <li><Link href="/#check-date" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Check Your Date</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="min-h-[70vh] bg-red flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="hero-headline">
          <p className="text-[11px] font-medium uppercase tracking-[6px] text-white/60 mb-6">
            Wedding DJ &amp; MC
          </p>
          <h1 className="text-[clamp(36px,10vw,120px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-8">
            {data.city},<br />{data.stateAbbr}
          </h1>
          <p className="text-[clamp(16px,2vw,22px)] font-light text-white/80 max-w-[600px] mx-auto leading-relaxed">
            {data.heroTagline}
          </p>
        </div>
        <div className="hero-location mt-12">
          <Link
            href="/#check-date"
            className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors"
          >
            Check Your Date
          </Link>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-white leading-[1.15] mb-8">
            Your {data.city} Wedding,<br /><em className="not-italic text-red">Elevated</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8] mb-6">
            {data.introParagraph}
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8]">
            {data.regionDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* VENUES */}
      <section className="bg-white py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black mb-6 leading-[1.1]">
              Favorite <em className="not-italic text-red">{data.city}</em> Venues
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/50 leading-[1.7] max-w-[600px] mx-auto">
              I&apos;ve performed at venues across {data.city} and the surrounding {data.stateAbbr} region. Here are some of the area&apos;s finest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {data.venues.map((venue, i) => (
              <ScrollReveal
                key={venue.name}
                className={`p-8 border border-black/[0.06] ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[3px] text-red block mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-black mb-1">{venue.name}</h3>
                <p className="text-xs font-medium uppercase tracking-[2px] text-black/30 mb-3">{venue.location}</p>
                <p className="text-sm font-light text-black/60 leading-relaxed">{venue.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* RED BAND — CTA */}
      <section className="bg-red py-20 px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(28px,6vw,64px)] font-black uppercase text-white leading-[1] mb-6 tracking-[-1px]">
            Getting married in {data.city}?
          </h2>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/70 max-w-[500px] mx-auto mb-10 leading-relaxed">
            Peak season Saturdays book 12+ months in advance. Lock in your date before someone else does.
          </p>
          <Link
            href="/#check-date"
            className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors"
          >
            Check Your Date
          </Link>
        </ScrollReveal>
      </section>

      {/* SERVICES SUMMARY */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[900px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-white leading-[1.15] mb-12 text-center">
            What I <em className="not-italic text-red">bring</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { title: "DJ", desc: `Custom-curated music for your ${data.city} wedding — from the ceremony walk-in to the last dance. Every song choice is intentional.` },
              { title: "MC & Host", desc: "More than announcements. I create moments, connect families, and give every guest a reason to remember this night forever." },
              { title: "Full Night", desc: "Ceremony to send-off, one person running the show. No gaps, no miscommunication, no wondering who's in charge." },
            ].map((s) => (
              <div key={s.title} className="p-8 border border-white/[0.06]">
                <h3 className="text-2xl font-black uppercase text-white mb-4">{s.title}</h3>
                <p className="text-sm font-light text-white/60 leading-[1.8]">{s.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      {data.faq.length > 0 && (
        <section className="bg-white py-[clamp(80px,10vw,140px)] px-6">
          <ScrollReveal className="max-w-[800px] mx-auto">
            <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-black leading-[1.15] mb-12 text-center">
              FAQ<span className="inline-block w-3 h-3 bg-red ml-2 translate-y-0.5" />
            </h2>
            <div className="divide-y divide-black/[0.08]">
              {data.faq.map((item) => (
                <div key={item.question} className="py-8">
                  <h3 className="text-base font-bold text-black mb-3">{item.question}</h3>
                  <p className="text-sm font-light text-black/60 leading-[1.8]">{item.answer}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* NEARBY AREAS */}
      {data.nearbyAreas.length > 0 && (
        <section className="bg-black py-16 px-6 border-t border-white/[0.06]">
          <ScrollReveal className="max-w-[1100px] mx-auto text-center">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Also serving</p>
            <p className="text-sm font-light text-white/50 leading-relaxed">
              {data.nearbyAreas.join(" · ")}
            </p>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
        <Link href="/" className="inline-block mb-4">
          <Image
            src="/logos/logo-white-transparent.png"
            alt="Dan's Events"
            width={200}
            height={23}
            className="h-8 w-auto mx-auto"
          />
        </Link>
        <div className="text-[11px] font-normal uppercase tracking-[6px] text-white/30 mb-8">
          Wedding DJ &amp; MC — Asheville, NC
        </div>
        <div className="text-[10px] text-white/15 tracking-[2px] uppercase">
          &copy; 2026 Dan&apos;s Events. All rights reserved.
        </div>
      </footer>
    </>
  );
}
