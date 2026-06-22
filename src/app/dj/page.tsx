import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Wedding DJ — Dan's Events | Asheville, NC",
  description:
    "Dan's Events — luxury wedding DJ in Asheville, NC. Not a playlist. A performance. Every transition intentional, every moment earned. 40+ five-star reviews.",
  alternates: { canonical: "https://dans-events.com/dj" },
  openGraph: {
    title: "Wedding DJ — Dan's Events | Asheville, NC",
    description:
      "Not a playlist. A performance. Every transition intentional, every moment earned.",
    url: "https://dans-events.com/dj",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ" }],
  },
};

const FLOW = [
  {
    label: "01",
    title: "Ceremony",
    body: "The processional sets everything. Before a word is spoken, the music tells every guest how to feel. I choose pieces that honor the weight of the moment — and time the final note to land exactly as you reach the altar.",
  },
  {
    label: "02",
    title: "Cocktail Hour",
    body: "Guests are still arriving emotionally. They need music that opens them up, not music that demands attention. I read the room as it fills — watching who's hugging at the bar, who's still nervous, who's already on their second drink — and calibrate accordingly.",
  },
  {
    label: "03",
    title: "Dinner",
    body: "Dinner is a conversation, not a concert. The music should be present without being intrusive — warm enough to fill silence, restrained enough that your grandmother doesn't have to shout. I stay close to the energy, never ahead of it.",
  },
  {
    label: "04",
    title: "Dancing",
    body: "This is where weeks of preparation become visible. I know who's on that floor, what they respond to, and when to shift. The family who loves Sinatra gets their moment. The college friends who need early 2000s hip-hop get theirs. Nobody feels overlooked. Nobody's ready to leave.",
  },
];

export default function DJPage() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-black px-6 h-16 flex items-center justify-between border-b border-white/[0.06]">
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
          {[
            ["/", "Home"],
            ["/mc", "MC & Host"],
            ["/lighting", "Lighting"],
            ["/#check-date", "Check Your Date"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[11px] font-medium uppercase tracking-[2px] text-white/60 hover:text-white transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#check-date"
          className="md:hidden text-[11px] font-semibold uppercase tracking-[2px] text-white bg-red px-4 py-2"
        >
          Book
        </Link>
      </nav>

      {/* HERO */}
      <section className="min-h-svh flex flex-col justify-center items-center text-center px-6 pt-20 pb-16 relative overflow-hidden bg-black">
        <Image
          src="/photos/hero.jpg"
          alt="Dan performing as wedding DJ"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="hero-headline relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-white/45 mb-10">
            Wedding DJ — Dan&apos;s Events
          </p>
          <h1 className="text-[clamp(44px,12vw,140px)] font-black leading-[0.9] text-white uppercase tracking-[-2px]">
            <span className="block">Every</span>
            <span className="block">Transition</span>
            <span className="block">Is A</span>
            <span className="block text-red">Decision.</span>
          </h1>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 max-w-[540px] mx-auto leading-[1.75] mt-10">
            It&apos;s not about playing great songs. It&apos;s about playing the right song at the exact right moment — and knowing the difference.
          </p>
        </div>
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-[60px] bg-white/30 z-10" />
      </section>

      {/* THE DIFFERENCE — split */}
      <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[80vh]">
        <ScrollReveal direction="left" className="bg-white p-[clamp(48px,8vw,120px)] flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 mb-6">The Difference</p>
          <h2 className="text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.15] uppercase mb-8 text-black">
            This isn&apos;t a playlist.<br />It&apos;s a <em className="not-italic text-red">performance.</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-normal text-black/70 leading-[1.75] mb-5 max-w-[500px]">
            Anyone can queue songs. What I do is different. Weeks before your wedding, I learn your crowd — who&apos;s in the room, what they love, what they&apos;ll resist, and where the unexpected moments are going to come from.
          </p>
          <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/55 leading-[1.8] max-w-[500px]">
            On the night, I don&apos;t execute a playlist. I read a room. I notice the energy shift when the entrées arrive. I catch the moment grandma gets up — and I lean into it. Every transition is a conscious choice, not a scheduled event.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="right" className="relative overflow-hidden min-h-[50vh] md:min-h-[400px] order-[-1] md:order-none bg-warm-taupe">
          <Image
            src="/photos/craft.jpg"
            alt="Dan at the DJ setup"
            fill
            className="object-cover grayscale hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          <div className="absolute bottom-10 -right-5 w-[200px] h-1.5 bg-red z-[2]" />
        </ScrollReveal>
      </section>

      {/* THE FLOW */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6">
        <ScrollReveal className="text-center max-w-[700px] mx-auto mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">The Flow</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1]">
            Four moments.<br />One <em className="not-italic text-red">vision.</em>
          </h2>
          <p className="text-[clamp(14px,1.4vw,18px)] font-light text-white/50 leading-[1.7] mt-6 max-w-[520px] mx-auto">
            A wedding reception isn&apos;t one continuous event. It&apos;s four distinct movements — each with its own energy target, its own emotional purpose, its own demands on the person behind the music.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto gap-px bg-white/[0.06] border border-white/[0.06]">
          {FLOW.map((item) => (
            <ScrollReveal key={item.label} className="bg-black p-[clamp(36px,5vw,64px)]">
              <span className="text-[10px] font-bold tracking-[4px] uppercase text-red/60 block mb-5">{item.label}</span>
              <h3 className="text-[clamp(22px,3vw,36px)] font-black uppercase text-white mb-5 leading-none">{item.title}</h3>
              <p className="text-[clamp(14px,1.3vw,17px)] font-light text-white/60 leading-[1.8]">{item.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* THE PREPARATION */}
      <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-start">
          <ScrollReveal direction="left">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 mb-6">The Preparation</p>
            <h2 className="text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.15] uppercase mb-8 text-black">
              The work starts<br />weeks <em className="not-italic text-red">before</em> the night.
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/60 leading-[1.8] mb-5">
              We have a detailed conversation about your crowd — not just a genre checklist. I want to know that the bride&apos;s parents met at a Fleetwood Mac concert. That the groom&apos;s college roommates will lose it for one specific era of hip-hop. That there&apos;s one song that absolutely cannot play.
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/60 leading-[1.8]">
              I build a musical map of your room before I arrive. So when grandma surprises everyone on the dance floor, I&apos;m already two steps ahead of the moment — not reacting to it.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" className="space-y-8">
            {[
              { step: "01", title: "The Discovery Call", body: "We talk through your people, your vibe, your story. Not a form. A real conversation that tells me what this night needs to feel like." },
              { step: "02", title: "The Musical Map", body: "I build a layered picture of your crowd: who they are, what they love, where the surprising moments will come from. Then I structure a musical arc around it." },
              { step: "03", title: "The Night", body: "I arrive with a plan and the instinct to abandon it when something better happens. The preparation just means I can trust my gut when it counts." },
            ].map((s) => (
              <div key={s.step} className="flex gap-6">
                <span className="text-[clamp(28px,4vw,48px)] font-black text-red/25 leading-none flex-shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-[clamp(14px,1.5vw,18px)] font-bold uppercase tracking-[1px] text-black mb-2">{s.title}</h3>
                  <p className="text-[clamp(13px,1.3vw,16px)] font-light text-black/55 leading-[1.8]">{s.body}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="bg-red py-[clamp(60px,8vw,100px)] px-6">
        <ScrollReveal className="max-w-[900px] mx-auto">
          <p className="text-[clamp(20px,3.5vw,40px)] font-black uppercase leading-[1.2] text-white">
            No single point of failure. Backup for every critical piece of gear. Professional-grade audio designed for the room — not just pointed at the ceiling.
          </p>
          <p className="mt-6 text-[clamp(13px,1.3vw,16px)] font-light text-white/65 leading-[1.75] max-w-[600px]">
            I show up early, set up quietly, and disappear into the background until the moment calls for something. When it does, it&apos;s there.
          </p>
        </ScrollReveal>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-[clamp(80px,12vw,160px)] px-6 text-center relative overflow-hidden bg-black">
        <Image
          src="/photos/romantic.jpg"
          alt="Wedding couple dancing"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80" />
        <span className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[60px] h-0.5 bg-red z-10" />
        <span className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[60px] h-0.5 bg-red z-10" />
        <ScrollReveal className="relative z-10">
          <span className="text-[clamp(80px,12vw,160px)] font-black text-red leading-[0.5] mb-10 block">&ldquo;</span>
          <p className="text-[clamp(18px,2.8vw,36px)] font-light leading-[1.5] text-white max-w-[860px] mx-auto mb-10 italic">
            The sound was full and immersive — present without ever being intrusive. The dance floor never emptied. People were still out there at midnight who swore they weren&apos;t going to dance.
          </p>
          <div className="text-xs font-bold uppercase tracking-[4px] text-white/40">
            Laura <span className="text-red">/</span> The Lumen House, 2025
          </div>
        </ScrollReveal>
      </section>

      {/* COLLABORATION BRIDGE → MC */}
      <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08] border border-black/[0.08]">
          <ScrollReveal direction="left" className="bg-white p-[clamp(40px,6vw,80px)]">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 mb-6">The Full Experience</p>
            <h2 className="text-[clamp(24px,3.5vw,44px)] font-black uppercase leading-[1.1] text-black mb-8">
              The DJ and the MC<br />move as <em className="not-italic text-red">one.</em>
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/60 leading-[1.8] mb-5">
              When the person behind the music is also the person holding the mic, there are no handoffs. No moments where the energy falls into a gap between two vendors who&apos;ve never worked together.
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/60 leading-[1.8] mb-10">
              I know exactly what&apos;s coming next on the mic — so I can set the music underneath it perfectly. I know exactly what the room just felt — so when I take the mic, I&apos;m continuing a story, not starting a new one.
            </p>
            <Link
              href="/mc"
              className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[3px] text-black hover:text-red transition-colors"
            >
              Explore the MC & Host experience <span className="text-red">→</span>
            </Link>
          </ScrollReveal>
          <ScrollReveal direction="right" className="bg-black p-[clamp(40px,6vw,80px)] flex flex-col justify-center">
            <p className="text-[clamp(18px,2.5vw,30px)] font-black uppercase text-white leading-[1.2] mb-6">
              &ldquo;You never felt the hand behind the evening.&rdquo;
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-white/55 leading-[1.8]">
              That&apos;s the goal. When DJ and MC are the same vision — the same person who did the prep, built the arc, knows your story — the night just flows. Your guests experience it as seamless. It&apos;s the opposite of seamless. It&apos;s intensely intentional.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white mb-5 leading-none tracking-[-2px]">
            Check<br />Your Date
          </h2>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/70 max-w-[460px] mx-auto mb-10 leading-relaxed">
            Peak season Saturdays book 12+ months in advance. If you have a date in mind, the first step is finding out if it&apos;s available.
          </p>
          <Link
            href="/#check-date"
            className="inline-block text-[11px] font-bold uppercase tracking-[3px] text-white border border-white/40 px-10 py-5 hover:bg-white hover:text-red transition-colors"
          >
            Check Availability
          </Link>
          <p className="mt-6 text-[11px] font-normal text-white/50 tracking-[2px] uppercase">
            I respond personally within 24 hours
          </p>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
        <Link href="/" className="inline-block mb-4">
          <Image
            src="/logos/logo-white-transparent.png"
            alt="Dan's Events"
            width={200}
            height={23}
            className="h-8 w-auto mx-auto opacity-80"
          />
        </Link>
        <div className="text-[11px] font-normal uppercase tracking-[6px] text-white/30 mb-10">
          Wedding DJ &amp; MC — Asheville, NC
        </div>
        <ul className="flex justify-center gap-10 list-none mb-10 flex-wrap">
          {[
            ["/", "Home"],
            ["/mc", "MC & Host"],
            ["/lighting", "Lighting"],
            ["/#proof", "Reviews"],
            ["/#check-date", "Book"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-[11px] font-medium uppercase tracking-[2px] text-white/35 hover:text-red transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-[10px] text-white/15 tracking-[2px] uppercase">
          &copy; 2026 Dan&apos;s Events. Asheville, NC. All rights reserved.
        </div>
      </footer>
    </>
  );
}
