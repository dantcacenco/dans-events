"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import s from "./lighting.module.css";

// Scroll-reveal hook — uses literal "in" class so :global(.in) CSS matches
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(`.${s.reveal}`);

    // Immediately reveal elements already in the viewport (e.g. hero)
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("in");
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => {
      if (!el.classList.contains("in")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

export default function LightingPage() {
  useReveal();

  return (
    <div className={s.page}>
      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className={s.nav}>
        <div className={`${s.wrap} ${s.navIn}`}>
          <Link href="/" className={s.navBrand}>
            <span className={s.navBrandMain}>Dan&apos;s Events</span>
            <span className={s.navBrandSep}>/</span>
            <span className={s.navBrandSub}>Lighting</span>
          </Link>
          <div className={s.navLinks}>
            <a href="#difference" className={s.navLink}>The Difference</a>
            <a href="#collections" className={s.navLink}>Collections</a>
            <a href="#process" className={s.navLink}>Process</a>
            <a href="#inquire" className={`${s.navLink} ${s.navCta}`}>Inquire</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        {/* Desktop: photo background */}
        <div className={s.heroBgDesktop}>
          <Image
            src="/photos/lighting-hero.png"
            alt="Wedding lighting atmosphere"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Mobile: looping video background */}
        <video
          className={s.heroBgVideo}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/hero-lighting.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay — same for both */}
        <div className={s.heroBgOverlay} />
        <div className={s.heroBloom} />
        <div className={`${s.heroBeam} ${s.heroBeamL}`} />
        <div className={`${s.heroBeam} ${s.heroBeamR}`} />
        <div className={s.wrap}>
          <div className={`${s.heroContent} ${s.stagger}`}>
            <div className={`${s.eyebrow} ${s.reveal}`}>
              Atmospheric Wedding Lighting &middot; Asheville &amp; Beyond
            </div>
            <h1 className={`${s.heroH1} ${s.reveal}`}>
              The light is what<br />
              they&apos;ll <span className={s.heroH1Accent}>remember.</span>
            </h1>
            <p className={`${s.heroLede} ${s.reveal}`}>
              We compose a single, restrained palette of warm and white light that turns a venue
              into the most beautiful room your guests have ever stood in — and every photograph
              into one worth framing.
            </p>
            <div className={`${s.heroActions} ${s.reveal}`}>
              <a href="#inquire" className={s.btn}>Begin the conversation</a>
              <a href="#collections" className={`${s.btn} ${s.btnGhost}`}>
                View the collections <span className={s.btnGhostArr}>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
        <div className={s.scrollCue}>Scroll</div>
      </header>

      {/* ── THE DIFFERENCE ──────────────────────────────────────────── */}
      <section className={s.section} id="difference">
        <div className={`${s.wrap} ${s.philo}`}>
          <div className={s.reveal}>
            <div className={s.eyebrow}>The Difference</div>
            <h2 className={s.philoH2}>Where others add color, we add atmosphere.</h2>
          </div>
          <div className={s.reveal}>
            <p className={s.philoP}>
              Most lighting shouts. Ours doesn&apos;t. We work in two tones only —{" "}
              <em className={s.philoEm}>warm white</em> and <em className={s.philoEm}>white</em> —
              because restraint is what reads as elegant in the room and timeless in the photographs.
            </p>
            <p className={s.philoP}>
              No spinning colors. No nightclub. Just light, placed with intention, so the space
              feels composed rather than decorated. The effect is something your guests feel before
              they can name it — and something you&apos;ll see in every frame for the rest of your life.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY LIGHT MATTERS ───────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop} ${s.sectionWithBg}`}>
        <div className={s.sectionBgImg}>
          <Image src="/photos/lighting-values.png" alt="Starburst wedding lighting" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgImgDesktop}>
          <Image src="/photos/lighting-values-desktop.png" alt="Starburst wedding lighting" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgOverlay} />
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>Why It Matters</div>
            <h2 className={s.secHeadH2}>
              The one detail your guests<br />will feel all night.
            </h2>
          </div>
          <div className={`${s.values} ${s.reveal}`}>
            <div className={s.val}>
              <span className={s.valN}>i</span>
              <div>
                <h3 className={s.valH3}>It flatters<br />everyone.</h3>
                <p className={s.valP}>Skin, gowns, flowers, faces — warm light is universally kind. Every guest looks their best.</p>
              </div>
            </div>
            <div className={s.val}>
              <span className={s.valN}>ii</span>
              <div>
                <h3 className={s.valH3}>It transforms<br />the space.</h3>
                <p className={s.valP}>Whatever room your venue gave you, we make it the one in the photos people save.</p>
              </div>
            </div>
            <div className={s.val}>
              <span className={s.valN}>iii</span>
              <div>
                <h3 className={s.valH3}>It makes the<br />photographs.</h3>
                <p className={s.valP}>Your photographer is only as good as the light. We give them a room already worth shooting.</p>
              </div>
            </div>
            <div className={s.val}>
              <span className={s.valN}>iv</span>
              <div>
                <h3 className={s.valH3}>It can&apos;t be<br />redone.</h3>
                <p className={s.valP}>There are no second takes on a wedding. We design so there&apos;s nothing you&apos;d change.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ─────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop}`} id="collections">
        <div className={s.secGlow} />
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>The Collections</div>
            <h2 className={s.secHeadH2}>Three ways to light a night.</h2>
            <p className={s.lede} style={{ marginTop: "18px" }}>
              Every wedding is quoted to its own room and vision. These are where the conversation begins.
            </p>
          </div>

          <div className={s.collections}>
            {/* The Bespoke */}
            <div className={`${s.col} ${s.colFeature} ${s.reveal}`}>
              <div className={s.colName}>The Bespoke</div>
              <div className={s.colInvest}>Investment begins at</div>
              <div className={s.colPrice}>$5,000</div>
              <p className={s.colDesc}>
                A lighting design composed for every moment — ceremony to last dance, and the days
                around it. The full instrument, programmed to your night. Nothing templated.
                We design it together.
              </p>
              <div className={s.colIncl}>
                <span className={s.colInclB}>The full rig</span> — moving light, layered washes,
                architectural bars, statement fixtures, low-lying cloud for your first dance, and
                cold sparks for the send-off. Multi-day available.
              </div>
              <a href="#inquire" className={s.btn}>Request a design consultation</a>
            </div>

            {/* The Signature */}
            <div className={`${s.col} ${s.reveal}`}>
              <div className={s.badge}>Most requested</div>
              <div className={s.colName}>The Signature</div>
              <div className={s.colInvest}>Investment begins at</div>
              <div className={s.colPrice}>$2,800</div>
              <p className={s.colDesc}>
                Full-room transformation with a custom-designed first-dance moment — the package
                most couples land on, and the one that makes the night feel intentional.
              </p>
              <div className={s.colIncl}>
                <span className={s.colInclB}>Elevated</span> — moving light, layered washes,
                architectural accents, statement fixtures, and a sparkler send-off, programmed
                to your timeline.
              </div>
              <a href="#inquire" className={s.btn}>Check your date</a>
            </div>

            {/* The Ambient */}
            <div className={`${s.col} ${s.reveal}`}>
              <div className={s.colName}>The Ambient</div>
              <div className={s.colInvest}>Investment begins at</div>
              <div className={s.colPrice}>$1,200</div>
              <p className={s.colDesc}>
                A quiet, beautiful wash of warm light that elevates the room and flatters every
                photograph of the two of you. Understated — and never templated.
              </p>
              <div className={s.colIncl}>
                <span className={s.colInclB}>Refined</span> — a curated wash of warm and white
                light, placed and balanced for your space. The essentials, done with care.
              </div>
              <a href="#inquire" className={s.btn}>Check your date</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop}`} id="process">
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>The Experience</div>
            <h2 className={s.secHeadH2}>Effortless, by design.</h2>
          </div>
          <div className={s.process}>
            <div className={`${s.reveal}`}>
              <div className={s.redBar} />
              <div className={s.stepN}>01</div>
              <h3 className={s.stepH3}>The Conversation</h3>
              <p className={s.stepP}>We learn your venue, your vision, and exactly how you want the night to feel. No pressure — just a plan.</p>
            </div>
            <div className={`${s.reveal}`}>
              <div className={s.redBar} />
              <div className={s.stepN}>02</div>
              <h3 className={s.stepH3}>The Design</h3>
              <p className={s.stepP}>A lighting plan composed for your space — proposed, refined, and confirmed, down to the moment.</p>
            </div>
            <div className={`${s.reveal}`}>
              <div className={s.redBar} />
              <div className={s.stepN}>03</div>
              <h3 className={s.stepH3}>The Night</h3>
              <p className={s.stepP}>We arrive early, set quietly, and disappear. You never see the work — only the room it leaves behind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF ───────────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop} ${s.sectionWithBg}`}>
        <div className={s.sectionBgImg}>
          <Image src="/photos/lighting-proof.png" alt="Elegant red-lit wedding reception" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgImgDesktop}>
          <Image src="/photos/lighting-proof-desktop.png" alt="Elegant red-lit wedding reception" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgOverlay} />
        <div className={s.wrap}>
          <div className={`${s.quote} ${s.reveal}`}>
            <span className={s.qMark}>&ldquo;</span>
            <blockquote className={s.qBlockquote}>
              Our guests still talk about the room. The photos look like a magazine.
            </blockquote>
            <div className={s.qBy}>— Laura &middot; The Lumen House, 2025</div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ─────────────────────────────────────────────── */}
      <section className={s.closing} id="inquire">
        <div className={s.closingBloom} />
        <div className={`${s.wrap} ${s.closingInner}`}>
          <div className={`${s.eyebrow} ${s.reveal}`}>Now Booking</div>
          <h2 className={`${s.closingH2} ${s.reveal}`}>
            Let&apos;s design the room they&apos;ll remember.
          </h2>
          <p className={`${s.closingP} ${s.reveal}`}>
            Tell us your date, your venue, and the feeling you&apos;re after.
            We&apos;ll tell you what&apos;s possible.
          </p>
          <div className={s.reveal}>
            <Link href="/#check-date" className={s.btn}>Begin the conversation</Link>
          </div>
          <div className={`${s.scarcity} ${s.reveal}`}>
            We take a limited number of weddings each season &middot; Autumn in the mountains books first
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footIn}`}>
          <div className={s.footBrand}>Dan&apos;s Events / Lighting</div>
          <div className={s.footMeta}>
            Wedding Lighting Design &middot; Asheville, NC &amp; within a 4-hour radius &middot;{" "}
            <Link href="/" className={s.footMetaA}>Back to Dan&apos;s Events</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
