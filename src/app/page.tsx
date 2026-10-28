import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import ScrollReveal from "@/components/scroll-reveal";
import MobileNav from "@/components/mobile-nav";
import { BUNDLE, usd } from "@/lib/pricing";
import { SiteFooter } from "@/components/site-chrome";
import ReviewsBlock from "@/components/seo/reviews-block";
import FaqSection from "@/components/seo/faq-section";
import { HOME_FAQ } from "@/lib/faq";
import { GOOGLE_REVIEWS, REVIEW_COUNT, REVIEW_RATING, REVIEWS_AS_OF, FIVE_STAR_COUNT } from "@/lib/reviews";
import { CITIES, FACTS, REGIONS, cityLabel } from "@/lib/site";

const HERO_REVIEW = GOOGLE_REVIEWS.find((r) => r.name === "Katherine F.")!;

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-red px-6 h-16 flex items-center justify-between">
        <a href="#" className="block">
          <Image
            src="/logos/logo-white-transparent.png"
            alt="Dan's Events"
            width={200}
            height={23}
            className="h-7 w-auto"
            priority
          />
        </a>
        <ul className="hidden lg:flex gap-7 list-none">
          {[
            ["#craft", "The Craft"],
            ["/mc", "MC & Host"],
            ["/dj", "DJ"],
            ["/lighting", "Lighting"],
            ["/special-effects", "Effects"],
            ["/venues", "Venues"],
            ["/reviews", "Reviews"],
            ["/pricing", "Pricing"],
            ["#check-date", "Check Your Date"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[11px] font-medium uppercase tracking-[2px] text-white hover:text-white/80 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <MobileNav breakpoint="lg" />
      </nav>

      {/* HERO — drop hero.jpg into public/photos/ to activate photo background */}
      <section className="min-h-svh flex flex-col justify-center items-center text-center px-6 pt-20 pb-15 relative overflow-hidden bg-[#3B3536]">
        <Image
          src="/photos/hero.jpg"
          alt="Dan's Events — Wedding DJ & MC performing"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <h1 className="hero-headline relative z-10 text-[clamp(44px,13vw,150px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-12">
          <span className="block">Your</span>
          <span className="block">Party</span>
          <span className="block">Your</span>
          <span className="block">Rules</span>
        </h1>
        <div className="hero-location relative z-10 text-xs font-normal tracking-[6px] uppercase text-white/60">
          Wedding host, DJ &amp; lighting <span className="text-red">/</span> <Link href="/asheville" className="hover:text-white/90 transition-colors">Asheville, NC</Link>
        </div>
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-[60px] bg-white/30 z-10" />
      </section>

      {/* SPLIT — The Craft */}
      <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[80vh]" id="craft">
        <ScrollReveal direction="left" className="bg-black p-[clamp(48px,8vw,120px)] flex flex-col justify-center">
          <h2 className="text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.15] uppercase mb-8 text-white">
            I don&apos;t announce moments. I <em className="not-italic text-red">create</em> them.
          </h2>
          <p className="text-[clamp(17px,2vw,24px)] font-normal text-white/85 leading-relaxed">
            I turn a room full of strangers into a family for one night.
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/70 leading-[1.75] mt-5 max-w-[520px]">
            Every toast, every first dance, every moment the crowd erupts — that&apos;s not luck. That&apos;s craft. It&apos;s reading the room before the room knows what it wants. It&apos;s knowing exactly when to raise the energy and when to let a moment breathe.
          </p>
        </ScrollReveal>
        {/* drop craft.jpg into public/photos/ to activate photo — grayscale treatment preserved */}
        <ScrollReveal direction="right" className="relative overflow-hidden min-h-[50vh] md:min-h-[400px] order-[-1] md:order-none bg-[#8a7e76]">
          <Image
            src="/photos/craft.jpg"
            alt="Dan performing at a wedding"
            fill
            className="object-cover grayscale hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
          <div className="absolute bottom-10 -left-5 w-[200px] h-1.5 bg-red z-[2]" />
        </ScrollReveal>
      </section>

      {/* COMPARISON 1 — The MC Difference */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6" id="mc-difference">
        <ScrollReveal className="text-center max-w-[700px] mx-auto mb-16">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white mb-6 leading-[1.1]">
            Which MC would <em className="not-italic text-red">you</em> want at your wedding?
          </h2>
          <p className="text-[clamp(15px,1.6vw,18px)] font-light text-white/60 leading-[1.7]">
            Read both. You&apos;ll know immediately.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
          <ScrollReveal direction="left" className="p-[clamp(32px,5vw,60px)] bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 block mb-8">The Other Guy</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-light text-white/35">
              &ldquo;Alright everybody, let&apos;s give it up for the bride and groom!&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/20">
              Polite clapping. A few whoops. It&apos;s fine.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" className="p-[clamp(32px,5vw,60px)] bg-red">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 block mb-8">Dan&apos;s Events</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-normal text-white">
              &ldquo;Ladies and gentlemen, as your host tonight I&apos;m going to need your help. We are about to create a moment that Alex and Ashley will remember for the rest of their lives!! I want us to bring the kind of energy that will give every person goosebumps in this room!! Can you do that with me?? Let&apos;s welcome the power couple — the unforgettable duo — and the stars of the night — MISTER and MISSISSSS SHEVCHENKOOO!!!!&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/80">
              <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
              The room ERUPTS. Goosebumps. Everyone is on their feet.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FULL-SCREEN STATEMENT */}
      <section className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <ScrollReveal animation="scale" className="text-[clamp(32px,9vw,120px)] font-black uppercase text-black leading-none text-center tracking-[-2px]">
          MEANINGFUL<br />ENTERTAINMENT<span className="inline-block w-[clamp(16px,4vw,50px)] h-[clamp(16px,4vw,50px)] bg-red align-baseline ml-2 translate-y-1" />
        </ScrollReveal>
      </section>

      {/* TICKER */}
      <div className="bg-red py-5 overflow-hidden whitespace-nowrap">
        <div className="ticker-track inline-flex">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="contents">
              {["Hosting Your Always & Forever", "Your Party Your Rules", "40+ Five-Star Reviews", "Asheville NC", "Wedding DJ & MC", "Ceremony to Last Dance"].map((text) => (
                <span key={`${i}-${text}`} className="text-[clamp(13px,2vw,22px)] font-extrabold uppercase tracking-[6px] text-white px-10 shrink-0">
                  {text} <span className="inline-block w-2 h-2 bg-white ml-10 align-middle opacity-50" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        {[
          {
            title: "DJ",
            titleHref: "/dj",
            number: "01",
            bg: "bg-red",
            descNode: (
              <>
                You know that moment when a song hits and the entire room moves at once? That&apos;s not a playlist. That&apos;s someone who spent weeks learning your crowd — the family that loves Sinatra, the college friends who need 2000s hip hop, the moment grandma surprises everyone on the floor. Every transition is a decision. Every decision is intentional.
              </>
            ),
          },
          {
            title: "MC &\nHost",
            titleHref: "/mc",
            number: "02",
            bg: "bg-black",
            descNode: (
              <>
                In my culture, the wedding host is called a{" "}
                <Link href="/mc" className="underline underline-offset-[3px] decoration-white/30 hover:decoration-white transition-colors">
                  tamada
                </Link>
                {" "}— the emotional anchor of the celebration. Not someone who reads announcements off a card. Someone who turns the father-of-the-bride into the hero of his own speech. Who makes the shy uncle feel like the most important person in the room. Who gives 150 strangers a shared identity before the first dance even starts.
              </>
            ),
          },
          {
            title: "Luxury\nLighting",
            titleHref: "/lighting",
            number: "03",
            bg: "bg-red",
            descNode: (
              <>
                The room your guests walk into isn&apos;t just a venue — it&apos;s a composition. One restrained palette of warm and white light, placed with intention, so the space feels elevated before a single note plays. No spinning colors. No distractions. Just light that flatters every face, makes every photograph worth framing, and makes the room feel like it was always supposed to look this way.
              </>
            ),
          },
          {
            title: "Fog &\nSparks",
            titleHref: "/special-effects",
            number: "04",
            bg: "bg-black",
            descNode: (
              <>
                The moments people talk about on the way home.{" "}
                <Link href="/low-fog" className="underline underline-offset-[3px] decoration-white/30 hover:decoration-white transition-colors">
                  Low fog
                </Link>{" "}
                so your first dance happens on a cloud.{" "}
                <Link href="/cold-sparklers" className="underline underline-offset-[3px] decoration-white/30 hover:decoration-white transition-colors">
                  Cold sparklers
                </Link>{" "}
                for the entrance or the send-off. Run by the same team that holds the mic, so every effect lands on the exact beat it was planned for.
              </>
            ),
          },
        ].map((service) => (
          <ScrollReveal
            key={service.number}
            className={`grid grid-cols-1 md:grid-cols-2 min-h-0 md:min-h-[300px] relative overflow-hidden ${service.bg}`}
          >
            <div className="flex items-center md:justify-end p-[clamp(40px,6vw,80px)] md:pb-[clamp(40px,6vw,80px)] pb-0">
              <h3 className="text-[clamp(36px,6vw,80px)] font-black uppercase leading-none tracking-[-1px] text-white whitespace-pre-line md:text-right">
                <Link href={service.titleHref} className="hover:text-white/75 transition-colors">
                  {service.title}
                </Link>
              </h3>
            </div>
            <div className="flex items-center p-[clamp(40px,6vw,80px)] md:pt-[clamp(40px,6vw,80px)] pt-6 md:border-l border-t md:border-t-0 border-white/15">
              <div>
                <span className="text-xs font-bold tracking-[3px] text-white/30 mb-4 block">{service.number}</span>
                <p className="text-[clamp(14px,1.4vw,18px)] font-light leading-[1.8] text-white/75 max-w-[420px]">
                  {service.descNode}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* 2027 FULL EXPERIENCE */}
      <section className="bg-white py-[clamp(64px,9vw,120px)] px-6" id="full-experience">
        <ScrollReveal className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-[clamp(32px,6vw,96px)] items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[3px] sm:tracking-[4px] text-black/45 mb-6">For 2027 weddings — first 10 couples</p>
            <h2 className="text-[clamp(28px,4.5vw,52px)] font-black uppercase text-black leading-[1.1] mb-6">
              The 2027 Full <em className="not-italic text-red">Experience</em>
            </h2>
            <p className="text-[clamp(15px,1.6vw,19px)] font-light text-black/70 leading-[1.8] max-w-[560px]">
              Hosting, DJ with ceremony sound, stage lighting, spotlights and low fog, all from one team for one price.
            </p>
          </div>
          <div className="md:text-right">
            <div className="flex items-baseline gap-4 md:justify-end mb-2 tabular-nums">
              <s className="text-[clamp(20px,2.2vw,28px)] font-semibold text-black/45 decoration-red decoration-2">
                <span className="sr-only">Booked separately: </span>{usd(BUNDLE.separately)}
              </s>
              <span className="text-[clamp(48px,6vw,80px)] font-black text-black leading-none tracking-[-1px]">{usd(BUNDLE.price)}</span>
            </div>
            <p className="text-[14px] font-light text-black/60 mb-6">You save {usd(BUNDLE.separately - BUNDLE.price)}.</p>
            <Link
              href="/2027"
              className="inline-block text-[12px] font-bold uppercase tracking-[3px] text-white bg-red px-8 py-5 hover:bg-black transition-colors"
            >
              See the package
            </Link>
            <p className="mt-5 text-[13px] font-light text-black/60">
              Or see <Link href="/pricing" className="underline underline-offset-[3px] decoration-red hover:text-red transition-colors">each service&apos;s price</Link>
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* STATS — action.jpg background with red tint overlay */}
      <section className="min-h-[70vh] flex items-center justify-center text-center px-6 py-20 relative overflow-hidden bg-red" id="proof">
        <Image
          src="/photos/lighting-values.png"
          alt="Wedding reception energy"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-red/75" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(100px,25vw,350px)] font-black uppercase tracking-[20px] text-white/[0.04] pointer-events-none whitespace-nowrap z-10">
          DAN&apos;S
        </span>
        <ScrollReveal animation="scale" className="relative z-10">
          <div className="text-[clamp(120px,30vw,400px)] font-black leading-[0.85] text-white tracking-[-10px]">40+</div>
          <div className="text-[clamp(14px,2vw,20px)] font-normal uppercase tracking-[8px] text-white/70 mt-5">Five-Star Google Reviews</div>
          <div className="text-[clamp(12px,1.2vw,14px)] font-light text-white/45 mt-3 tracking-[2px]">From couples who trusted me with their most important night</div>
          <Link href="/reviews" className="inline-block mt-6 text-[12px] font-medium tracking-[2px] text-white/80 underline underline-offset-[4px] decoration-white/40 hover:decoration-white">
            Rated {REVIEW_RATING} from {REVIEW_COUNT} Google reviews ({FIVE_STAR_COUNT} five-star), {REVIEWS_AS_OF}
          </Link>
        </ScrollReveal>
      </section>

      {/* COMPARISON 2 — The Toast */}
      <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
        <ScrollReveal className="text-center max-w-[700px] mx-auto mb-16">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black mb-6 leading-[1.1]">
            The moment before <em className="not-italic text-red">the toast</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,18px)] font-light text-black/50 leading-[1.7]">
            Your maid of honor is nervous. She&apos;s about to give the biggest speech of her life. What does your MC say?
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
          <ScrollReveal direction="left" className="p-[clamp(32px,5vw,60px)] bg-black/[0.03] border border-black/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 block mb-8">The Other Guy</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-light text-black/35">
              &ldquo;OK so next up we have the maid of honor speech. Sarah, come on up!&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-black/20">
              Sarah walks up with shaky hands. Room keeps chatting.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" className="p-[clamp(32px,5vw,60px)] bg-red">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 block mb-8">Dan&apos;s Events</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-normal text-white">
              &ldquo;I need everyone&apos;s attention for this next part, because someone very special is about to share something from the heart. If you&apos;ve ever met Sarah, you know she&apos;s the kind of friend who drops everything when you call. The kind of person who makes everyone around her feel like they matter. Ashley chose Sarah as her maid of honor for a reason — and you&apos;re about to hear why. Give her the kind of welcome that lets her know this whole room has her back.&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/80">
              <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
              Standing ovation before Sarah says a single word. She delivers the speech of her life.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* IDENTITY SECTION */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6 text-center" id="identity">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1] mb-10">
            Here&apos;s what I&apos;ve <em className="not-italic text-red">learned</em>
          </h2>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65 mb-6">
            Most couples don&apos;t come to me knowing exactly what they want. They come with a feeling — <strong className="text-white font-semibold">&ldquo;We want our guests to have the best night of their lives.&rdquo;</strong>
          </p>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65 mb-6">
            That&apos;s my specialty. Not just the music. Not just the mic. The <strong className="text-white font-semibold">room</strong>. The energy that makes your aunt who said she wasn&apos;t going to dance end up closing down the floor. The moment when both families — who met each other for the first time today — are hugging on the dance floor like they&apos;ve known each other for years.
          </p>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65 mb-6">
            You don&apos;t get that from a playlist. You get that from someone who spent 20 years learning how to <strong className="text-white font-semibold">read people, connect people, and create the conditions where joy happens naturally</strong>.
          </p>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65">
            If that&apos;s what you&apos;re looking for, we should talk.
          </p>
          <div className="mt-12">
            <Image
              src="/logos/logo-white-transparent.png"
              alt="Dan's Events"
              width={200}
              height={23}
              className="h-10 w-auto opacity-80 mx-auto"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* TESTIMONIAL — romantic.jpg background with dark overlay */}
      <section className="py-[clamp(80px,12vw,180px)] px-6 text-center relative overflow-hidden bg-black">
        <Image
          src="/photos/romantic.jpg"
          alt="Wedding couple"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80" />
        <span className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[60px] h-0.5 bg-red z-10" />
        <span className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[60px] h-0.5 bg-red z-10" />
        <ScrollReveal className="relative z-10">
          <span className="text-[clamp(80px,12vw,160px)] font-black text-red leading-[0.5] mb-10 block">&ldquo;</span>
          <blockquote className="text-[clamp(18px,2.4vw,32px)] font-light leading-[1.5] text-white max-w-[900px] mx-auto mb-10 italic whitespace-pre-line">
            {HERO_REVIEW.text}
          </blockquote>
          <div className="text-xs font-bold uppercase tracking-[4px] text-white/40">
            {HERO_REVIEW.name} <span className="text-red">/</span> Google review, {HERO_REVIEW.when}
          </div>
        </ScrollReveal>
      </section>

      <ReviewsBlock limit={6} />

      {/* WHY DAN'S EVENTS: plain facts people (and AI assistants) can quote */}
      <section className="bg-black py-[clamp(72px,10vw,140px)] px-6" id="why">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1] mb-6">
            Why <em className="not-italic text-red">Dan&apos;s Events</em>
          </h2>
          <p className="text-[clamp(16px,1.8vw,21px)] font-light text-white/70 leading-[1.75] max-w-[760px] mb-12">
            Dan&apos;s Events is a wedding entertainment team from {FACTS.base}. {FACTS.owner} hosts in English and Russian, and the
            same team brings the DJ, ceremony sound, lighting, low fog and cold sparklers, so your night runs on one plan.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] mb-14">
            {[
              [`${REVIEW_RATING} ★`, `${REVIEW_COUNT} Google reviews, ${REVIEWS_AS_OF}`],
              [String(FACTS.season2026Events), `weddings and events in the 2026 season`],
              ["2", "languages on the mic: English and Russian"],
              ["1", "team for host, DJ, lighting and effects"],
            ].map(([big, small]) => (
              <div key={small} className="bg-black p-8">
                <dt className="text-[clamp(40px,5vw,64px)] font-black text-white leading-none mb-3">{big}</dt>
                <dd className="text-[13px] font-light text-white/55 leading-[1.6]">{small}</dd>
              </div>
            ))}
          </dl>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">Where we work</h3>
              <ul className="list-none space-y-4">
                {REGIONS.map((r) => (
                  <li key={r.id} className="text-[14px] font-light text-white/60 leading-[1.8]">
                    <span className="block text-white font-semibold">{r.name}</span>
                    {CITIES.filter((c) => c.region === r.id).map((c, i) => (
                      <span key={c.slug}>
                        {i > 0 && <span className="text-red mx-2">/</span>}
                        <Link href={`/${c.slug}`} className="hover:text-white">{cityLabel(c)}</Link>
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px]">
                <Link href="/areas" className="text-white/70 underline underline-offset-[4px] decoration-red hover:text-white">All areas</Link>
                <span className="text-red mx-3">/</span>
                <Link href="/venues" className="text-white/70 underline underline-offset-[4px] decoration-red hover:text-white">Venue guides</Link>
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">Learn more</h3>
              <ul className="list-none space-y-3">
                {[
                  ["/about", "About Dan's Events"],
                  ["/mc", "Wedding MC & host"],
                  ["/dj", "Wedding DJ"],
                  ["/wedding-uplighting", "Uplighting & dance floor lighting"],
                  ["/low-fog", "Low fog: dancing on a cloud"],
                  ["/cold-sparklers", "Cold sparklers"],
                  ["/faq", "Questions couples ask"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-[15px] font-light text-white/70 hover:text-red transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <FaqSection items={HOME_FAQ} title="Quick answers" />

      {/* CHECK YOUR DATE */}
      <section className="bg-red min-h-screen flex flex-col items-center justify-center px-6 py-20" id="check-date">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white text-center mb-5 leading-none tracking-[-2px]">
            Check<br />Your Date
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/70 text-center max-w-[500px] mb-12 leading-relaxed">
            Most couples who reach out wish they&apos;d done it sooner. Peak season Saturdays book 12+ months in advance.
          </p>
        </ScrollReveal>
        <ContactForm />
        <ScrollReveal>
          <p className="mt-6 text-[11px] font-normal text-white/50 tracking-[2px] uppercase">
            I respond personally within 24 hours
          </p>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </>
  );
}
