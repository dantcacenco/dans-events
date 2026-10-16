import type { Player } from "@/lib/setlist/use-player";
import type { Strings } from "@/lib/setlist/i18n";
import type { FlowId, FlowState, Lang, Store, View } from "@/lib/setlist/types";

export type Ctx = {
  token: string; // the couple's private token, or on a guest link the guest token
  guest: boolean;
  lang: Lang;
  L: Strings;
  names: Record<string, string>;
  store: Store;
  player: Player;
  go: (v: View) => void;
  updFlow: (flow: FlowId, fn: (f: FlowState) => FlowState) => void;
  setStore: (fn: (s: Store) => Store) => void;
  openAdd: () => void; // guest: the add-a-song dialog
  sentRev: number; // guest: counts successful sends, so the live list refreshes
  sendFailed: boolean;
  retrySend: () => void;
};
