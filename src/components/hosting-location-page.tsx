import Link from "next/link";
import VenueName from "@/components/seo/venue-name";
import { BreadcrumbBar } from "@/components/seo/breadcrumbs";
import CityLinks from "@/components/seo/city-links";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import ScrollReveal from "./scroll-reveal";

export type HostingLocationData = {
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

export default function HostingLocationPage({ data }: { data: HostingLocationData }) {
  return (
    <>
      {/* NAV */}
      <SiteNav current="" />

      {/* HERO */}
      <section className="min-h-[70vh] bg-red flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[6px] text-white/60 mb-6">
            Wedding MC &amp; Host · Ведущий
          </p>
          <h1 className="text-[clamp(36px,10vw,120px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-8">
            {data.city},<br />{data.stateAbbr}
          </h1>
          <p className="text-[clamp(16px,2vw,22px)] font-light text-white/80 max-w-[600px] mx-auto leading-relaxed">
            {data.heroTagline}
          </p>
          <div className="mt-12">
            <Link href="/#check-date" className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors">
              Check Your Date
            </Link>
          </div>
        </div>
      </section>

      <BreadcrumbBar items={[{ name: "Areas", href: "/areas" }, { name: `${data.city}, ${data.stateAbbr}`, href: `/${data.slug}` }, { name: "MC & host", href: `/hosting/${data.slug}` }]} />

      {/* INTRO */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6 border-t border-white/[0.06]">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-white leading-[1.15] mb-8">
            Your {data.city} wedding,<br /><em className="not-italic text-red">beautifully hosted.</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8] mb-6">
            {data.introParagraph}
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8]">
            {data.regionDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* COMPARISON */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6 border-t border-white/[0.06]">
        <ScrollReveal className="text-center max-w-[700px] mx-auto mb-16">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white mb-6 leading-[1.1]">
            What an MC <em className="not-italic text-red">actually</em> does
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
          <ScrollReveal className="p-[clamp(32px,5vw,60px)] bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 block mb-8">Most MCs</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-light text-white/35">
              &ldquo;OK everyone, please welcome to the dance floor for the first time as husband and wife...&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/20">
              Polite applause. The moment passes.
            </p>
          </ScrollReveal>
          <ScrollReveal className="p-[clamp(32px,5vw,60px)] bg-red">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 block mb-8">Dan&apos;s Events</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-normal text-white">
              &ldquo;Before we bring them in, I need everyone to close their eyes for a moment. Think about the two people you&apos;re here to celebrate tonight — and what it took to get to this room. When you open them, we&apos;re going to give them the welcome they deserve.&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/80">
              <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
              The room erupts. People are on their feet before the doors open.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT I BRING */}
      <section className="bg-white py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[900px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-black leading-[1.15] mb-12 text-center">
            What I <em className="not-italic text-red">bring</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { title: "The Program", desc: "I design the flow of your evening — every transition timed, every moment set up so the next one lands harder than the last." },
              { title: "The Toasts", desc: "I frame every speaker before they speak. By the time they take the mic, the room is already on their side." },
              { title: "The Energy", desc: "I read the room in real time and adjust. I know when to build and when to step back. You never have to manage me." },
            ].map((s) => (
              <div key={s.title} className="p-8 border border-black/[0.06]">
                <h3 className="text-2xl font-black uppercase text-black mb-4">{s.title}</h3>
                <p className="text-sm font-light text-black/60 leading-[1.8]">{s.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* VENUES */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white mb-6 leading-[1.1]">
              Our favorite <em className="not-italic text-red">{data.city}</em> venues.
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-white/45 leading-[1.7] max-w-[600px] mx-auto">
              Every space shapes the program differently. I adapt to the room — not the other way around.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {data.venues.map((venue, i) => (
              <ScrollReveal key={venue.name} className={`p-8 border border-white/[0.06] ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}>
                <span className="text-[10px] font-bold uppercase tracking-[3px] text-red block mb-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-bold text-white mb-1"><VenueName name={venue.name} /></h3>
                <p className="text-xs font-medium uppercase tracking-[2px] text-white/30 mb-3">{venue.location}</p>
                <p className="text-sm font-light text-white/55 leading-relaxed">{venue.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* RED CTA */}
      <section className="bg-red py-20 px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(28px,6vw,64px)] font-black uppercase text-white leading-[1] mb-6 tracking-[-1px]">
            Getting married in {data.city}?
          </h2>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/70 max-w-[500px] mx-auto mb-10 leading-relaxed">
            Peak season Saturdays book 12+ months in advance. Lock in your date before someone else does.
          </p>
          <Link href="/#check-date" className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors">
            Check Your Date
          </Link>
        </ScrollReveal>
      </section>

      {/* FAQ */}
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

      {/* NEARBY */}
      {data.nearbyAreas.length > 0 && (
        <section className="bg-black py-16 px-6 border-t border-white/[0.06]">
          <ScrollReveal className="max-w-[1100px] mx-auto text-center">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Also serving</p>
            <p className="text-sm font-light text-white/50 leading-relaxed">{data.nearbyAreas.join(" · ")}</p>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <CityLinks citySlug={data.slug} current="hosting" />

      <SiteFooter />
    </>
  );
}
