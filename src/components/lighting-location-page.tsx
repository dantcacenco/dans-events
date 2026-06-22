import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./scroll-reveal";

export type LightingLocationData = {
  city: string;
  state: string;
  stateAbbr: string;
  slug: string;
  heroTagline: string;
  introParagraph: string;
  regionDescription: string;
  venues: { name: string; location: string; description: string }[];
  nearbyAreas: string[];
  faq: { question: string; answer: string }[];
};

export default function LightingLocationPage({ data }: { data: LightingLocationData }) {
  return (
    <div style={{ background: "#0C0B0D", color: "#fff", fontFamily: "inherit", WebkitFontSmoothing: "antialiased" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] px-6 h-16 flex items-center justify-between" style={{ background: "rgba(12,11,13,0.92)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
        <Link href="/lighting" className="flex items-center gap-0 text-white no-underline">
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">Dan&apos;s Events</span>
          <span className="mx-2.5 text-[11px] font-light" style={{ color: "#BC3021" }}>/</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-white">Lighting</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/lighting#collections" className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 hover:text-white transition-colors no-underline">Collections</Link>
          <Link href="/lighting#process" className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 hover:text-white transition-colors no-underline">Process</Link>
          <Link href="/lighting#inquire" className="text-[11px] font-medium uppercase tracking-[0.24em] no-underline" style={{ color: "#BC3021" }}>Inquire</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/photos/lighting-hero.png"
            alt="Wedding lighting atmosphere"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 100%, rgba(188,48,33,0.18), transparent 70%)" }} />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-6" style={{ color: "#BC3021" }}>
            Atmospheric Wedding Lighting
          </p>
          <h1 className="text-[clamp(42px,11vw,130px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-8">
            {data.city},<br />{data.stateAbbr}
          </h1>
          <p className="text-[clamp(15px,1.8vw,20px)] font-light text-white/70 max-w-[580px] mx-auto leading-relaxed">
            {data.heroTagline}
          </p>
          <div className="mt-12">
            <Link
              href="/lighting#inquire"
              className="inline-block text-white text-[12px] font-bold uppercase tracking-[0.3em] px-10 py-5 no-underline border border-[rgba(188,48,33,0.5)] hover:border-[#BC3021] transition-colors"
            >
              Begin the conversation
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-[clamp(80px,10vw,140px)] px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-6" style={{ color: "#BC3021" }}>The Approach</p>
          <h2 className="text-[clamp(26px,4vw,48px)] font-black uppercase text-white leading-[1.05] mb-8 tracking-[-0.025em]">
            Light that transforms<br /><span style={{ color: "#BC3021" }}>{data.city}</span> venues.
          </h2>
          <p className="text-[clamp(15px,1.6vw,19px)] font-light text-white/60 leading-[1.85] mb-6">
            {data.introParagraph}
          </p>
          <p className="text-[clamp(15px,1.6vw,19px)] font-light text-white/60 leading-[1.85]">
            {data.regionDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* PHOTO BREAK — values image */}
      <section className="relative overflow-hidden" style={{ minHeight: "420px" }}>
        <Image
          src="/photos/lighting-values-desktop.png"
          alt="Wedding lighting atmosphere"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.72)" }} />
        <div className="relative z-10 flex items-center justify-center min-h-[420px] px-6 py-20 text-center">
          <ScrollReveal>
            <p className="text-[clamp(20px,3.5vw,40px)] font-light italic text-white leading-[1.4] max-w-[700px] mx-auto">
              &ldquo;The room your guests walk into sets the tone for every moment that follows. That&rsquo;s not decor. That&rsquo;s light.&rdquo;
            </p>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">Dan&apos;s Events / Lighting</p>
          </ScrollReveal>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section className="py-[clamp(60px,8vw,110px)] px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { n: "i", h: "One palette.", p: "Warm white and white only. Restraint is what reads as elegant in the room — and timeless in every photograph." },
              { n: "ii", h: "Every face.", p: "Warm light is universally flattering. Guests, gowns, flowers, skin — everything looks its best under our design." },
              { n: "iii", h: "Every frame.", p: "Your photographer is only as good as the light we leave them. We give them a room already worth shooting." },
            ].map((item) => (
              <div key={item.n} className="p-10" style={{ background: "#0C0B0D" }}>
                <span className="block text-[11px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: "rgba(188,48,33,0.6)" }}>{item.n}</span>
                <h3 className="text-lg font-black uppercase text-white mb-3 tracking-[-0.01em]">{item.h}</h3>
                <p className="text-sm font-light leading-[1.8]" style={{ color: "rgba(255,255,255,0.42)" }}>{item.p}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* VENUES */}
      <section className="py-[clamp(80px,10vw,140px)] px-6 bg-white">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-4" style={{ color: "#BC3021" }}>Favorite Venues</p>
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em]">
              Our favorite<br />{data.city} venues.
            </h2>
            <p className="mt-6 text-[clamp(14px,1.4vw,17px)] font-light text-black/50 leading-[1.75] max-w-[540px] mx-auto">
              Every space has its own character. I design the light to match — not override — what the venue already offers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {data.venues.map((venue, i) => (
              <ScrollReveal
                key={venue.name}
                className={`p-8 border border-black/[0.06] ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-3" style={{ color: "#BC3021" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-bold text-black mb-1">{venue.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/30 mb-3">{venue.location}</p>
                <p className="text-sm font-light text-black/60 leading-relaxed">{venue.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* PROOF PHOTO + CTA */}
      <section className="relative overflow-hidden">
        <Image
          src="/photos/lighting-proof-desktop.png"
          alt="Wedding lighting design"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.78)" }} />
        <div className="relative z-10 py-[clamp(80px,12vw,160px)] px-6 text-center">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-8" style={{ color: "#BC3021" }}>Now Booking</p>
            <h2 className="text-[clamp(32px,7vw,84px)] font-black uppercase text-white leading-[0.92] tracking-[-0.03em] mb-8 max-w-[14ch] mx-auto">
              Let&apos;s design the room they&apos;ll remember.
            </h2>
            <p className="text-[clamp(14px,1.5vw,18px)] font-light text-white/55 max-w-[44ch] mx-auto leading-[1.8] mb-12">
              Tell us your date, your venue, and the feeling you&apos;re after. We&apos;ll tell you what&apos;s possible.
            </p>
            <Link
              href="/lighting#inquire"
              className="inline-block text-white text-[12px] font-bold uppercase tracking-[0.3em] px-12 py-5 no-underline"
              style={{ border: "1px solid rgba(188,48,33,0.5)" }}
            >
              Begin the conversation
            </Link>
            <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/22">
              We take a limited number of weddings each season &middot; {data.city} dates book fast
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* COLLECTIONS SUMMARY */}
      <section className="py-[clamp(80px,10vw,140px)] px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ScrollReveal className="max-w-[1000px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-4" style={{ color: "#BC3021" }}>The Collections</p>
            <h2 className="text-[clamp(26px,4.5vw,52px)] font-black uppercase text-white leading-[1.05] tracking-[-0.025em]">
              Three ways to light a night.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { name: "The Ambient", price: "from $1,200", desc: "A curated wash of warm and white light. Understated — and never templated." },
              { name: "The Signature", price: "from $2,800", desc: "Full-room transformation with a custom first-dance moment. The collection most couples land on.", featured: true },
              { name: "The Bespoke", price: "from $5,000", desc: "A lighting design composed for every moment — ceremony to last dance. Nothing templated. We design it together." },
            ].map((col) => (
              <div key={col.name} className="p-10 flex flex-col" style={{ background: "#0C0B0D", borderTop: col.featured ? "2px solid #BC3021" : undefined }}>
                <div className="text-xl font-black uppercase text-white tracking-[-0.02em] mb-1">{col.name}</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: "#BC3021" }}>{col.price}</div>
                <p className="text-sm font-light leading-[1.75] mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>{col.desc}</p>
                <Link href="/lighting#collections" className="mt-auto text-[11px] font-semibold uppercase tracking-[0.24em] no-underline" style={{ color: "rgba(255,255,255,0.35)" }}>
                  See details &rarr;
                </Link>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="py-[clamp(80px,10vw,140px)] px-6 bg-white">
        <ScrollReveal className="max-w-[780px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-black uppercase text-black leading-[1.1] mb-14 tracking-[-0.025em]">
            Questions about lighting<br />in {data.city}<span className="inline-block w-3 h-3 ml-2 translate-y-0.5" style={{ background: "#BC3021" }} />
          </h2>
          <div className="divide-y divide-black/[0.08]">
            {data.faq.map((item) => (
              <div key={item.question} className="py-8">
                <h3 className="text-base font-bold text-black mb-3">{item.question}</h3>
                <p className="text-sm font-light text-black/60 leading-[1.85]">{item.answer}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* NEARBY */}
      {data.nearbyAreas.length > 0 && (
        <section className="py-14 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <ScrollReveal className="max-w-[1100px] mx-auto text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 text-white/30">Also serving</p>
            <p className="text-sm font-light text-white/45 leading-relaxed">
              {data.nearbyAreas.join(" · ")}
            </p>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/lighting" className="inline-block mb-4 text-[11px] font-bold uppercase tracking-[0.4em] text-white no-underline">
          Dan&apos;s Events / Lighting
        </Link>
        <div className="text-[11px] font-normal uppercase tracking-[0.5em] text-white/30 mb-6">
          Atmospheric Wedding Lighting &middot; {data.city}, {data.stateAbbr} &amp; beyond
        </div>
        <Link href="/" className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25 no-underline hover:text-white/50 transition-colors">
          &larr; Back to Dan&apos;s Events
        </Link>
        <div className="mt-8 text-[10px] text-white/15 tracking-[0.2em] uppercase">
          &copy; 2026 Dan&apos;s Events. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
