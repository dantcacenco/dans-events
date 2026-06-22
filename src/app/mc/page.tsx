import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Wedding MC & Host — Dan's Events | Asheville, NC",
  description:
    "Dan's Events — luxury wedding MC and host in Asheville, NC. Rooted in the tamada tradition. I don't announce moments. I create them. 40+ five-star reviews.",
  alternates: { canonical: "https://dans-events.com/mc" },
  openGraph: {
    title: "Wedding MC & Host — Dan's Events | Asheville, NC",
    description:
      "I don't announce moments. I create them. Rooted in the tamada tradition of the Caucasus.",
    url: "https://dans-events.com/mc",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding MC & Host" }],
  },
};

const COMPARISONS = [
  {
    moment: "The Grand Entrance",
    theirs: "\"Alright everybody, let's give it up for the bride and groom!\"",
    theirsResult: "Polite clapping. A few whoops. It's fine.",
    mine: "\"Ladies and gentlemen, as your host tonight I'm going to need your help. We are about to create a moment that Alex and Ashley will remember for the rest of their lives!! I want us to bring the kind of energy that will give every person goosebumps in this room!! Can you do that with me?? Let's welcome the power couple — the unforgettable duo — and the stars of the night — MISTER and MISSISSSS SHEVCHENKOOO!!!!\"",
    mineResult: "The room ERUPTS. Goosebumps. Everyone is on their feet.",
  },
  {
    moment: "Before the Toast",
    theirs: "\"OK so next up we have the maid of honor speech. Sarah, come on up!\"",
    theirsResult: "Sarah walks up with shaky hands. Room keeps chatting.",
    mine: "\"I need everyone's attention for this next part, because someone very special is about to share something from the heart. If you've ever met Sarah, you know she's the kind of friend who drops everything when you call — the kind of person who makes everyone around her feel like they matter. Ashley chose Sarah as her maid of honor for a reason. Give her the kind of welcome that lets her know this whole room has her back.\"",
    mineResult: "Standing ovation before Sarah says a single word. She delivers the speech of her life.",
  },
];

const MOMENTS = [
  {
    title: "The Grand Entrance",
    body: "The first impression every guest gets of your reception. Most MCs treat it as an announcement. I treat it as the opening act of the best night of your life — building anticipation, reading the room's energy, and releasing it at exactly the right second.",
  },
  {
    title: "The Toasts",
    body: "Your speakers are nervous. They've been thinking about this speech for months. My job is to set them up so they walk to that mic with the whole room already in their corner. I frame each speaker personally — not from a card, from what I learned about them before the night.",
  },
  {
    title: "The First Dance",
    body: "The room needs somewhere to put its emotion. I create the space for that — acknowledging what everyone is feeling without narrating over it. The silence before the first note is something I protect carefully.",
  },
  {
    title: "Parent Dances",
    body: "These are the moments people cry. My job is to honor them without manufacturing sentiment. I say what needs to be said, step back, and let the music carry it.",
  },
  {
    title: "The Transitions",
    body: "Between every major moment is a transition that most guests never notice — because when it's done right, the evening feels like it just flows. I'm managing those seams constantly, keeping the energy coherent from ceremony to last dance.",
  },
  {
    title: "The Send-Off",
    body: "The last thing your guests experience. I give them a close that feels like an ending, not a logistics announcement. Something they'll remember driving home.",
  },
];

export default function MCPage() {
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
            ["/dj", "DJ"],
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
          src="/photos/action.jpg"
          alt="Dan hosting a wedding reception"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="hero-headline relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-white/45 mb-10">
            MC &amp; Host — Dan&apos;s Events
          </p>
          <h1 className="text-[clamp(36px,10vw,120px)] font-black leading-[0.92] text-white uppercase tracking-[-2px]">
            <span className="block">I Don&apos;t</span>
            <span className="block">Announce</span>
            <span className="block">Moments.</span>
            <span className="block text-red">I Create Them.</span>
          </h1>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 max-w-[540px] mx-auto leading-[1.75] mt-10">
            There&apos;s a difference between someone who reads your name off a card and someone who makes 150 strangers feel like a family before the night is over.
          </p>
        </div>
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-[60px] bg-white/30 z-10" />
      </section>

      {/* THE TAMADA */}
      <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-center">
          <ScrollReveal direction="left">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 mb-6">The Tradition</p>
            <h2 className="text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.15] uppercase mb-8 text-black">
              The <em className="not-italic text-red">Tamada.</em><br />The host who<br />holds the room.
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/65 leading-[1.8] mb-5">
              In Georgian and Slavic tradition, the tamada isn&apos;t just an emcee. They&apos;re the emotional anchor of the entire celebration — responsible for the arc of the evening, the energy of the room, and the feeling that no one wants to leave.
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/65 leading-[1.8] mb-5">
              Their job isn&apos;t to get through the timeline. It&apos;s to make the room feel something. To introduce the father-of-the-bride as the hero of his own story. To give the shy uncle a moment where he feels like the most important person in the room.
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/65 leading-[1.8]">
              I grew up with this tradition. I&apos;ve spent twenty years refining it for the American wedding — keeping the depth, dropping the formality.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="bg-black p-[clamp(32px,5vw,60px)]">
              <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 block mb-8">What most MCs do</span>
              <p className="text-[clamp(15px,1.6vw,20px)] leading-[1.65] italic font-light text-white/35 mb-6">
                They show up with a script, say the right words in the right order, and hand the mic back to the couple. The night is fine. Adequate. Forgettable.
              </p>
              <div className="h-px bg-white/10 my-8" />
              <span className="text-[10px] font-bold uppercase tracking-[4px] text-red/80 block mb-8">What I do</span>
              <p className="text-[clamp(15px,1.6vw,20px)] leading-[1.65] font-normal text-white">
                I read the room before I say a word. I notice the energy, the body language, the moment grandma edges toward the dance floor. I use what I find. The night doesn&apos;t just flow — it builds. And by the end, your guests feel like they were part of something, not just witnesses to it.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COMPARISONS */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6">
        <ScrollReveal className="text-center max-w-[700px] mx-auto mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Side by Side</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1]">
            Which MC would <em className="not-italic text-red">you</em> want?
          </h2>
          <p className="text-[clamp(14px,1.4vw,18px)] font-light text-white/50 mt-6 leading-[1.7]">Read both. You&apos;ll know immediately.</p>
        </ScrollReveal>
        <div className="max-w-[1100px] mx-auto space-y-px">
          {COMPARISONS.map((c) => (
            <div key={c.moment} className="grid grid-cols-1 md:grid-cols-2 bg-white/[0.04] border border-white/[0.06]">
              <div className="p-[clamp(32px,5vw,60px)] border-b md:border-b-0 md:border-r border-white/[0.06]">
                <span className="text-[9px] font-bold uppercase tracking-[4px] text-white/20 block mb-2">{c.moment}</span>
                <span className="text-[9px] font-bold uppercase tracking-[4px] text-white/20 block mb-8">The Other Guy</span>
                <p className="text-[clamp(15px,1.8vw,22px)] leading-[1.65] italic font-light text-white/30 mb-8">
                  &ldquo;{c.theirs}&rdquo;
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[2px] text-white/18">{c.theirsResult}</p>
              </div>
              <div className="p-[clamp(32px,5vw,60px)] bg-red">
                <span className="text-[9px] font-bold uppercase tracking-[4px] text-white/50 block mb-2">{c.moment}</span>
                <span className="text-[9px] font-bold uppercase tracking-[4px] text-white/50 block mb-8">Dan&apos;s Events</span>
                <p className="text-[clamp(15px,1.8vw,22px)] leading-[1.65] italic font-normal text-white mb-8">
                  &ldquo;{c.mine}&rdquo;
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[2px] text-white/80">
                  <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
                  {c.mineResult}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE MOMENTS */}
      <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
        <ScrollReveal className="max-w-[700px] mx-auto text-center mb-20">
          <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 mb-6">The Role</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.1]">
            Every moment<br />has a <em className="not-italic text-red">weight.</em>
          </h2>
        </ScrollReveal>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.08] border border-black/[0.08]">
          {MOMENTS.map((m, i) => (
            <ScrollReveal key={m.title} className="bg-white p-[clamp(32px,4vw,52px)]">
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-red/50 block mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[clamp(16px,1.8vw,22px)] font-black uppercase text-black mb-4 leading-none">{m.title}</h3>
              <p className="text-[clamp(13px,1.3vw,16px)] font-light text-black/55 leading-[1.8]">{m.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* THE PREPARATION */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6 text-center">
        <ScrollReveal className="max-w-[780px] mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Before the Night</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1] mb-10">
            I know your story<br />before I pick up <em className="not-italic text-red">the mic.</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8] mb-6">
            We have a real conversation — not a questionnaire, a conversation. I want to know how you two met. What makes you laugh. Which parent is going to lose it during the first dance and needs a moment held for them. How Sarah and the bride became best friends.
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8] mb-6">
            Because when I introduce Sarah before her toast, I&apos;m not reading a bio. I&apos;m telling a story the whole room recognizes — and she walks to that mic with 150 people already in her corner.
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8]">
            That&apos;s not magic. That&apos;s preparation. And it makes the difference between a night people remember and a night people enjoyed.
          </p>
        </ScrollReveal>
      </section>

      {/* STATEMENT */}
      <section className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <ScrollReveal animation="scale" className="text-[clamp(32px,9vw,120px)] font-black uppercase text-black leading-none text-center tracking-[-2px]">
          THE EMOTIONAL<br />ANCHOR<span className="inline-block w-[clamp(16px,4vw,50px)] h-[clamp(16px,4vw,50px)] bg-red align-baseline ml-2 translate-y-1" />
        </ScrollReveal>
      </section>

      {/* COLLABORATION BRIDGE → DJ */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
          <ScrollReveal direction="left" className="bg-black p-[clamp(40px,6vw,80px)] flex flex-col justify-center">
            <p className="text-[clamp(18px,2.5vw,30px)] font-black uppercase text-white leading-[1.2] mb-6">
              &ldquo;The room never felt like it was being managed. It just flowed.&rdquo;
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-white/55 leading-[1.8]">
              That feeling — when the music lands perfectly under every word, when the energy never drops between moments — comes from a DJ and MC who share the same vision and built the same plan.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" className="bg-white p-[clamp(40px,6vw,80px)]">
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 mb-6">The Full Experience</p>
            <h2 className="text-[clamp(24px,3.5vw,44px)] font-black uppercase leading-[1.1] text-black mb-8">
              The MC and the DJ<br />are the same <em className="not-italic text-red">instrument.</em>
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/60 leading-[1.8] mb-5">
              When I step away from the mic, I already know what&apos;s coming in the music — because I&apos;m the one who built that arc. When I take the mic back, the music has already primed the room for what I&apos;m about to say.
            </p>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-black/60 leading-[1.8] mb-10">
              No seams. No handoffs. No moments where two vendors are looking at each other across the room figuring out who goes next.
            </p>
            <Link
              href="/dj"
              className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[3px] text-black hover:text-red transition-colors"
            >
              Explore the DJ experience <span className="text-red">→</span>
            </Link>
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
            Most couples who reach out wish they&apos;d done it sooner. Peak season Saturdays book 12+ months in advance.
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
            ["/dj", "DJ"],
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
