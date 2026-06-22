import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./scroll-reveal";
import type { DJLocationData } from "./dj-location-page";

export default function RuDJLocationPage({ data }: { data: DJLocationData }) {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-white/[0.08] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="block">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-7 w-auto" priority />
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link href="/#craft" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Мастерство</Link></li>
          <li><Link href="/#services" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Услуги</Link></li>
          <li><Link href="/#proof" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Отзывы</Link></li>
          <li><Link href="/#check-date" className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Проверить дату</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="min-h-[70vh] bg-black flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-red/10" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-red/30" />
        <div className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[6px] text-red mb-6">Свадебный диджей</p>
          <h1 className="text-[clamp(36px,10vw,120px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-8">
            {data.city},<br />{data.stateAbbr}
          </h1>
          <p className="text-[clamp(16px,2vw,22px)] font-light text-white/70 max-w-[600px] mx-auto leading-relaxed">
            {data.heroTagline}
          </p>
          <div className="mt-12">
            <Link href="/#check-date" className="inline-block bg-red text-white text-[13px] font-bold uppercase tracking-[4px] px-10 py-5 hover:bg-white hover:text-black transition-colors">
              Проверить дату
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6 border-t border-white/[0.06]">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-white leading-[1.15] mb-8">
            Свадебный диджей в {data.city},<br /><em className="not-italic text-red">как надо.</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8] mb-6">
            {data.introParagraph}
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/65 leading-[1.8]">
            {data.regionDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* WHAT MAKES THE DIFFERENCE */}
      <section className="bg-white py-[clamp(80px,10vw,140px)] px-6">
        <ScrollReveal className="max-w-[900px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-extrabold uppercase text-black leading-[1.15] mb-12 text-center">
            Что я <em className="not-italic text-red">привношу</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { title: "Музыка", desc: `Подбор треков специально для вашей свадьбы в ${data.city} — не шаблон. Каждая песня заслуживает своего места этим вечером.` },
              { title: "Чтение зала", desc: "Я изучаю ваших гостей до начала вечера. Родственники, которые любят классику. Друзья, которым нужно что-то, что чувствуется в теле. Я корректирую программу в режиме реального времени." },
              { title: "Переходы", desc: "Каждый переход между треками — это решение. Тишина между песнями, нарастание перед первым танцем, момент, который возвращает всех на танцпол — всё продуманно." },
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
              У каждого зала своя акустика, своя энергетика, своя атмосфера. Я умею работать с пространством, а не против него.
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
            Субботы в высокий сезон бронируют за 12 и более месяцев. Закрепите свою дату раньше, чем это сделает кто-то другой.
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
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 mb-6">Также обслуживаем</p>
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
