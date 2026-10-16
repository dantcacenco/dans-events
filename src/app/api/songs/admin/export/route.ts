import { isAdmin } from "@/lib/setlist/admin/auth";
import { adminCouple } from "@/lib/setlist/admin/data";
import { listCouples } from "@/lib/setlist/couple-store";
import { songById } from "@/lib/setlist/catalog";
import { csvCell } from "@/lib/setlist/export";

// Every couple's master list and ceremony picks in one CSV (Excel-friendly, with a BOM for Cyrillic).
export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const head = ["Couple", "Wedding date", "Flow", "Section", "Rank", "Title", "Artist", "People who chose it", "Couple liked", "Always play", "Explicit"];
  const lines: string[] = [];
  const add = (cells: string[]) => lines.push(cells.map(csvCell).join(","));
  for (const info of await listCouples()) {
    const d = await adminCouple(info);
    const couple = info.names.join(" & ");
    d.master.songs.forEach((it, i) => add([couple, info.date, "Reception", "Song list", String(i + 1), it.title, it.artist, String(it.count), it.coupleLiked ? "yes" : "", it.must ? "yes" : "", it.explicit ? "yes" : ""]));
    d.master.extras.forEach((it, i) => add([couple, info.date, "Reception", "Songs chosen by guests", String(i + 1), it.title, it.artist, String(it.count), "", "", ""]));
    for (const flow of ["reception", "ceremony"] as const) {
      const f = d.flows[flow];
      if (flow === "ceremony") {
        const liked = [...new Set(f.people.flatMap((p) => p.liked))];
        liked.forEach((id, i) => {
          const s = songById(id);
          if (s) add([couple, info.date, "Ceremony", "Liked", String(i + 1), s.title, s.artist, String(f.people.filter((p) => p.liked.includes(id)).length), "yes", f.must.includes(id) ? "yes" : "", s.explicit ? "yes" : ""]);
        });
      }
      for (const id of f.never) {
        const s = songById(id);
        if (s) add([couple, info.date, flow === "ceremony" ? "Ceremony" : "Reception", "Never play", "", s.title, s.artist, "", "", "", ""]);
      }
      if (f.notes.trim()) add([couple, info.date, flow === "ceremony" ? "Ceremony" : "Reception", "Notes", "", f.notes.trim(), "", "", "", "", ""]);
    }
  }
  const body = "﻿" + [head.join(","), ...lines].join("\r\n") + "\r\n";
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="set-lists-all-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
}
