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
  hidden: string[]; // guest-suggested songs (by key) the couple removed from the master list
};

export type View = {
  screen: "home" | "who" | "styles" | "swipe" | "results" | "welcome" | "thanks"; // welcome + thanks: guest link only
  flow?: FlowId;
  pid?: string;
};

// A song a guest wants that is not in the catalog (free text).
export type Extra = { title: string; artist: string };

export type GuestState = { sessionId: string; name: string; extras: Extra[]; sent: boolean };

export type Store = {
  v: 2;
  lang: Lang;
  view: View;
  flows: Record<FlowId, FlowState>;
  guestToken?: string; // couple side: the link they share with guests
  guest?: GuestState; // guest side only
};

// What the server tells both the couple and the guests about the guest votes (names never leave the server).
export type MasterExtra = { key: string; title: string; artist: string; count: number };
export type MasterData = {
  guests: number; // guests who answered at least one song
  coupleLikes: Record<string, number>; // catalog song -> partners who approved it
  guestLikes: Record<string, number>; // catalog song -> guests who liked it
  extras: MasterExtra[]; // songs guests added that are not in the catalog, merged by title + artist
};

export type CouplePicks = { partners: Record<string, string[]>; must: string[]; never: string[] };
export type GuestVote = { sessionId: string; name: string; likes: string[]; skips: string[]; extras: Extra[] };

export type Couple = { names: [string, string] };
