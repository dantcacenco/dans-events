import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./scroll-reveal";
import type { HostingLocationData } from "./hosting-location-page";

export default function RuHostingLocationPage({ data }: { data: HostingLocationData }) {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-white/[0.08] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="block">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-7 w-auto" priority />
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link href="/#craft" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">The Craft</Link></li>
          <li><Link href="/#services" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Services</Link></li>
          <li><Link href="/#proof" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Reviews</Link></li>
          <li><Link href="/#check-date" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Check Your Date</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="min-h-[70vh] bg-red flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[6px] text-white/60 mb-6">
            Ведущий &amp; Тамада
          </p>
          <h1 className="text-[clamp(36px,10vw,120px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-8">
            {data.city},<br />{data.stateAbbr}
          </h1>
          <p className="text-[clamp(16px,2vw,22px)] font-light text-white/80 max-w-[600px] mx-auto leading-relaxed">
            {data.heroTagline}
          </p>
          <div className="mt-12">
            <Link href="/#check-date" className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors">
              Проверить дату
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6 border-t border-white/[0.06]">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-white leading-[1.15] mb-8">
            Ваша свадьба в {data.city},<br /><em className="not-italic text-red">проведённая с душой.</em>
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
            Что ведущий делает <em className="not-italic text-red">на самом деле</em>
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
          <ScrollReveal className="p-[clamp(32px,5vw,60px)] bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 block mb-8">Большинство ведущих</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-light text-white/35">
              &ldquo;Итак, дамы и господа, впервые в жизни как муж и жена — встречайте молодых...&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/20">
              Вежливые аплодисменты. Момент проходит.
            </p>
          </ScrollReveal>
          <ScrollReveal className="p-[clamp(32px,5vw,60px)] bg-red">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 block mb-8">Dan&apos;s Events</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-normal text-white">
              &ldquo;Прежде чем мы откроем двери, я прошу всех на секунду закрыть глаза. Подумайте об этих двух людях — о том, что им пришлось пройти, чтобы оказаться здесь сегодня вечером. А когда откроете глаза, мы встретим их так, как они того заслуживают.&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/80">
              <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
              Зал взрывается. Гости вскакивают с мест ещё до того, как открываются двери.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT I BRING */}
      <section className="bg-white py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[900px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-black leading-[1.15] mb-12 text-center">
            Что я <em className="not-italic text-red">привношу</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { title: "Программа", desc: "Я выстраиваю ход вечера — каждый переход выверен по времени, каждый момент подготовлен так, чтобы следующий бил сильнее предыдущего." },
              { title: "Тосты", desc: "Я представляю каждого выступающего до того, как он возьмёт слово. К тому моменту, как они берут микрофон, зал уже на их стороне." },
              { title: "Энергия", desc: "Я читаю зал в режиме реального времени и подстраиваюсь. Знаю, когда нагнетать, а когда отступить. Мной не нужно управлять." },
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
              Наши любимые площадки в <em className="not-italic text-red">{data.city}</em>.
            </h2>
            <p className="text-[clamp(14px,1.4vw,18px)] font-light text-white/45 leading-[1.7] max-w-[600px] mx-auto">
              Каждое пространство диктует свой ритм программы. Я подстраиваюсь под площадку, а не наоборот.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {data.venues.map((venue, i) => (
              <ScrollReveal key={venue.name} className={`p-8 border border-white/[0.06] ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}>
                <span className="text-[10px] font-bold uppercase tracking-[3px] text-red block mb-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-bold text-white mb-1">{venue.name}</h3>
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
            Свадьба в {data.city}?
          </h2>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/70 max-w-[500px] mx-auto mb-10 leading-relaxed">
            Субботы в сезон разбирают за 12 и более месяцев вперёд. Закрепите свою дату, пока это не сделал кто-то другой.
          </p>
          <Link href="/#check-date" className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors">
            Проверить дату
          </Link>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="bg-white py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-black leading-[1.15] mb-12 text-center">
            Частые вопросы<span className="inline-block w-3 h-3 bg-red ml-2 translate-y-0.5" />
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
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Также работаем в</p>
            <p className="text-sm font-light text-white/50 leading-relaxed">{data.nearbyAreas.join(" · ")}</p>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
        <Link href="/" className="inline-block mb-4">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-8 w-auto mx-auto" />
        </Link>
        <div className="text-[11px] font-normal uppercase tracking-[6px] text-white/30 mb-8">
          Wedding DJ &amp; MC — Asheville, NC
        </div>
        <div className="text-[10px] text-white/15 tracking-[2px] uppercase">
          &copy; 2026 Dan&apos;s Events. Все права защищены.
        </div>
      </footer>
    </>
  );
}
