import { songById, styleById } from "./catalog";
import { resultFor } from "./store";
import type { FlowId, FlowState, Moment } from "./types";

const MOMENT_ORDER: Moment[] = ["processional", "bridal", "unity", "recessional"];
const MOMENT_LABEL: Record<Moment, string> = { processional: "Processional", bridal: "Bridal entrance", unity: "Signing & unity", recessional: "Recessional" };

type Row = { priority: string; style: string; moment: string; title: string; artist: string; likedBy: string; explicit: string };

export function exportRows(flow: FlowId, f: FlowState, names: Record<string, string>): Row[] {
  const r = resultFor(f);
  const rows: Row[] = [];
  const ids = new Set<string>([...r.must, ...r.never]);
  for (const pid of r.pids) r.approved[pid].forEach((id) => ids.add(id));
  for (const id of ids) {
    const s = songById(id);
    if (!s) continue;
    const likers = r.pids.filter((pid) => r.approved[pid].includes(id));
    const priority = f.marks[id] === "never" ? "Never play" : f.marks[id] === "must" ? "Always play" : likers.length === 2 && r.both.includes(id) ? "Both loved" : "Liked";
    rows.push({
      priority,
      style: styleById(s.style)?.name ?? s.style,
      moment: s.moment ? MOMENT_LABEL[s.moment] : "",
      title: s.title,
      artist: s.artist,
      likedBy: likers.map((p) => names[p] ?? p).join(" + "),
      explicit: s.explicit ? "yes" : "",
    });
  }
  const pr = ["Always play", "Both loved", "Liked", "Never play"];
  const mo = (m: string) => (m ? MOMENT_ORDER.findIndex((x) => MOMENT_LABEL[x] === m) : 0);
  rows.sort((a, b) => pr.indexOf(a.priority) - pr.indexOf(b.priority) || (flow === "ceremony" ? mo(a.moment) - mo(b.moment) : 0) || a.style.localeCompare(b.style));
  return rows;
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function toCsv(flow: FlowId, f: FlowState, names: Record<string, string>): string {
  const head = ["Priority", "Style", "Moment", "Title", "Artist", "Liked by", "Explicit"];
  const lines = exportRows(flow, f, names).map((r) => [r.priority, r.style, r.moment, r.title, r.artist, r.likedBy, r.explicit].map(csvCell).join(","));
  if (f.notes.trim()) lines.push(["Notes", "", "", f.notes.trim(), "", "", ""].map(csvCell).join(","));
  return "﻿" + [head.join(","), ...lines].join("\r\n") + "\r\n"; // BOM so Excel reads Cyrillic
}

export function toText(flow: FlowId, f: FlowState, names: Record<string, string>): string {
  const rows = exportRows(flow, f, names);
  const out: string[] = [flow === "ceremony" ? "CEREMONY MUSIC" : "RECEPTION & DANCE MUSIC", ""];
  for (const p of ["Always play", "Both loved", "Liked", "Never play"]) {
    const list = rows.filter((r) => r.priority === p);
    if (!list.length) continue;
    out.push(p.toUpperCase());
    for (const r of list) out.push(`- ${r.artist} - ${r.title}${r.moment ? ` [${r.moment}]` : ""}${r.explicit ? " (explicit)" : ""}`);
    out.push("");
  }
  if (f.notes.trim()) out.push("NOTES", f.notes.trim(), "");
  return out.join("\n");
}

export function download(filename: string, mime: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
