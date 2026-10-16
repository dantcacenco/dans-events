import type { Couple } from "./types";

// TODO(real version): look the couple up by token in the couples record (KV/DB), created from the admin form.
// The prototype accepts any well-formed token and shows sample names.
export function getCouple(token: string): Couple {
  void token;
  return { names: ["Anna", "Mike"] };
}

export const TOKEN_RE = /^[a-z0-9]{12,40}$/;
