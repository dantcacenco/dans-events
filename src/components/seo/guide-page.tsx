import Image from "next/image";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import ContactForm from "@/components/contact-form";
import { BreadcrumbBar, type Crumb } from "./breadcrumbs";
import FaqSection, { type QA } from "./faq-section";
import JsonLd from "./json-ld";
import type { Photo } from "@/lib/photos";

// One layout for the guide and info pages (effects, lighting guide, about, FAQ, venue guides).
// Hierarchy: one big H1 in the hero, small eyebrow, short lede; sections in a single readable column.

export type GuideSection = {
  h2: string;
  p?: string[];
  list?: string[];
  photo?: Photo;
  caption?: string;
  links?: [string, string][];
};

export type GuideProps = {
  current?: string;
  crumbs: Crumb[];
  eyebrow: string;
  h1: string;
  lede: string;
  hero?: Photo;
  heroCaption?: string;
  facts?: { label: string; value: string }[];
  factsTitle?: string;
  sections: GuideSection[];
  faq?: QA[];
  related?: [string, string][];
  relatedTitle?: string;
  jsonLd?: object[];
  sources?: { label: string; url: string }[];
  sourcesNote?: string;
  children?: React.ReactNode;
};

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((t) => (
        <p key={t.slice(0, 40)} className="text-[clamp(15px,1.5vw,18px)] font-light text-white/70 leading-[1.85] mb-5">
          {t}
        </p>
      ))}
    </>
  );
}

export default function GuidePage(props: GuideProps) {
  const { hero } = props;
  return (
    <>
      <SiteNav current={props.current ?? ""} ctaHref="#check-date" />
      {props.jsonLd?.map((d, i) => <JsonLd key={i} data={d} />)}

      <BreadcrumbBar items={props.crumbs} underNav />

      {/* HERO */}
      <header className="bg-black px-6 pt-[clamp(40px,6vw,80px)] pb-[clamp(48px,7vw,96px)]">
        <div className={`max-w-[1100px] mx-auto grid grid-cols-1 ${hero ? "md:grid-cols-[1.25fr_1fr]" : ""} gap-[clamp(32px,5vw,72px)] items-center`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[5px] text-red mb-6">{props.eyebrow}</p>
            <h1 className="text-[clamp(34px,6.5vw,76px)] font-black uppercase leading-[0.95] tracking-[-1px] text-white mb-8">
              {props.h1}
            </h1>
            <p className="text-[clamp(16px,1.8vw,21px)] font-light text-white/75 leading-[1.7] max-w-[620px]">{props.lede}</p>
          </div>
          {hero && (
            <figure className="relative w-full max-w-[460px] mx-auto">
              <Image
                src={hero.src}
                alt={hero.alt}
                width={hero.width}
                height={hero.height}
                sizes="(min-width: 768px) 460px, 100vw"
                className="w-full h-auto object-cover"
                priority
              />
              {props.heroCaption && (
                <figcaption className="mt-3 text-[11px] font-light text-white/40 tracking-[1px]">{props.heroCaption}</figcaption>
              )}
            </figure>
          )}
        </div>
      </header>

      {/* FACTS */}
      {props.facts && props.facts.length > 0 && (
        <section className="bg-red px-6 py-[clamp(40px,6vw,72px)]" aria-label={props.factsTitle ?? "Key facts"}>
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 mb-6">{props.factsTitle ?? "Key facts"}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
              {props.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[10px] font-bold uppercase tracking-[3px] text-white/60 mb-1">{f.label}</dt>
                  <dd className="text-[15px] font-normal text-white leading-[1.6]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* SECTIONS */}
      <article className="bg-black px-6 py-[clamp(56px,8vw,112px)]">
        <div className="max-w-[760px] mx-auto">
          {props.sections.map((s) => (
            <section key={s.h2} className="mb-16 last:mb-0">
              <h2 className="text-[clamp(22px,3.2vw,36px)] font-extrabold uppercase text-white leading-[1.15] mb-7">
                {s.h2}
              </h2>
              {s.p && <Paragraphs items={s.p} />}
              {s.list && (
                <ul className="list-none mb-6 space-y-3">
                  {s.list.map((li) => (
                    <li key={li} className="text-[15px] font-light text-white/75 leading-[1.7] pl-5 relative">
                      <span className="absolute left-0 top-[0.7em] w-2 h-2 bg-red" aria-hidden="true" />
                      {li}
                    </li>
                  ))}
                </ul>
              )}
              {s.links && (
                <p className="text-[14px] font-light text-white/60 mb-6">
                  {s.links.map(([href, label], i) => (
                    <span key={href}>
                      {i > 0 && <span className="text-red mx-2">/</span>}
                      <Link href={href} className="underline underline-offset-[4px] decoration-red/60 hover:text-white">
                        {label}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              {s.photo && (
                <figure className="mt-8">
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    width={s.photo.width}
                    height={s.photo.height}
                    sizes="(min-width: 800px) 760px, 100vw"
                    className="w-full h-auto max-h-[80vh] object-cover"
                    loading="lazy"
                  />
                  {s.caption && <figcaption className="mt-3 text-[11px] font-light text-white/40 tracking-[1px]">{s.caption}</figcaption>}
                </figure>
              )}
            </section>
          ))}
        </div>
      </article>

      {props.children}

      {props.faq && props.faq.length > 0 && <FaqSection items={props.faq} />}

      {/* RELATED */}
      {props.related && props.related.length > 0 && (
        <section className="bg-black px-6 py-14 border-t border-white/[0.06]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">{props.relatedTitle ?? "Keep reading"}</h2>
            <div className="flex flex-wrap gap-2">
              {props.related.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-block text-[11px] font-semibold uppercase tracking-[2px] px-4 py-3 border border-white/15 text-white/75 hover:border-red hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOURCES */}
      {props.sources && props.sources.length > 0 && (
        <section className="bg-black px-6 pb-14">
          <div className="max-w-[1100px] mx-auto text-[12px] font-light text-white/40 leading-[1.8]">
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-3">Sources</h2>
            {props.sourcesNote && <p className="mb-2">{props.sourcesNote}</p>}
            <ul className="list-none">
              {props.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener nofollow" className="underline underline-offset-[3px] hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CHECK DATE */}
      <section className="bg-red flex flex-col items-center justify-center px-6 py-[clamp(72px,9vw,120px)] scroll-mt-16" id="check-date">
        <h2 className="text-[clamp(32px,6vw,72px)] font-black uppercase text-white text-center mb-5 leading-none tracking-[-1px]">
          Check your date
        </h2>
        <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/75 text-center max-w-[500px] mb-10 leading-relaxed">
          Tell me the date and the venue. I answer personally, usually within a day.
        </p>
        <ContactForm />
      </section>

      <SiteFooter />
    </>
  );
}
