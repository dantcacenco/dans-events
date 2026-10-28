// Youth Camp check-in: everything that changes between events lives in this one file.

export const EVENT = {
  id: "youth-camp-2026", // groups the stored records; change it for a new camp
  name: { en: "Youth Camp", ru: "Молодёжный лагерь" },
  theme: { en: "Together in Christ", ru: "Вместе во Христе" },
  tagline: { en: "One Generation · One Faith · One Mission", ru: "Одно поколение · Одна вера · Одно служение" },
  // Friday Oct 30 and Saturday Oct 31, 2026 (ISO yyyy-mm-dd; the staff page and CSV show them).
  fridayDate: "2026-10-30",
  saturdayDate: "2026-10-31",
} as const;

export type Lang = "en" | "ru";

// Each meal a family can sign up for (head count = people in the party who chose it).
export const MEALS = ["friLunch", "friDinner", "satBreakfast", "satLunch", "satDinner"] as const;
export type MealId = (typeof MEALS)[number];

export const MODES = ["fri-am", "fri-pm", "sat-am", "sat-pm"] as const;
export type ModeId = (typeof MODES)[number];
export const DEFAULT_MODE: ModeId = "fri-am";

export const isMode = (v: unknown): v is ModeId => typeof v === "string" && (MODES as readonly string[]).includes(v);

export const PARTY_MIN = 1;
export const PARTY_MAX = 20;

// What each mode asks (name, party size and phone are always asked).
export const MODE_RULES: Record<ModeId, { overnight: boolean; meals: readonly MealId[] }> = {
  // Friday before the opening: everything.
  "fri-am": { overnight: true, meals: ["friLunch", "friDinner", "satBreakfast", "satLunch", "satDinner"] },
  // Friday after lunch: Friday lunch and dinner are not asked.
  "fri-pm": { overnight: true, meals: ["satBreakfast", "satLunch", "satDinner"] },
  // Saturday morning, people who did not register yet: no overnight, no Friday meals.
  "sat-am": { overnight: false, meals: ["satBreakfast", "satLunch", "satDinner"] },
  // Saturday evening session: just who is here.
  "sat-pm": { overnight: false, meals: [] },
};

// Saturday dinner reads differently when asked in the morning (only people staying for the evening session need it).
export const MODE_MEAL_LABEL_OVERRIDE: Partial<Record<ModeId, Partial<Record<MealId, "ifEvening">>>> = {
  "sat-am": { satDinner: "ifEvening" },
};

export const KIOSK_RESET_SECONDS = 8;
