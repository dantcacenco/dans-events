import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "The DJ — Dan's Events | Wedding DJ Asheville NC",
  description: "Dan has been a musician since age 4 and a professional music producer. His DJ sets are custom-mixed, never templated. Learn what separates a musician-DJ from a playlist service.",
  alternates: { canonical: "https://dans-events.com/the-dj" },
  openGraph: {
    title: "The DJ — Dan's Events",
    description: "Custom mixing, concert-quality sound, and 20 years of reading rooms. Not a playlist. A performance.",
    url: "https://dans-events.com/the-dj",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — The DJ" }],
  },
  twitter: { card: "summary_large_image", title: "The DJ — Dan's Events", description: "Custom mixing, concert-quality sound, 20 years of reading rooms.", images: ["/opengraph-image"] },
};

export default function TheDJPage() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-white/[0.08] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="block">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-7 w-auto" priority />
        </Link>
        <Link href="/#check-date" className="text-[11px] font-bold uppercase tracking-[3px] text-red hover:text-white transition-colors">
          Check Your Date
        </Link>
      </nav>

      {/* HERO */}
      <section className="min-h-screen bg-black flex flex-col justify-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/photos/action.jpg" alt="Dan performing" fill className="object-cover object-center" priority />
        </div>
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 0% 50%, rgba(188,48,33,0.12), transparent 70%)" }} />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">The DJ</p>
          <h1 className="text-[clamp(52px,12vw,160px)] font-black leading-[0.88] text-white uppercase tracking-[-3px] mb-10 max-w-[12ch]">
            This isn&apos;t a playlist.
          </h1>
          <p className="text-[clamp(17px,2vw,24px)] font-light text-white/60 max-w-[52ch] leading-[1.75]">
            I&apos;ve been a musician since I was four years old. I approach every wedding set the way a composer approaches a score — with intention, with craft, and with your story at the center of every decision.
          </p>
        </div>
      </section>

      {/* THE BACKGROUND */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">The Background</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            Music has been my first language since I was four.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              Most DJs discovered music in their twenties. I discovered it before I discovered reading. I started learning instruments at four years old — picking up melody by ear, learning how songs are built from the inside out. By the time I became a professional, I wasn&apos;t just someone who knew a lot of songs. I was someone who understood <em className="not-italic font-semibold text-black">why</em> they work.
            </p>
            <p>
              That background became a career in music production. I produce and mix tracks professionally — which means I don&apos;t just play music at your wedding, I can shape it. If you want a specific song edited to hit differently at your entrance, I can do that. If you want a seamless blend between two tracks that were never meant to go together, I can make that work. If you have a vision for a moment that no existing song quite captures, we&apos;ll find the version that does.
            </p>
            <p>
              Most DJs work from a pre-built playlist they shuffle between events. I build yours from scratch, weeks before your date, then I throw it away and read the room on the night.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* THE DIFFERENCE — split stat section */}
      <section className="bg-black py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-[clamp(40px,6vw,80px)] bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/25 mb-8">The Average DJ</p>
              <ul className="space-y-5">
                {[
                  "Opens Spotify or a generic library on the day of",
                  "Plays crowd-pleasing defaults with no context about your guests",
                  "Same transitions every wedding — crossfade on the beat, repeat",
                  "Turns it up when the dance floor empties (it doesn't work)",
                  "Reads announcements from a printed sheet",
                ].map((item) => (
                  <li key={item} className="flex gap-4 text-[clamp(14px,1.4vw,17px)] font-light text-white/30 leading-[1.6]">
                    <span className="text-white/15 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-[clamp(40px,6vw,80px)] bg-red">
              <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/60 mb-8">Dan&apos;s Events</p>
              <ul className="space-y-5">
                {[
                  "Weeks of prep: I learn your families, your guests, your story",
                  "Custom mixing — tracks edited and blended to your specific moments",
                  "Every transition is a deliberate creative decision",
                  "Reads the room in real time and adjusts the arc of the night",
                  "Music that's never too loud, never cheesy, never templated",
                ].map((item) => (
                  <li key={item} className="flex gap-4 text-[clamp(14px,1.4vw,17px)] font-light text-white leading-[1.6]">
                    <span className="text-white/50 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* THE CUSTOM MIXING */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Custom Mixing</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            Your requests don&apos;t go into a queue. They go into the mix.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              When you tell me you want a specific song for your first dance, I don&apos;t just find it on Spotify and hit play. I listen to it. I learn its structure. If there&apos;s an intro that&apos;s too long, I trim it. If the ending fades awkwardly, I fix it. If you want a specific verse rather than the chorus — I build that version for you.
            </p>
            <p>
              The same goes for your cocktail hour, your reception set, your last song. Every piece of music at your wedding is chosen with intention and, where needed, shaped to fit the moment it&apos;s designed for.
            </p>
            <p>
              You came with a vision. I build the soundtrack to match it — not the other way around.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SOUND QUALITY */}
      <section className="bg-black py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">The Sound</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.05] tracking-[-0.025em] mb-16 max-w-[20ch]">
            Professional-grade sound. Not consumer. Not rental. Mine.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
            {[
              {
                n: "01",
                h: "No distortion.",
                p: "Consumer-grade speakers distort at volume. Professional PA systems are designed to fill a room cleanly at whatever level the room demands — without edge, without harshness.",
              },
              {
                n: "02",
                h: "Calibrated to your venue.",
                p: "Every room has different acoustics. I arrive early, walk the space, and dial the system to the room — so it sounds right at the tables and right on the dance floor.",
              },
              {
                n: "03",
                h: "Present, not intrusive.",
                p: "Great sound should fill the room without demanding attention. Music at the right level means your guests can have a conversation at the table and feel the bass on the floor. Both. At the same time.",
              },
            ].map((item) => (
              <div key={item.n} className="p-10 bg-[#0a0a0a]">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-red block mb-5">{item.n}</span>
                <h3 className="text-xl font-black uppercase text-white mb-4 tracking-[-0.01em]">{item.h}</h3>
                <p className="text-sm font-light text-white/45 leading-[1.8]">{item.p}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT I WON'T DO */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">The Standard</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            What you won&apos;t hear at a Dan&apos;s Events wedding.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              I don&apos;t play the Cha Cha Slide, the Cupid Shuffle, or the YMCA unless you specifically ask for them. I don&apos;t drop air horns between songs. I don&apos;t say &ldquo;how&apos;s everybody doing tonight?&rdquo; into a microphone. I don&apos;t blast the music so loud that your grandparents have to leave the room.
            </p>
            <p>
              I don&apos;t use a foam cannon or confetti shooters or LED wristbands as a substitute for actually reading the room. Gimmicks exist because the music isn&apos;t working. When the music is working, the dance floor takes care of itself.
            </p>
            <p>
              My job is to make the night feel inevitable — like every song was always meant to come next, like the energy built exactly when it was supposed to. That&apos;s what two decades of musicianship gets you. Not a playlist. A performance.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="bg-red py-[clamp(80px,10vw,140px)] px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white leading-[0.92] tracking-[-2px] mb-6">
            Let&apos;s talk about your night.
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/70 max-w-[44ch] mx-auto mb-12 leading-relaxed">
            Tell me what you want your guests to feel. I&apos;ll tell you how we get there.
          </p>
          <Link href="/#check-date" className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-12 py-5 hover:bg-white hover:text-black transition-colors">
            Check Your Date
          </Link>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
        <Link href="/" className="inline-block mb-4">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-8 w-auto mx-auto" />
        </Link>
        <div className="text-[11px] uppercase tracking-[6px] text-white/30 mb-4">Wedding DJ &amp; MC — Asheville, NC</div>
        <div className="text-[10px] text-white/15 tracking-[2px] uppercase">&copy; 2026 Dan&apos;s Events. All rights reserved.</div>
      </footer>
    </>
  );
}
