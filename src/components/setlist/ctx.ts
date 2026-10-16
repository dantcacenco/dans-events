import type { Player } from "@/lib/setlist/use-player";
import type { Strings } from "@/lib/setlist/i18n";
import type { FlowId, FlowState, Lang, Store, View } from "@/lib/setlist/types";

export type Ctx = {
  token: string;
  lang: Lang;
  L: Strings;
  names: Record<string, string>;
  store: Store;
  player: Player;
  go: (v: View) => void;
  updFlow: (flow: FlowId, fn: (f: FlowState) => FlowState) => void;
};
