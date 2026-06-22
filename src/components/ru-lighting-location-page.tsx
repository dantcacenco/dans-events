import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./scroll-reveal";
import type { LightingLocationData } from "./lighting-location-page";

export default function RuLightingLocationPage({ data }: { data: LightingLocationData }) {
  return (
    <div style={{ background: "#0C0B0D", color: "#fff", fontFamily: "inherit", WebkitFontSmoothing: "antialiased" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] px-6 h-16 flex items-center justify-between" style={{ background: "rgba(12,11,13,0.92)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
        <Link href="/lighting" className="flex items-center gap-0 text-white no-underline">
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">Dan&apos;s Events</span>
          <span className="mx-2.5 text-[11px] font-light" style={{ color: "#BC3021" }}>/</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-white">Освещение</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/lighting#collections" className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 hover:text-white transition-colors no-underline">Коллекции</Link>
          <Link href="/lighting#process" className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 hover:text-white transition-colors no-underline">Процесс</Link>
          <Link href="/lighting#inquire" className="text-[11px] font-medium uppercase tracking-[0.24em] no-underline" style={{ color: "#BC3021" }}>Запрос</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/photos/lighting-hero.png"
            alt="Атмосфера свадебного освещения"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 100%, rgba(188,48,33,0.18), transparent 70%)" }} />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-6" style={{ color: "#BC3021" }}>
            Атмосферное свадебное освещение
          </p>
          <h1 className="text-[clamp(42px,11vw,130px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-8">
            {data.city},<br />{data.stateAbbr}
          </h1>
          <p className="text-[clamp(15px,1.8vw,20px)] font-light text-white/70 max-w-[580px] mx-auto leading-relaxed">
            {data.heroTagline}
          </p>
          <div className="mt-12">
            <Link
              href="/lighting#inquire"
              className="inline-block text-white text-[12px] font-bold uppercase tracking-[0.3em] px-10 py-5 no-underline border border-[rgba(188,48,33,0.5)] hover:border-[#BC3021] transition-colors"
            >
              Начать разговор
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-[clamp(80px,10vw,140px)] px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-6" style={{ color: "#BC3021" }}>Наш подход</p>
          <h2 className="text-[clamp(26px,4vw,48px)] font-black uppercase text-white leading-[1.05] mb-8 tracking-[-0.025em]">
            Свет, который преображает<br />площадки <span style={{ color: "#BC3021" }}>{data.city}</span>.
          </h2>
          <p className="text-[clamp(15px,1.6vw,19px)] font-light text-white/60 leading-[1.85] mb-6">
            {data.introParagraph}
          </p>
          <p className="text-[clamp(15px,1.6vw,19px)] font-light text-white/60 leading-[1.85]">
            {data.regionDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* PHOTO BREAK — values image */}
      <section className="relative overflow-hidden" style={{ minHeight: "420px" }}>
        <Image
          src="/photos/lighting-values-desktop.png"
          alt="Атмосфера свадебного освещения"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.72)" }} />
        <div className="relative z-10 flex items-center justify-center min-h-[420px] px-6 py-20 text-center">
          <ScrollReveal>
            <p className="text-[clamp(20px,3.5vw,40px)] font-light italic text-white leading-[1.4] max-w-[700px] mx-auto">
              &laquo;Зал, в который входят гости, задаёт тон каждому последующему моменту. Это не декор. Это свет.&raquo;
            </p>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">Dan&apos;s Events / Освещение</p>
          </ScrollReveal>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section className="py-[clamp(60px,8vw,110px)] px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { n: "i", h: "Одна палитра.", p: "Тёплый белый и только тёплый белый. Сдержанность — это то, что читается как элегантность в зале и как вечность на каждой фотографии." },
              { n: "ii", h: "Каждое лицо.", p: "Тёплый свет универсально льстит. Гости, наряды, цветы, кожа — всё выглядит наилучшим образом под нашим освещением." },
              { n: "iii", h: "Каждый кадр.", p: "Ваш фотограф настолько хорош, насколько хорош свет, который мы ему оставляем. Мы даём им зал, который уже достоин съёмки." },
            ].map((item) => (
              <div key={item.n} className="p-10" style={{ background: "#0C0B0D" }}>
                <span className="block text-[11px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: "rgba(188,48,33,0.6)" }}>{item.n}</span>
                <h3 className="text-lg font-black uppercase text-white mb-3 tracking-[-0.01em]">{item.h}</h3>
                <p className="text-sm font-light leading-[1.8]" style={{ color: "rgba(255,255,255,0.42)" }}>{item.p}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* VENUES */}
      <section className="py-[clamp(80px,10vw,140px)] px-6 bg-white">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-4" style={{ color: "#BC3021" }}>Любимые площадки</p>
            <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em]">
              Наши любимые<br />площадки в {data.city}.
            </h2>
            <p className="mt-6 text-[clamp(14px,1.4vw,17px)] font-light text-black/50 leading-[1.75] max-w-[540px] mx-auto">
              У каждого пространства есть свой характер. Я проектирую свет так, чтобы он дополнял то, что площадка уже предлагает, — а не подавлял это.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {data.venues.map((venue, i) => (
              <ScrollReveal
                key={venue.name}
                className={`p-8 border border-black/[0.06] ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-3" style={{ color: "#BC3021" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-bold text-black mb-1">{venue.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/30 mb-3">{venue.location}</p>
                <p className="text-sm font-light text-black/60 leading-relaxed">{venue.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* PROOF PHOTO + CTA */}
      <section className="relative overflow-hidden">
        <Image
          src="/photos/lighting-proof-desktop.png"
          alt="Дизайн свадебного освещения"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.78)" }} />
        <div className="relative z-10 py-[clamp(80px,12vw,160px)] px-6 text-center">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-8" style={{ color: "#BC3021" }}>Бронирование открыто</p>
            <h2 className="text-[clamp(32px,7vw,84px)] font-black uppercase text-white leading-[0.92] tracking-[-0.03em] mb-8 max-w-[14ch] mx-auto">
              Создадим зал, который они запомнят.
            </h2>
            <p className="text-[clamp(14px,1.5vw,18px)] font-light text-white/55 max-w-[44ch] mx-auto leading-[1.8] mb-12">
              Расскажите нам вашу дату, площадку и настроение, которое вы хотите создать. Мы расскажем, что возможно.
            </p>
            <Link
              href="/lighting#inquire"
              className="inline-block text-white text-[12px] font-bold uppercase tracking-[0.3em] px-12 py-5 no-underline"
              style={{ border: "1px solid rgba(188,48,33,0.5)" }}
            >
              Начать разговор
            </Link>
            <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/22">
              Мы берём ограниченное число свадеб в сезоне &middot; Даты в {data.city} заканчиваются быстро
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* COLLECTIONS SUMMARY */}
      <section className="py-[clamp(80px,10vw,140px)] px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ScrollReveal className="max-w-[1000px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] mb-4" style={{ color: "#BC3021" }}>Коллекции</p>
            <h2 className="text-[clamp(26px,4.5vw,52px)] font-black uppercase text-white leading-[1.05] tracking-[-0.025em]">
              Три способа осветить ночь.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { name: "The Ambient", price: "от $1,200", desc: "Выверенная волна тёплого и белого света. Сдержанная — и никогда не шаблонная." },
              { name: "The Signature", price: "от $2,800", desc: "Полное преображение зала с особым моментом первого танца. Коллекция, которую выбирает большинство пар.", featured: true },
              { name: "The Bespoke", price: "от $5,000", desc: "Световой дизайн, созданный для каждого момента — от церемонии до последнего танца. Ничего шаблонного. Мы создаём его вместе." },
            ].map((col) => (
              <div key={col.name} className="p-10 flex flex-col" style={{ background: "#0C0B0D", borderTop: col.featured ? "2px solid #BC3021" : undefined }}>
                <div className="text-xl font-black uppercase text-white tracking-[-0.02em] mb-1">{col.name}</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: "#BC3021" }}>{col.price}</div>
                <p className="text-sm font-light leading-[1.75] mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>{col.desc}</p>
                <Link href="/lighting#collections" className="mt-auto text-[11px] font-semibold uppercase tracking-[0.24em] no-underline" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Подробнее &rarr;
                </Link>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="py-[clamp(80px,10vw,140px)] px-6 bg-white">
        <ScrollReveal className="max-w-[780px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,44px)] font-black uppercase text-black leading-[1.1] mb-14 tracking-[-0.025em]">
            Частые вопросы<br />об освещении в {data.city}<span className="inline-block w-3 h-3 ml-2 translate-y-0.5" style={{ background: "#BC3021" }} />
          </h2>
          <div className="divide-y divide-black/[0.08]">
            {data.faq.map((item) => (
              <div key={item.question} className="py-8">
                <h3 className="text-base font-bold text-black mb-3">{item.question}</h3>
                <p className="text-sm font-light text-black/60 leading-[1.85]">{item.answer}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* NEARBY */}
      {data.nearbyAreas.length > 0 && (
        <section className="py-14 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <ScrollReveal className="max-w-[1100px] mx-auto text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 text-white/30">Также обслуживаем</p>
            <p className="text-sm font-light text-white/45 leading-relaxed">
              {data.nearbyAreas.join(" · ")}
            </p>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/lighting" className="inline-block mb-4 text-[11px] font-bold uppercase tracking-[0.4em] text-white no-underline">
          Dan&apos;s Events / Освещение
        </Link>
        <div className="text-[11px] font-normal uppercase tracking-[0.5em] text-white/30 mb-6">
          Атмосферное свадебное освещение &middot; {data.city}, {data.stateAbbr} &amp; окрестности
        </div>
        <Link href="/" className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25 no-underline hover:text-white/50 transition-colors">
          &larr; На главную Dan&apos;s Events
        </Link>
        <div className="mt-8 text-[10px] text-white/15 tracking-[0.2em] uppercase">
          &copy; 2026 Dan&apos;s Events. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
