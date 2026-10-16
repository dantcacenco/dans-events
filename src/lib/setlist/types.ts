export type Lang = "en" | "ru";
export type FlowId = "reception" | "ceremony";
export type Answer = "like" | "skip" | "love";
export type Mark = "must" | "never";
export type Moment = "processional" | "bridal" | "unity" | "recessional";

export type Style = {
  flow: FlowId;
  id: string;
  name: string;
  nameRu: string;
  blurb: string;
  blurbRu: string;
  emoji: string;
  color: string;
};

export type Song = {
  id: string;
  flow: FlowId;
  style: string;
  title: string;
  artist: string;
  explicit: boolean;
  moment?: Moment;
  clip: string;
  sourceUrl: string;
  hookStartSec: number;
  hookOnsetSec: number;
  songDurationSec: number;
  confidence: "high" | "medium" | "low";
  method: string;
  heatmapPeakSec: number | null;
  audioOnlySec: number;
  repeatOccurrencesSec: number[];
};

export type Person = {
  step: "styles" | "swipe" | "done";
  styles: string[];
  cleanOnly: boolean;
  deck: string[];
  index: number;
  answers: Record<string, Answer>;
};

export type FlowState = {
  people: Record<string, Person>;
  marks: Record<string, Mark>;
  notes: string;
  sent: boolean;
};

export type View = {
  screen: "home" | "who" | "styles" | "swipe" | "results";
  flow?: FlowId;
  pid?: string;
};

export type Store = {
  v: 2;
  lang: Lang;
  view: View;
  flows: Record<FlowId, FlowState>;
};

export type Couple = { names: [string, string] };
