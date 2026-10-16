// Five looks for the same page, picked with ?design=1..5 while Dan chooses one.
// Logic and markup are shared; each look is only a block of CSS in setlist.css (.d1 … .d5).
export const DESIGNS = [
  { id: 1, name: "Tiles" },
  { id: 2, name: "Vinyl" },
  { id: 3, name: "Poster" },
  { id: 4, name: "Paper" },
  { id: 5, name: "Cinema" },
] as const;

export type DesignId = (typeof DESIGNS)[number]["id"];

export const parseDesign = (v: string | undefined): DesignId | undefined => {
  const n = Number(v);
  return DESIGNS.find((d) => d.id === n)?.id;
};
