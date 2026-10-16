import type { Player } from "@/lib/setlist/use-player";
import type { Strings } from "@/lib/setlist/i18n";
import type { DesignId } from "@/lib/setlist/designs";
import type { FlowId, FlowState, Lang, Store, View } from "@/lib/setlist/types";

export type Ctx = {
  token: string;
  design: DesignId;
  lang: Lang;
  L: Strings;
  names: Record<string, string>;
  store: Store;
  player: Player;
  go: (v: View) => void;
  updFlow: (flow: FlowId, fn: (f: FlowState) => FlowState) => void;
};
