import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Ведущий — Тамада | Dan's Events | Свадебный ведущий Эшвилл NC",
  description: "Тамада — это не конферансье с микрофоном. Это эмоциональный стержень торжества: традиция, уходящая корнями в культуру грузинского застолья, которую Дэн привносит на вашу свадьбу.",
  alternates: { canonical: "https://dans-events.com/ru/the-host" },
  openGraph: {
    title: "Тамада — Dan's Events",
    description: "Что значит по-настоящему вести свадьбу. Древнее искусство тамады — и почему оно меняет всё.",
    url: "https://dans-events.com/ru/the-host",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Ведущий" }],
  },
  twitter: { card: "summary_large_image", title: "Тамада — Dan's Events", description: "Что значит по-настоящему вести свадьбу.", images: ["/opengraph-image"] },
};

export default function TheRuHostPage() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-black border-b border-white/[0.08] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="block">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-7 w-auto" priority />
        </Link>
        <Link href="/#check-date" className="text-[11px] font-bold uppercase tracking-[3px] text-red hover:text-white transition-colors">
          Проверить дату
        </Link>
      </nav>

      {/* HERO */}
      <section className="min-h-screen bg-red flex flex-col justify-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-white/50 mb-8">Ведущий · Тамада</p>
          <h1 className="text-[clamp(52px,12vw,160px)] font-black leading-[0.88] text-white uppercase tracking-[-3px] mb-10 max-w-[14ch]">
            Тамада.<br />Искусство вести вечер.
          </h1>
          <p className="text-[clamp(17px,2vw,24px)] font-light text-white/80 max-w-[52ch] leading-[1.75]">
            В древнейших традициях застолья тамада — это не тот, кто держит микрофон. Тамада — это причина, по которой у праздника есть душа.
          </p>
        </div>
      </section>

      {/* WHAT IS A TAMADA */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Происхождение</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            Что такое тамада?
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              Слово <em className="not-italic font-semibold text-black">тамада</em> (თამადა) уходит корнями в древнюю грузинскую традицию <em className="not-italic font-semibold text-black">супры</em> — ритуального застолья, которое в грузинской культуре является одним из самых священных общественных институтов. Супра — это не просто трапеза. Это церемония, причастие, способ отметить важнейшие мгновения человеческого бытия: рождения, свадьбы, утраты, встречи после разлуки.
            </p>
            <p>
              Тамада — это человек, которому доверено вести супру. Не потому что он говорит больше всех, а потому что он тоньше всех чувствует. Тамаду выбирают за мудрость, красноречие и — главное — за умение читать зал: понимать, когда момент требует лёгкости, когда — весомости, а когда молчание говорит сильнее любых слов.
            </p>
            <p>
              Каждый тост на грузинской супре следует определённому порядку: за Бога, за мир, за живых, за ушедших, за любовь, за тех, кто не может быть рядом. Тамада не просто произносит эти тосты — он их <em className="not-italic font-semibold text-black">чувствует</em>, и заставляет чувствовать весь стол. Великий тамада может за один тост довести незнакомых людей до слёз — а потом до смеха и общей песни.
            </p>
            <p>
              Традиция распространилась из Грузии по всему Кавказу и вошла в славянскую и восточноевропейскую культуру, где тамада стал главной фигурой любого настоящего торжества. В этой традиции быть приглашённым тамадой на чью-то свадьбу — одна из высших почестей. Это значит: тебе доверяют эмоциональную память самой важной ночи в жизни этих людей.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT THIS MEANS AT YOUR WEDDING */}
      <section className="bg-black py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">На вашей свадьбе</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.05] tracking-[-0.025em] mb-10">
            Что это значит для вашего вечера.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-white/60 leading-[1.85]">
            <p>
              Большинство свадебных ведущих — это дикторы. Они объявляют имена, зачитывают программу, по сигналу просят аплодисменты. Это функция, а не мастерство. В результате вечер переходит от момента к моменту, не связывая их — происходят события, а не разворачивается история.
            </p>
            <p>
              Я подхожу к вашей свадьбе так, как тамада подходит к супре. Я не просто представляю тех, кто говорит тосты — я создаю в зале атмосферу, при которой каждый выступающий выходит к уже расположенной к нему аудитории. Я не просто объявляю первый танец — я выстраиваю момент перед ним так, что когда зазвучит музыка, весь зал уже затаил дыхание.
            </p>
            <p>
              Я узнаю вашу историю задолго до свадебного дня. Кто эти люди. Что их связывает. Где живёт эмоция. Какие моменты должны быть большими, а какие — тихими. И в тот вечер я держу эти знания при себе и использую их — незаметно, негромко — чтобы каждый человек в зале прожил этот праздник по-настоящему.
            </p>
            <p>
              Гостям не нужно знать, что я это делаю. Они просто это чувствуют. Они чувствуют, что у вечера есть пульс.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* THE SPECIFIC SKILLS */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8 text-center">Что это значит на практике</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-16 text-center max-w-[18ch] mx-auto">
            Невидимая рука за каждым моментом.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              {
                title: "Подготовка к тостам.",
                body: "Каждого выступающего я представляю так, чтобы зал был готов его принять. Когда человек берёт микрофон, аудитория уже на его стороне — уже наклонилась вперёд. Хорошая подводка способна сделать обычный тост незабываемым.",
              },
              {
                title: "Объединение двух семей.",
                body: "Вы пригласили людей, которые никогда не встречались. К концу вечера они должны почувствовать, что знают друг друга давно. Я создаю общие моменты — отсылки, смех, эмоции, — которые дают обеим сторонам зала совместные воспоминания, с которыми они уйдут домой.",
              },
              {
                title: "Чувствую зал, а не сценарий.",
                body: "Я работаю не по жёсткому таймингу, а по залу. Если момент просит продления — я продлеваю. Если энергия готова двигаться — я двигаю. Я подстраиваюсь в реальном времени, чтобы вечер никогда не ощущался как конвейер.",
              },
              {
                title: "Застенчивый дядя.",
                body: "На каждой свадьбе есть человек, который пришёл не зная никого и сидит у стены, надеясь остаться незамеченным. Часть моей работы — сделать так, чтобы этот человек почувствовал себя своим. Тамада не оставляет никого за бортом.",
              },
              {
                title: "Двуязычный, двукультурный.",
                body: "Если среди ваших гостей разные языки и культурные традиции — я работаю на всех уровнях. Я веду на английском и русском. Я понимаю эмоциональный код разных культур и чту каждую из них, не давая никому почувствовать себя чужим.",
              },
              {
                title: "Никакого «ручного управления».",
                body: "В день свадьбы вы не должны управлять подрядчиками. Я задаю нужные вопросы заранее, тщательно готовлюсь и работаю самостоятельно. В тот день ваша единственная задача — быть здесь. Всё остальное — моя.",
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
            Задача тамады — не стать самым запоминающимся человеком в зале. Его задача — сделать так, чтобы запомнились те, кто должен быть запомнен.
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[4px] text-white/50">Dan&apos;s Events</p>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="bg-black py-[clamp(80px,10vw,140px)] px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white leading-[0.92] tracking-[-2px] mb-6">
            Давайте спроектируем ваш вечер.
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/55 max-w-[44ch] mx-auto mb-12 leading-relaxed">
            Расскажите мне, кто будет в зале — и я расскажу, как сделать так, чтобы каждый из них почувствовал: они были созданы быть здесь вместе.
          </p>
          <Link href="/#check-date" className="inline-block bg-red text-white text-[13px] font-bold uppercase tracking-[4px] px-12 py-5 hover:bg-white hover:text-black transition-colors">
            Проверить дату
          </Link>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
        <Link href="/" className="inline-block mb-4">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-8 w-auto mx-auto" />
        </Link>
        <div className="text-[11px] uppercase tracking-[6px] text-white/30 mb-4">Свадебный DJ и Ведущий — Asheville, NC</div>
        <div className="text-[10px] text-white/15 tracking-[2px] uppercase">&copy; 2026 Dan&apos;s Events. Все права защищены.</div>
      </footer>
    </>
  );
}
