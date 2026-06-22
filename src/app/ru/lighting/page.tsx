"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import s from "@/app/lighting/lighting.module.css";

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

export default function RuLightingPage() {
  useReveal();

  return (
    <div className={s.page}>
      {/* ── НАВИГАЦИЯ ───────────────────────────────────────────────── */}
      <nav className={s.nav}>
        <div className={`${s.wrap} ${s.navIn}`}>
          <Link href="/ru" className={s.navBrand}>
            <span className={s.navBrandMain}>Dan&apos;s Events</span>
            <span className={s.navBrandSep}>/</span>
            <span className={s.navBrandSub}>Освещение</span>
          </Link>
          <div className={s.navLinks}>
            <a href="#difference" className={s.navLink}>Наше отличие</a>
            <a href="#collections" className={s.navLink}>Коллекции</a>
            <a href="#process" className={s.navLink}>Процесс</a>
            <a href="#inquire" className={`${s.navLink} ${s.navCta}`}>Запрос</a>
          </div>
        </div>
      </nav>

      {/* ── ГЕРОЙ ───────────────────────────────────────────────────── */}
      <header className={s.hero}>
        {/* Десктоп: фото на фоне */}
        <div className={s.heroBgDesktop}>
          <Image
            src="/photos/lighting-hero.png"
            alt="Атмосфера свадебного освещения"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Мобильный: видео на фоне в петле */}
        <video
          className={s.heroBgVideo}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/hero-lighting.mp4" type="video/mp4" />
        </video>
        {/* Тёмный оверлей — одинаковый для обоих */}
        <div className={s.heroBgOverlay} />
        <div className={s.heroBloom} />
        <div className={`${s.heroBeam} ${s.heroBeamL}`} />
        <div className={`${s.heroBeam} ${s.heroBeamR}`} />
        <div className={s.wrap}>
          <div className={`${s.heroContent} ${s.stagger}`}>
            <div className={`${s.eyebrow} ${s.reveal}`}>
              Атмосферное свадебное освещение &middot; Эшвилл и окрестности
            </div>
            <h1 className={`${s.heroH1} ${s.reveal}`}>
              Свет — это то, что<br />
              они <span className={s.heroH1Accent}>запомнят.</span>
            </h1>
            <p className={`${s.heroLede} ${s.reveal}`}>
              Мы создаём единую, сдержанную палитру тёплого и белого света, которая превращает
              площадку в самый красивый зал, где когда-либо бывали ваши гости, — и делает каждую
              фотографию достойной рамки.
            </p>
            <div className={`${s.heroActions} ${s.reveal}`}>
              <a href="#inquire" className={s.btn}>Начать разговор</a>
              <a href="#collections" className={`${s.btn} ${s.btnGhost}`}>
                Посмотреть коллекции <span className={s.btnGhostArr}>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
        <div className={s.scrollCue}>Листать</div>
      </header>

      {/* ── НАШЕ ОТЛИЧИЕ ────────────────────────────────────────────── */}
      <section className={s.section} id="difference">
        <div className={`${s.wrap} ${s.philo}`}>
          <div className={s.reveal}>
            <div className={s.eyebrow}>Наше отличие</div>
            <h2 className={s.philoH2}>Там, где другие добавляют цвет, мы создаём атмосферу.</h2>
          </div>
          <div className={s.reveal}>
            <p className={s.philoP}>
              Большинство световых установок кричат. Наша — нет. Мы работаем всего в двух тонах —{" "}
              <em className={s.philoEm}>тёплый белый</em> и <em className={s.philoEm}>белый</em> —
              потому что сдержанность — это то, что читается как элегантность в зале и вечность
              на фотографиях.
            </p>
            <p className={s.philoP}>
              Никаких вращающихся цветов. Никакого ночного клуба. Только свет, расставленный с
              намерением, — чтобы пространство ощущалось как продуманное, а не украшенное. Этот
              эффект гости почувствуют раньше, чем смогут его назвать, — и вы будете видеть его
              в каждом кадре до конца своей жизни.
            </p>
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ ЭТО ВАЖНО ────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop} ${s.sectionWithBg}`}>
        <div className={s.sectionBgImg}>
          <Image src="/photos/lighting-values.png" alt="Свадебное освещение со звёздными лучами" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgImgDesktop}>
          <Image src="/photos/lighting-values-desktop.png" alt="Свадебное освещение со звёздными лучами" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgOverlay} />
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>Почему это важно</div>
            <h2 className={s.secHeadH2}>
              Та единственная деталь, которую<br />гости будут чувствовать всю ночь.
            </h2>
          </div>
          <div className={`${s.values} ${s.reveal}`}>
            <div className={s.val}>
              <span className={s.valN}>i</span>
              <div>
                <h3 className={s.valH3}>Это красит<br />каждого.</h3>
                <p className={s.valP}>Кожа, платья, цветы, лица — тёплый свет ко всем добр. Каждый гость выглядит превосходно.</p>
              </div>
            </div>
            <div className={s.val}>
              <span className={s.valN}>ii</span>
              <div>
                <h3 className={s.valH3}>Это преображает<br />пространство.</h3>
                <p className={s.valP}>Каким бы ни был зал вашей площадки, мы сделаем его тем самым, что сохраняют в фотографиях.</p>
              </div>
            </div>
            <div className={s.val}>
              <span className={s.valN}>iii</span>
              <div>
                <h3 className={s.valH3}>Это создаёт<br />фотографии.</h3>
                <p className={s.valP}>Фотограф настолько хорош, насколько хорош свет. Мы даём им зал, который уже достоин съёмки.</p>
              </div>
            </div>
            <div className={s.val}>
              <span className={s.valN}>iv</span>
              <div>
                <h3 className={s.valH3}>Это нельзя<br />переснять.</h3>
                <p className={s.valP}>Свадьба не знает дублей. Мы проектируем так, чтобы вам нечего было менять.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── КОЛЛЕКЦИИ ───────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop}`} id="collections">
        <div className={s.secGlow} />
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>Коллекции</div>
            <h2 className={s.secHeadH2}>Три подхода к освещению вечера.</h2>
            <p className={s.lede} style={{ marginTop: "18px" }}>
              Каждая свадьба получает индивидуальное предложение под конкретный зал и видение.
              Здесь начинается разговор.
            </p>
          </div>

          <div className={s.collections}>
            {/* The Bespoke */}
            <div className={`${s.col} ${s.colFeature} ${s.reveal}`}>
              <div className={s.colName}>The Bespoke</div>
              <div className={s.colInvest}>Инвестиция от</div>
              <div className={s.colPrice}>$5,000</div>
              <p className={s.colDesc}>
                Световой дизайн, созданный для каждого момента — от церемонии до последнего
                танца и дней вокруг. Полный инструмент, запрограммированный под вашу ночь.
                Никаких шаблонов. Мы разрабатываем его вместе.
              </p>
              <div className={s.colIncl}>
                <span className={s.colInclB}>Полный риг</span> — движущийся свет, многослойные
                заливки, архитектурные перекладины, акцентные светильники, облако у пола
                для первого танца и холодные искры для финала. Многодневный формат доступен.
              </div>
              <a href="#inquire" className={s.btn}>Запросить консультацию по дизайну</a>
            </div>

            {/* The Signature */}
            <div className={`${s.col} ${s.reveal}`}>
              <div className={s.badge}>Самый популярный</div>
              <div className={s.colName}>The Signature</div>
              <div className={s.colInvest}>Инвестиция от</div>
              <div className={s.colPrice}>$2,800</div>
              <p className={s.colDesc}>
                Полное преображение зала с индивидуально спроектированным моментом первого танца —
                пакет, который выбирают большинство пар, и именно он делает вечер по-настоящему
                осмысленным.
              </p>
              <div className={s.colIncl}>
                <span className={s.colInclB}>Премиальный уровень</span> — движущийся свет,
                многослойные заливки, архитектурные акценты, акцентные светильники и финал
                с холодными искрами, синхронизированный с вашей программой.
              </div>
              <a href="#inquire" className={s.btn}>Проверить дату</a>
            </div>

            {/* The Ambient */}
            <div className={`${s.col} ${s.reveal}`}>
              <div className={s.colName}>The Ambient</div>
              <div className={s.colInvest}>Инвестиция от</div>
              <div className={s.colPrice}>$1,200</div>
              <p className={s.colDesc}>
                Тихая, красивая заливка тёплым светом, которая поднимает зал и украшает каждую
                фотографию двоих из вас. Сдержанно — и никогда не по шаблону.
              </p>
              <div className={s.colIncl}>
                <span className={s.colInclB}>Утончённо</span> — продуманная заливка тёплым и белым
                светом, выставленная и сбалансированная под ваше пространство. Самое важное,
                сделанное с заботой.
              </div>
              <a href="#inquire" className={s.btn}>Проверить дату</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ОБОРУДОВАНИЕ ────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop}`}>
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>Оборудование</div>
            <h2 className={s.secHeadH2}>
              Концертные риги.<br />Не довесок к диджейскому пульту.
            </h2>
            <p className={s.lede} style={{ marginTop: "18px" }}>
              Большинство диджеев приезжают с набором пар-светильников за $200 и лазером за $70
              с Amazon. Это стандарт отрасли. Это не наш стандарт.
            </p>
          </div>
          <div className={`${s.gearGrid} ${s.reveal}`}>
            <div className={`${s.gearCol} ${s.gearColDark}`}>
              <span className={s.gearTag}>Типичный диджейский световой комплект</span>
              <ul className={s.gearList}>
                {[
                  "Набор пар-светильников за $200 — одни и те же 16 цветов всю ночь",
                  "Лазер с Amazon за $70, направленный в потолок",
                  "Статичные светильники, прикрученные и забытые",
                  "Перенасыщенные цвета, конкурирующие со всем вокруг",
                  "Никакой дизайн-концепции — просто включено и работает",
                ].map((item) => (
                  <li key={item} className={s.gearItem}>
                    <span className={s.gearDash}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${s.gearCol} ${s.gearColRed}`}>
              <span className={`${s.gearTag} ${s.gearTagBright}`}>Dan&apos;s Events — концертный риг стоимостью $20K+</span>
              <ul className={s.gearList}>
                {[
                  "Движущиеся головы, хореографически привязанные к ключевым моментам программы",
                  "Профессиональные LED-прожекторы заливки — равномерные, откалиброванные, красивые",
                  "Архитектурная подсветка, расставленная специально под вашу площадку",
                  "Холодные искры и системы низкого тумана для ключевых моментов",
                  "Каждый прибор размещён как осознанное композиционное решение",
                ].map((item) => (
                  <li key={item} className={`${s.gearItem} ${s.gearItemBright}`}>
                    <span className={s.gearCheck}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── ПРОЦЕСС ─────────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop}`} id="process">
        <div className={s.wrap}>
          <div className={`${s.secHead} ${s.reveal}`}>
            <div className={s.eyebrow}>Как это работает</div>
            <h2 className={s.secHeadH2}>Безупречно, по задумке.</h2>
          </div>
          <div className={s.process}>
            <div className={`${s.reveal}`}>
              <div className={s.redBar} />
              <div className={s.stepN}>01</div>
              <h3 className={s.stepH3}>Разговор</h3>
              <p className={s.stepP}>Мы узнаём вашу площадку, ваше видение и именно то ощущение, которое вы хотите получить от вечера. Никакого давления — только план.</p>
            </div>
            <div className={`${s.reveal}`}>
              <div className={s.redBar} />
              <div className={s.stepN}>02</div>
              <h3 className={s.stepH3}>Дизайн</h3>
              <p className={s.stepP}>Световой план, созданный для вашего пространства — предложен, доработан и подтверждён до мельчайшего момента.</p>
            </div>
            <div className={`${s.reveal}`}>
              <div className={s.redBar} />
              <div className={s.stepN}>03</div>
              <h3 className={s.stepH3}>Вечер</h3>
              <p className={s.stepP}>Мы приезжаем заранее, устанавливаем оборудование тихо и исчезаем. Вы не замечаете работы — только зал, который она оставляет.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ОТЗЫВ ───────────────────────────────────────────────────── */}
      <section className={`${s.section} ${s.ruleTop} ${s.sectionWithBg}`}>
        <div className={s.sectionBgImg}>
          <Image src="/photos/lighting-proof.png" alt="Элегантный свадебный приём в красном освещении" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgImgDesktop}>
          <Image src="/photos/lighting-proof-desktop.png" alt="Элегантный свадебный приём в красном освещении" fill className="object-cover object-center" />
        </div>
        <div className={s.sectionBgOverlay} />
        <div className={s.wrap}>
          <div className={`${s.quote} ${s.reveal}`}>
            <span className={s.qMark}>&ldquo;</span>
            <blockquote className={s.qBlockquote}>
              Наши гости до сих пор говорят об этом зале. Фотографии выглядят как из журнала.
            </blockquote>
            <div className={s.qBy}>— Лора &middot; The Lumen House, 2025</div>
          </div>
        </div>
      </section>

      {/* ── ФИНАЛЬНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ ─────────────────────────────── */}
      <section className={s.closing} id="inquire">
        <div className={s.closingBloom} />
        <div className={`${s.wrap} ${s.closingInner}`}>
          <div className={`${s.eyebrow} ${s.reveal}`}>Запись открыта</div>
          <h2 className={`${s.closingH2} ${s.reveal}`}>
            Давайте создадим зал, который они запомнят.
          </h2>
          <p className={`${s.closingP} ${s.reveal}`}>
            Сообщите нам дату, площадку и ощущение, которого вы хотите добиться.
            Мы расскажем, что возможно.
          </p>
          <div className={s.reveal}>
            <Link href="/#check-date" className={s.btn}>Начать разговор</Link>
          </div>
          <div className={`${s.scarcity} ${s.reveal}`}>
            Мы берём ограниченное число свадеб за сезон &middot; Осень в горах бронируется первой
          </div>
        </div>
      </section>

      {/* ── ПОДВАЛ ──────────────────────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footIn}`}>
          <div className={s.footBrand}>Dan&apos;s Events / Освещение</div>
          <div className={s.footMeta}>
            Дизайн свадебного освещения &middot; Эшвилл, NC и в радиусе 4 часов езды &middot;{" "}
            <Link href="/ru" className={s.footMetaA}>Вернуться на Dan&apos;s Events</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
