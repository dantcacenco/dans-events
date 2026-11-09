// Secret Santa: the short "what do you like" questions and the gift-idea rules. Pure data, safe on client and server.
import type { Lang } from "./config";

type L = Record<Lang, string>;
const t = (en: string, ru: string, uk: string): L => ({ en, ru, uk });

export const GIFT_MIN = 3;
export const GIFT_MAX = 5;
export const GIFT_PRICE_MAX = 20; // dollars, per gift
export const GIFT_TEXT_MIN = 2;
export const GIFT_TEXT_MAX = 60;

export type Option = { id: string; emoji: string; label: L };
export type Question = { id: string; hero: string; title: L; options: Option[] };

const o = (id: string, emoji: string, en: string, ru: string, uk: string): Option => ({ id, emoji, label: t(en, ru, uk) });

// Ids are what is stored. Labels are only for display, so wording can change without touching saved answers.
export const QUESTIONS: Question[] = [
  {
    id: "interests",
    hero: "🎅",
    title: t("What do you love?", "Что вы любите?", "Що ви любите?"),
    options: [
      o("music", "🎧", "Music", "Музыка", "Музика"),
      o("books", "📚", "Books", "Книги", "Книги"),
      o("games", "🎮", "Games", "Игры", "Ігри"),
      o("sports", "⚽", "Sports", "Спорт", "Спорт"),
      o("art", "🎨", "Art", "Творчество", "Творчість"),
      o("tech", "💻", "Tech", "Техника", "Техніка"),
      o("cooking", "🍳", "Cooking", "Кулинария", "Кулінарія"),
      o("nature", "🌲", "Nature", "Природа", "Природа"),
      o("movies", "🎬", "Movies", "Фильмы", "Фільми"),
      o("travel", "✈️", "Travel", "Путешествия", "Подорожі"),
    ],
  },
  {
    id: "treats",
    hero: "🍪",
    title: t("Favorite treats?", "Любимые вкусняшки?", "Улюблені смаколики?"),
    options: [
      o("chocolate", "🍫", "Chocolate", "Шоколад", "Шоколад"),
      o("candy", "🍬", "Candy", "Конфеты", "Цукерки"),
      o("cookies", "🍪", "Cookies", "Печенье", "Печиво"),
      o("tea", "🍵", "Tea", "Чай", "Чай"),
      o("coffee", "☕", "Coffee", "Кофе", "Кава"),
      o("fruit", "🍊", "Fruit", "Фрукты", "Фрукти"),
      o("nuts", "🥜", "Nuts", "Орехи", "Горіхи"),
      o("notsweet", "🧂", "Not sweet", "Не сладкое", "Не солодке"),
    ],
  },
  {
    id: "style",
    hero: "🎁",
    title: t("Your kind of gift?", "Какой подарок вам по душе?", "Який подарунок вам до вподоби?"),
    options: [
      o("cozy", "🧦", "Cozy", "Уютный", "Затишний"),
      o("funny", "😄", "Funny", "Весёлый", "Веселий"),
      o("useful", "🛠️", "Useful", "Полезный", "Корисний"),
      o("creative", "✨", "Creative", "Творческий", "Творчий"),
      o("stylish", "🕶️", "Stylish", "Стильный", "Стильний"),
      o("cute", "🧸", "Cute", "Милый", "Милий"),
    ],
  },
];

const KNOWN = new Map(QUESTIONS.flatMap((q) => q.options.map((x) => [x.id, x] as const)));
export const optionFor = (id: string): Option | undefined => KNOWN.get(id);

export type Gift = { text: string; price: number | null };

export type SantaError = "gifts" | "price";

const cents = (n: number) => Math.round(n * 100) / 100;

// Parses what a guest typed in the price box: "" -> null, "12" / "12.5" / "$12,50" -> number, anything else -> NaN.
export function parsePrice(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? cents(v) : Number.NaN;
  if (typeof v !== "string") return Number.NaN;
  const s = v.replace(/[$\s]/g, "").replace(",", ".");
  if (s === "") return null;
  return /^\d{1,4}(\.\d{1,2})?$/.test(s) ? cents(Number(s)) : Number.NaN;
}

// Likes: only known ids, once each.
export function cleanLikes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) if (typeof v === "string" && KNOWN.has(v) && !out.includes(v)) out.push(v);
  return out;
}

// Gifts. strict (guest): 3 to 5 ideas, each short text, price empty or 0..20. Lenient (admin edits, restores): keep what is valid.
export function cleanGifts(raw: unknown, strict: boolean): { ok: true; value: Gift[] } | { ok: false; error: SantaError } {
  const rows = Array.isArray(raw) ? raw : [];
  const out: Gift[] = [];
  for (const r of rows) {
    const b = (r ?? {}) as Record<string, unknown>;
    const text = typeof b.text === "string" ? b.text.replace(/\s+/g, " ").trim().slice(0, GIFT_TEXT_MAX) : "";
    if (text.length < GIFT_TEXT_MIN) continue; // an empty row is just skipped
    const price = parsePrice(b.price);
    if (price !== null && (Number.isNaN(price) || price < 0 || price > GIFT_PRICE_MAX)) {
      if (strict) return { ok: false, error: "price" };
      out.push({ text, price: null });
      continue;
    }
    out.push({ text, price });
  }
  if (strict && (out.length < GIFT_MIN || out.length > GIFT_MAX)) return { ok: false, error: "gifts" };
  return { ok: true, value: out.slice(0, GIFT_MAX) };
}
