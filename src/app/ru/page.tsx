import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import ScrollReveal from "@/components/scroll-reveal";
import MobileNav from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Dan's Events — Свадебный диджей и ведущий | Эшвилл, NC",
  description: "Профессиональный свадебный диджей, ведущий и атмосферное освещение в Эшвилле, NC. Более 40 отзывов на 5 звёзд.",
  alternates: { canonical: "https://dans-events.com/ru" },
};

export default function RuHome() {
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
        <ul className="hidden md:flex gap-8 list-none">
          {[
            ["#craft", "Мастерство"],
            ["#services", "Услуги"],
            ["#proof", "Отзывы"],
            ["#check-date", "Проверить дату"],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="text-[11px] font-medium uppercase tracking-[2px] text-white hover:text-white/80 transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <MobileNav />
      </nav>

      {/* HERO — drop hero.jpg into public/photos/ to activate photo background */}
      <section className="min-h-svh flex flex-col justify-center items-center text-center px-6 pt-20 pb-15 relative overflow-hidden bg-[#3B3536]">
        <Image
          src="/photos/hero.jpg"
          alt="Dan's Events — Свадебный диджей и ведущий"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <h1 className="hero-headline relative z-10 text-[clamp(44px,13vw,150px)] font-black leading-[0.9] text-white uppercase tracking-[-2px] mb-12">
          <span className="block">Ваш</span>
          <span className="block">праздник</span>
          <span className="block">ваши</span>
          <span className="block">правила</span>
        </h1>
        <div className="hero-location relative z-10 text-xs font-normal tracking-[6px] uppercase text-white/60">
          Свадебный диджей &amp; ведущий — Эшвилл, NC
        </div>
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-[60px] bg-white/30 z-10" />
      </section>

      {/* SPLIT — The Craft */}
      <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[80vh]" id="craft">
        <ScrollReveal direction="left" className="bg-black p-[clamp(48px,8vw,120px)] flex flex-col justify-center">
          <h2 className="text-[clamp(26px,3.5vw,48px)] font-extrabold leading-[1.15] uppercase mb-8 text-white">
            Я не объявляю моменты. Я их <em className="not-italic text-red">создаю</em>.
          </h2>
          <p className="text-[clamp(17px,2vw,24px)] font-normal text-white/85 leading-relaxed">
            Я превращаю зал незнакомцев в семью на одну ночь.
          </p>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/70 leading-[1.75] mt-5 max-w-[520px]">
            Каждый тост, каждый первый танец, каждый момент, когда зал взрывается — это не случайность. Это мастерство. Умение чувствовать зал прежде, чем он сам понимает, чего хочет. Знать, когда поднять энергию, а когда дать моменту просто быть.
          </p>
        </ScrollReveal>
        {/* drop craft.jpg into public/photos/ to activate photo — grayscale treatment preserved */}
        <ScrollReveal direction="right" className="relative overflow-hidden min-h-[50vh] md:min-h-[400px] order-[-1] md:order-none bg-[#8a7e76]">
          <Image
            src="/photos/craft.jpg"
            alt="Dan выступает на свадьбе"
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
            Какого ведущего <em className="not-italic text-red">вы</em> хотите на своей свадьбе?
          </h2>
          <p className="text-[clamp(15px,1.6vw,18px)] font-light text-white/60 leading-[1.7]">
            Прочитайте оба варианта. Вы сразу всё поймёте.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
          <ScrollReveal direction="left" className="p-[clamp(32px,5vw,60px)] bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/30 block mb-8">Обычный ведущий</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-light text-white/35">
              &ldquo;Ну что, давайте поприветствуем жениха и невесту!&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/20">
              Вежливые аплодисменты. Пара возгласов. Нормально.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" className="p-[clamp(32px,5vw,60px)] bg-red">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 block mb-8">Dan&apos;s Events</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-normal text-white">
              &ldquo;Дамы и господа, сегодня вечером вам понадобится моя помощь. Мы сейчас вместе создадим момент, который Алекс и Эшли будут помнить всю жизнь. Мне нужна та энергия, от которой мурашки по коже. Вы готовы? Встречайте — непобедимый дуэт, незабываемая пара — господин и госпожа Алекс и Эшли!&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/80">
              <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
              Зал ВЗРЫВАЕТСЯ. Мурашки. Все на ногах.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FULL-SCREEN STATEMENT */}
      <section className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <ScrollReveal animation="scale" className="text-[clamp(32px,9vw,120px)] font-black uppercase text-black leading-none text-center tracking-[-2px]">
          ЗНАЧИМОЕ<br />МАСТЕРСТВО<span className="inline-block w-[clamp(16px,4vw,50px)] h-[clamp(16px,4vw,50px)] bg-red align-baseline ml-2 translate-y-1" />
        </ScrollReveal>
      </section>

      {/* TICKER */}
      <div className="bg-red py-5 overflow-hidden whitespace-nowrap">
        <div className="ticker-track inline-flex">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="contents">
              {["Ваш праздник навсегда", "Ваши правила — ваш праздник", "40+ отзывов на 5 звёзд", "Эшвилл, NC", "Свадебный диджей и ведущий", "От церемонии до последнего танца"].map((text) => (
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
            title: "Диджей",
            titleHref: "/ru/the-dj",
            number: "01",
            bg: "bg-red",
            descNode: (
              <>
                Знаете этот момент, когда песня попадает точно в цель и весь зал движется как одно целое? Это не просто плейлист. Это человек, который провёл недели, изучая вашу аудиторию — семью, обожающую Синатру, студенческих друзей, которым нужен хип-хоп 2000-х, момент, когда бабушка удивит всех на танцполе. Каждый переход — это решение. Каждое решение — осознанное.
              </>
            ),
          },
          {
            title: "Ведущий\nТамада",
            titleHref: "/ru/the-host",
            number: "02",
            bg: "bg-black",
            descNode: (
              <>
                В нашей культуре ведущего свадьбы называют{" "}
                <Link href="/ru/the-host" className="underline underline-offset-[3px] decoration-white/30 hover:decoration-white transition-colors">
                  тамада
                </Link>
                {" "}— эмоциональный якорь торжества. Не тот, кто зачитывает объявления по карточке. Тот, кто превращает отца невесты в героя его собственной речи. Кто даёт застенчивому дяде почувствовать себя самым важным человеком в зале. Кто создаёт общую идентичность для 150 незнакомцев ещё до первого танца.
              </>
            ),
          },
          {
            title: "Luxury\nОсвещение",
            titleHref: "/ru/lighting",
            number: "03",
            bg: "bg-red",
            descNode: (
              <>
                Зал, в который входят ваши гости — это не просто площадка. Это композиция. Сдержанная палитра тёплого и белого света, расставленного с умыслом, чтобы пространство выглядело роскошно ещё до первой ноты. Никаких вращающихся цветов. Никаких отвлекающих эффектов. Только свет, который льстит каждому лицу, делает каждую фотографию достойной рамки и создаёт ощущение, что зал всегда так и должен был выглядеть.
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

      {/* STATS — action.jpg background with red tint overlay */}
      <section className="min-h-[70vh] flex items-center justify-center text-center px-6 py-20 relative overflow-hidden bg-red" id="proof">
        <Image
          src="/photos/action.jpg"
          alt="Энергия свадебного приёма"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-red/75" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(100px,25vw,350px)] font-black uppercase tracking-[20px] text-white/[0.04] pointer-events-none whitespace-nowrap z-10">
          DAN&apos;S
        </span>
        <ScrollReveal animation="scale" className="relative z-10">
          <div className="text-[clamp(120px,30vw,400px)] font-black leading-[0.85] text-white tracking-[-10px]">40+</div>
          <div className="text-[clamp(14px,2vw,20px)] font-normal uppercase tracking-[8px] text-white/70 mt-5">40+ отзывов на 5 звёзд в Google</div>
          <div className="text-[clamp(12px,1.2vw,14px)] font-light text-white/45 mt-3 tracking-[2px]">От пар, доверивших мне самую важную ночь в своей жизни</div>
        </ScrollReveal>
      </section>

      {/* COMPARISON 2 — The Toast */}
      <section className="bg-white py-[clamp(80px,12vw,160px)] px-6">
        <ScrollReveal className="text-center max-w-[700px] mx-auto mb-16">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black mb-6 leading-[1.1]">
            Момент перед <em className="not-italic text-red">тостом</em>
          </h2>
          <p className="text-[clamp(15px,1.6vw,18px)] font-light text-black/50 leading-[1.7]">
            Ваша подруга-свидетельница волнуется. Она вот-вот произнесёт самую важную речь в своей жизни. Что скажет ваш ведущий?
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
          <ScrollReveal direction="left" className="p-[clamp(32px,5vw,60px)] bg-black/[0.03] border border-black/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-black/30 block mb-8">Обычный ведущий</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-light text-black/35">
              &ldquo;Ладно, следующей у нас речь свидетельницы. Сара, выходи!&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-black/20">
              Сара выходит с дрожащими руками. Зал продолжает переговариваться.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" className="p-[clamp(32px,5vw,60px)] bg-red">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/70 block mb-8">Dan&apos;s Events</span>
            <p className="text-[clamp(16px,2vw,22px)] leading-[1.65] italic font-normal text-white">
              &ldquo;Мне нужно ваше полное внимание, потому что сейчас произойдёт что-то особенное. Если вы знакомы с Сарой, вы знаете: она из тех людей, которые бросают всё, когда ты звонишь. Тех, рядом с кем каждый чувствует себя нужным. Эшли выбрала Сару своей свидетельницей не случайно — и вы сейчас сами всё поймёте. Встретим её так, чтобы она знала: весь этот зал на её стороне.&rdquo;
            </p>
            <p className="mt-8 text-xs font-medium uppercase tracking-[2px] text-white/80">
              <span className="inline-block w-2 h-2 bg-white mr-2 align-middle" />
              Стоячие овации ещё до первого слова Сары. Она произносит речь всей своей жизни.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* IDENTITY SECTION */}
      <section className="bg-black py-[clamp(80px,12vw,160px)] px-6 text-center" id="identity">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.1] mb-10">
            Вот что я <em className="not-italic text-red">понял</em>
          </h2>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65 mb-6">
            Большинство пар приходят ко мне без чёткого представления о том, чего хотят. Они приходят с ощущением — <strong className="text-white font-semibold">&ldquo;Мы хотим, чтобы гости провели лучшую ночь в своей жизни.&rdquo;</strong>
          </p>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65 mb-6">
            Вот в чём моя специализация. Не просто музыка. Не просто микрофон. <strong className="text-white font-semibold">Зал</strong>. Та энергия, от которой ваша тётя, клявшаяся не танцевать, в итоге оказывается последней на танцполе. Тот момент, когда обе семьи — познакомившиеся сегодня впервые — обнимаются на танцполе, словно знают друг друга годами.
          </p>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65 mb-6">
            Этого не добьёшься плейлистом. Это приходит от человека, который 20 лет учился <strong className="text-white font-semibold">чувствовать людей, объединять людей и создавать условия, в которых радость рождается сама собой</strong>.
          </p>
          <p className="text-[clamp(16px,2vw,22px)] font-light leading-[1.75] text-white/65">
            Если это именно то, что вы ищете, — нам есть о чём поговорить.
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
          alt="Свадебная пара"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80" />
        <span className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[60px] h-0.5 bg-red z-10" />
        <span className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[60px] h-0.5 bg-red z-10" />
        <ScrollReveal className="relative z-10">
          <span className="text-[clamp(80px,12vw,160px)] font-black text-red leading-[0.5] mb-10 block">&ldquo;</span>
          <p className="text-[clamp(20px,3vw,40px)] font-light leading-[1.5] text-white max-w-[900px] mx-auto mb-10 italic">
            Мы побывали на многих свадьбах. Ни одна даже близко не стояла. Освещение преобразило зал ещё до первой песни. Звук был полным и обволакивающим — присутствующим, но никогда не навязчивым. А Дэн как ведущий — это что-то совершенно особенное: он вёл весь вечер с такой лёгкостью, что мы ни разу не почувствовали руки режиссёра. Наши гости не просто развлекались. Они были частью чего-то настоящего.
          </p>
          <div className="text-xs font-bold uppercase tracking-[4px] text-white/40">
            Laura <span className="text-red">/</span> The Lumen House, 2025
          </div>
        </ScrollReveal>
      </section>

      {/* CHECK YOUR DATE */}
      <section className="bg-red min-h-screen flex flex-col items-center justify-center px-6 py-20" id="check-date">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white text-center mb-5 leading-none tracking-[-2px]">
            Проверить<br />дату
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="text-[clamp(14px,1.6vw,18px)] font-light text-white/70 text-center max-w-[500px] mb-12 leading-relaxed">
            Большинство пар, которые обращаются ко мне, жалеют, что не сделали это раньше. Субботы в пиковый сезон бронируются за 12+ месяцев.
          </p>
        </ScrollReveal>
        <ContactForm />
        <ScrollReveal>
          <p className="mt-6 text-[11px] font-normal text-white/50 tracking-[2px] uppercase">
            Я лично отвечаю в течение 24 часов
          </p>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-20 px-6 text-center border-t border-white/[0.06]">
        <ScrollReveal className="mb-4">
          <Image
            src="/logos/logo-white-transparent.png"
            alt="Dan's Events"
            width={200}
            height={23}
            className="h-[clamp(32px,4vw,48px)] w-auto mx-auto"
          />
        </ScrollReveal>
        <ScrollReveal>
          <div className="text-[11px] font-normal uppercase tracking-[6px] text-white/30 mb-12">
            Свадебный диджей &amp; ведущий — Эшвилл, NC
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <ul className="flex justify-center gap-10 list-none mb-12 flex-wrap">
            {[
              ["#craft", "Мастерство"],
              ["#services", "Услуги"],
              ["#proof", "Отзывы"],
              ["#check-date", "Бронь"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-[11px] font-medium uppercase tracking-[2px] text-white/35 hover:text-red transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal>
          <div className="text-[10px] text-white/15 tracking-[2px] uppercase">
            &copy; 2026 Dan&apos;s Events. Эшвилл, NC. Все права защищены.
          </div>
        </ScrollReveal>
      </footer>
    </>
  );
}
