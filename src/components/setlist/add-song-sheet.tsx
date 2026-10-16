"use client";

import { useEffect, useRef, useState } from "react";
import type { Strings } from "@/lib/setlist/i18n";
import type { Extra } from "@/lib/setlist/types";

export const MAX_EXTRAS = 5;

// Guests can name songs that are not on the list. A native <dialog>: focus trap, Escape and backdrop come for free.
export function AddSongSheet({ L, open, onClose, extras, onAdd, onRemove }: { L: Strings; open: boolean; onClose: () => void; extras: Extra[]; onAdd: (e: Extra) => void; onRemove: (i: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const full = extras.length >= MAX_EXTRAS;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || full) return;
    onAdd({ title: title.trim(), artist: artist.trim() });
    setTitle("");
    setArtist("");
  };

  return (
    <dialog ref={ref} className="sl-sheet" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label={L.addSong}>
      <form onSubmit={submit} className="sl-sheet-in">
        <h2 className="sl-sheet-t">{L.addSong}</h2>
        <input className="sl-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L.addSongTitle} aria-label={L.addSongTitle} maxLength={80} autoComplete="off" autoFocus />
        <input className="sl-input" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder={L.addSongArtist} aria-label={L.addSongArtist} maxLength={80} autoComplete="off" />
        <button type="submit" className="sl-cta" disabled={!title.trim() || full}>
          {L.add}
        </button>
        {extras.length > 0 && (
          <ul className="sl-added" aria-label={L.addedSongs}>
            {extras.map((x, i) => (
              <li key={`${x.title}|${x.artist}|${i}`}>
                <span className="t">
                  <b>{x.title}</b>
                  {x.artist && <span>{x.artist}</span>}
                </span>
                <button type="button" className="sl-ic" aria-label={`${L.removeExtra}: ${x.title}`} onClick={() => onRemove(i)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="sl-link sl-sheet-done" onClick={onClose}>
          {L.close}
        </button>
      </form>
    </dialog>
  );
}
