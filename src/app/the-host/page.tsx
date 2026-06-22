import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "The Host — Tamada | Dan's Events | Wedding MC Asheville NC",
  description: "The tamada is not an MC who reads announcements. It's the emotional anchor of the celebration — a tradition rooted in Georgian feast culture, brought to your wedding by Dan.",
  alternates: { canonical: "https://dans-events.com/the-host" },
  openGraph: {
    title: "The Tamada — Dan's Events",
    description: "What it means to truly host a wedding. The ancient art of the tamada, and why it changes everything.",
    url: "https://dans-events.com/the-host",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — The Host" }],
  },
  twitter: { card: "summary_large_image", title: "The Tamada — Dan's Events", description: "What it means to truly host a wedding.", images: ["/opengraph-image"] },
};

export default function TheHostPage() {
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
      <section className="min-h-screen bg-red flex flex-col justify-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-white/50 mb-8">The Host · Ведущий</p>
          <h1 className="text-[clamp(52px,12vw,160px)] font-black leading-[0.88] text-white uppercase tracking-[-3px] mb-10 max-w-[14ch]">
            Тамада.<br />The art of hosting a room.
          </h1>
          <p className="text-[clamp(17px,2vw,24px)] font-light text-white/80 max-w-[52ch] leading-[1.75]">
            In the oldest feast traditions of the Caucasus, the tamada is not the person holding the microphone. The tamada is the reason the feast has a soul.
          </p>
        </div>
      </section>

      {/* WHAT IS A TAMADA */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">The Origin</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            What is a tamada?
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              The word <em className="not-italic font-semibold text-black">tamada</em> (თამადა) comes from the ancient Georgian tradition of the <em className="not-italic font-semibold text-black">supra</em> — a ritual feast that is, in Georgian culture, one of the most sacred institutions in social life. The supra is not just a meal. It is a ceremony, a communion, a way of marking the most important moments of human existence: births, weddings, losses, reunions.
            </p>
            <p>
              The tamada is the person entrusted to lead the supra. Not because they speak the most, but because they are the most attuned. The tamada is chosen for their wisdom, their eloquence, and above all, their ability to feel the room — to know when a moment calls for levity, when it calls for weight, when silence is more powerful than words.
            </p>
            <p>
              Each toast at a Georgian supra follows a sequence: to God, to peace, to the living, to the departed, to love, to those who cannot be present. The tamada doesn&apos;t just speak these toasts — they <em className="not-italic font-semibold text-black">feel</em> them, and they make the room feel them too. A great tamada can move a table of strangers to tears, then to laughter, then to singing — in the span of a single toast.
            </p>
            <p>
              The tradition spread from Georgia across the Caucasus and into Slavic and Eastern European culture, where the тамада became the defining figure of any serious celebration. In that tradition, being asked to be tamada at someone&apos;s wedding is one of the highest honors you can receive. It means they trust you with the emotional memory of the most important night of their lives.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT THIS MEANS AT YOUR WEDDING */}
      <section className="bg-black py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">At Your Wedding</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.05] tracking-[-0.025em] mb-10">
            What this means for your night.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-white/60 leading-[1.85]">
            <p>
              Most wedding MCs are announcers. They call names, read a schedule, prompt applause on cue. That&apos;s a function, not a craft. The result is a night that moves from moment to moment without connecting them — events that happen, rather than a story that unfolds.
            </p>
            <p>
              I approach your wedding the way a tamada approaches a supra. I don&apos;t just introduce your speakers — I set up the room so that every speaker is walking into the best possible environment for their words to land. I don&apos;t just announce the first dance — I build the moment before it, so that when the music starts, the room is already holding its breath.
            </p>
            <p>
              I learn your story before your wedding day. Who the people are. What connects them. Where the emotion lives. Which moments need to be big and which need to be still. Then, on the night, I hold that knowledge and use it — quietly, invisibly — to shape the experience for every person in the room.
            </p>
            <p>
              Your guests don&apos;t need to know I&apos;m doing this. They just feel it. They feel like the night has a pulse.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* THE SPECIFIC SKILLS */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8 text-center">What it looks like in practice</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-16 text-center max-w-[18ch] mx-auto">
            The invisible hand behind every moment.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              {
                title: "Setting up toasts.",
                body: "I introduce every speaker in a way that primes the room to receive them. By the time they take the mic, the crowd is already on their side — already leaning in. A great setup can make an average toast feel extraordinary.",
              },
              {
                title: "Connecting both families.",
                body: "You invited people who have never met. By the end of the night, they should feel like they have. I create shared moments — references, laughter, emotion — that give both sides of the room a common experience to carry out together.",
              },
              {
                title: "Reading energy, not a script.",
                body: "I don't work from a rigid timeline. I work from the room. If a moment calls for an extension, I extend it. If the energy is ready to move, I move it. I adjust in real time so you never feel like the night is running you.",
              },
              {
                title: "The shy uncle.",
                body: "Every wedding has someone who came not knowing anyone, who is sitting at the edge of the room hoping not to be noticed. Part of my job is to make that person feel like they belong here. The tamada leaves no one on the outside.",
              },
              {
                title: "Bilingual, bicultural.",
                body: "If your guests span languages or cultural backgrounds, I work across them. I can host in English and Russian. I understand the emotional register of different cultural traditions and I honor them without making anyone feel othered.",
              },
              {
                title: "Zero babysitting.",
                body: "You shouldn't spend your wedding day managing your vendors. I ask the right questions ahead of time, I prepare thoroughly, and I execute independently. On the day, your only job is to be present. Mine is everything else.",
              },
            ].map((item) => (
              <div key={item.title} className="p-10 border border-black/[0.06]">
                <h3 className="text-xl font-black uppercase text-black mb-4 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-sm font-light text-black/60 leading-[1.85]">{item.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* QUOTE */}
      <section className="bg-red py-[clamp(80px,12vw,160px)] px-6 text-center">
        <ScrollReveal>
          <span className="text-[clamp(80px,12vw,140px)] font-black text-white/20 leading-[0.5] mb-8 block">&ldquo;</span>
          <p className="text-[clamp(20px,3vw,40px)] font-light italic text-white leading-[1.45] max-w-[800px] mx-auto mb-10">
            The tamada&apos;s job is not to be the most memorable person in the room. It&apos;s to make sure that the people who should be memorable — are.
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[4px] text-white/50">Dan&apos;s Events</p>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white leading-[0.92] tracking-[-2px] mb-6">
            Let&apos;s design your evening.
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/55 max-w-[44ch] mx-auto mb-12 leading-relaxed">
            Tell me who&apos;s in the room. I&apos;ll tell you how we make them feel like they were always meant to be there together.
          </p>
          <Link href="/#check-date" className="inline-block bg-red text-white text-[13px] font-bold uppercase tracking-[4px] px-12 py-5 hover:bg-white hover:text-black transition-colors">
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
