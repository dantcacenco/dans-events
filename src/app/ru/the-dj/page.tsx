import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Диджей — Dan's Events | Свадебный диджей Эшвилл NC",
  description: "Дэн — музыкант с четырёх лет и профессиональный музыкальный продюсер. Его диджей-сеты создаются вручную, без шаблонов. Узнайте, чем диджей-музыкант отличается от сервиса с плейлистами.",
  alternates: { canonical: "https://dans-events.com/ru/the-dj" },
  openGraph: {
    title: "Диджей — Dan's Events",
    description: "Авторский микс, звук концертного уровня и 20 лет чтения аудитории. Не плейлист — живое выступление.",
    url: "https://dans-events.com/ru/the-dj",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Диджей" }],
  },
  twitter: { card: "summary_large_image", title: "Диджей — Dan's Events", description: "Авторский микс, звук концертного уровня, 20 лет чтения аудитории.", images: ["/opengraph-image"] },
};

export default function TheRuDJPage() {
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
      <section className="min-h-screen bg-black flex flex-col justify-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/photos/action.jpg" alt="Dan performing" fill className="object-cover object-center" priority />
        </div>
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 0% 50%, rgba(188,48,33,0.12), transparent 70%)" }} />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Диджей</p>
          <h1 className="text-[clamp(52px,12vw,160px)] font-black leading-[0.88] text-white uppercase tracking-[-3px] mb-10 max-w-[12ch]">
            Это не просто плейлист.
          </h1>
          <p className="text-[clamp(17px,2vw,24px)] font-light text-white/60 max-w-[52ch] leading-[1.75]">
            Я занимаюсь музыкой с четырёх лет. К каждому свадебному сету я подхожу так, как композитор подходит к партитуре — с замыслом, с мастерством, и с вашей историей в центре каждого решения.
          </p>
        </div>
      </section>

      {/* THE BACKGROUND */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Биография</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            Музыка — мой первый язык с четырёх лет.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              Большинство диджеев открыли для себя музыку в двадцать с лишним лет. Я — раньше, чем научился читать. В четыре года я начал учиться играть на инструментах: подбирал мелодии на слух, разбирался в том, как устроены песни изнутри. К тому моменту, как я стал профессионалом, я не просто знал много треков — я понимал, <em className="not-italic font-semibold text-black">почему</em> они работают.
            </p>
            <p>
              Этот фундамент вырос в карьеру музыкального продюсера. Я профессионально создаю и сводю треки — а значит, на вашей свадьбе я не просто ставлю музыку, я могу её формировать. Хотите, чтобы конкретная песня звучала иначе в момент вашего появления? Сделаю. Нужен плавный переход между двумя треками, которые, казалось бы, никогда не должны были звучать вместе? Справлюсь. Есть момент, для которого ни одна готовая песня не подходит идеально? Найдём ту версию, которая подойдёт.
            </p>
            <p>
              Большинство диджеев работают с готовым плейлистом, который перетасовывают от свадьбы к свадьбе. Я собираю ваш с нуля — за недели до вашего дня, — а потом убираю его в сторону и читаю зал прямо в ночь торжества.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* THE DIFFERENCE — split stat section */}
      <section className="bg-black py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-[clamp(40px,6vw,80px)] bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/25 mb-8">Обычный диджей</p>
              <ul className="space-y-5">
                {[
                  "В день свадьбы открывает Spotify или стандартную библиотеку",
                  "Ставит безопасные хиты, ничего не зная о ваших гостях",
                  "Одни и те же переходы на каждой свадьбе — кроссфейд в такт, и снова",
                  "Прибавляет громкость, когда танцпол пустеет (это не работает)",
                  "Зачитывает объявления с распечатанного листа",
                ].map((item) => (
                  <li key={item} className="flex gap-4 text-[clamp(14px,1.4vw,17px)] font-light text-white/30 leading-[1.6]">
                    <span className="text-white/15 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-[clamp(40px,6vw,80px)] bg-red">
              <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/60 mb-8">Dan&apos;s Events</p>
              <ul className="space-y-5">
                {[
                  "Недели подготовки: изучаю ваши семьи, гостей и вашу историю",
                  "Авторский микс — треки монтируются и сводятся под ваши конкретные моменты",
                  "Каждый переход — осознанное творческое решение",
                  "Читаю зал в реальном времени и выстраиваю динамику вечера",
                  "Музыка, которая никогда не будет слишком громкой, пошлой или шаблонной",
                ].map((item) => (
                  <li key={item} className="flex gap-4 text-[clamp(14px,1.4vw,17px)] font-light text-white leading-[1.6]">
                    <span className="text-white/50 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* THE CUSTOM MIXING */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Авторский микс</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            Ваши пожелания попадают не в очередь. Они попадают в микс.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              Когда вы говорите мне, что хотите конкретную песню для первого танца, я не просто нахожу её в Spotify и нажимаю play. Я слушаю её. Изучаю структуру. Если вступление слишком длинное — обрезаю. Если концовка затухает неловко — исправляю. Если вам нужен конкретный куплет, а не припев — собираю эту версию специально для вас.
            </p>
            <p>
              То же самое касается коктейльного часа, танцевального блока, финальной песни. Каждый музыкальный момент на вашей свадьбе подобран осознанно и, там где нужно, подогнан под тот момент, для которого он предназначен.
            </p>
            <p>
              Вы пришли с видением. Я создаю саундтрек под него — а не наоборот.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* SOUND QUALITY */}
      <section className="bg-black py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[1100px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Звук</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-white leading-[1.05] tracking-[-0.025em] mb-16 max-w-[20ch]">
            Профессиональное оборудование. Не потребительское. Не арендованное. Моё.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
            {[
              {
                n: "01",
                h: "Никаких искажений.",
                p: "Бытовые колонки начинают хрипеть на громкости. Профессиональные PA-системы созданы для того, чтобы чисто заполнять пространство на любом уровне громкости — без резкости, без перегруза.",
              },
              {
                n: "02",
                h: "Настройка под ваш зал.",
                p: "У каждого помещения своя акустика. Я приезжаю заранее, обхожу пространство и настраиваю систему под конкретный зал — чтобы звук был правильным и за столиками, и на танцполе.",
              },
              {
                n: "03",
                h: "Присутствует, не давит.",
                p: "Хороший звук должен наполнять зал, не требуя к себе внимания. Музыка на правильном уровне — это когда гости могут спокойно разговаривать за столом и при этом чувствовать бас под ногами. Одновременно.",
              },
            ].map((item) => (
              <div key={item.n} className="p-10 bg-[#0a0a0a]">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-red block mb-5">{item.n}</span>
                <h3 className="text-xl font-black uppercase text-white mb-4 tracking-[-0.01em]">{item.h}</h3>
                <p className="text-sm font-light text-white/45 leading-[1.8]">{item.p}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT I WON'T DO */}
      <section className="bg-white py-[clamp(80px,10vw,150px)] px-6">
        <ScrollReveal className="max-w-[800px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[6px] text-red mb-8">Мой стандарт</p>
          <h2 className="text-[clamp(28px,5vw,56px)] font-black uppercase text-black leading-[1.05] tracking-[-0.025em] mb-10">
            Чего вы не услышите на свадьбе от Dan&apos;s Events.
          </h2>
          <div className="space-y-6 text-[clamp(15px,1.6vw,20px)] font-light text-black/65 leading-[1.85]">
            <p>
              Я не ставлю Cha Cha Slide, Cupid Shuffle и YMCA, если вы сами специально об этом не попросите. Я не включаю воздушные гудки между треками. Я не кричу в микрофон «как вы все сегодня?!». Я не делаю музыку настолько громкой, что бабушки вынуждены уходить из зала.
            </p>
            <p>
              Я не использую пушки с конфетти, пену или светящиеся браслеты в качестве замены умению читать зал. Гэджеты появляются тогда, когда музыка не работает. Когда музыка работает, танцпол живёт сам по себе.
            </p>
            <p>
              Моя задача — сделать так, чтобы вечер ощущался как нечто неизбежное: будто каждая следующая песня всегда была именно здесь, а энергия нарастала ровно тогда, когда должна была. Это то, что даёт два десятилетия музыкантства. Не плейлист — живое выступление.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="bg-red py-[clamp(80px,10vw,140px)] px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[clamp(32px,7vw,90px)] font-black uppercase text-white leading-[0.92] tracking-[-2px] mb-6">
            Поговорим о вашем вечере.
          </h2>
          <p className="text-[clamp(15px,1.6vw,20px)] font-light text-white/70 max-w-[44ch] mx-auto mb-12 leading-relaxed">
            Расскажите мне, что вы хотите, чтобы почувствовали ваши гости. Я расскажу, как мы этого достигнем.
          </p>
          <Link href="/#check-date" className="inline-block bg-black text-white text-[13px] font-bold uppercase tracking-[4px] px-12 py-5 hover:bg-white hover:text-black transition-colors">
            Проверить дату
          </Link>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
        <Link href="/" className="inline-block mb-4">
          <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} className="h-8 w-auto mx-auto" />
        </Link>
        <div className="text-[11px] uppercase tracking-[6px] text-white/30 mb-4">Wedding DJ &amp; MC — Asheville, NC</div>
        <div className="text-[10px] text-white/15 tracking-[2px] uppercase">&copy; 2026 Dan&apos;s Events. Все права защищены.</div>
      </footer>
    </>
  );
}
