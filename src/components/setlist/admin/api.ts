"use client";

import type { CoupleDetail, CoupleRow } from "@/lib/setlist/admin/data";
import type { CoupleInfo } from "@/lib/setlist/types";

export type Library = { hidden: string[]; flagged: string[] };
export class Unauthorized extends Error {}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "content-type": "application/json", ...init?.headers }, cache: "no-store" });
  if (res.status === 401) throw new Unauthorized();
  const body = (await res.json().catch(() => ({}))) as T & { ok?: boolean };
  if (!res.ok || body.ok === false) throw new Error(`HTTP ${res.status}`);
  return body;
}

const base = "/api/songs/admin";
const send = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });

export const api = {
  couples: () => call<{ couples: CoupleRow[] }>(`${base}/couples`).then((r) => r.couples),
  create: (names: [string, string], date: string, lang: "en" | "ru") =>
    call<{ couple: CoupleInfo }>(`${base}/couples`, send("POST", { names, date, lang })).then((r) => r.couple),
  detail: (token: string) => call<{ detail: CoupleDetail }>(`${base}/couples/${token}`).then((r) => r.detail),
  patch: (token: string, patch: Partial<Pick<CoupleInfo, "names" | "date" | "lang" | "active" | "reviewed" | "adminNotes">>) =>
    call<{ couple: CoupleInfo }>(`${base}/couples/${token}`, send("PATCH", patch)).then((r) => r.couple),
  remove: (token: string) => call<unknown>(`${base}/couples/${token}`, send("DELETE")),
  removeVote: (token: string, sessionId: string) => call<unknown>(`${base}/couples/${token}?vote=${encodeURIComponent(sessionId)}`, send("DELETE")),
  library: () => call<{ library: Library }>(`${base}/library`).then((r) => r.library),
  saveLibrary: (lib: Library) => call<{ library: Library }>(`${base}/library`, send("PUT", lib)).then((r) => r.library),
  signOut: () => fetch(`${base}/login`, { method: "DELETE" }),
};
