"use client";

import Image from "next/image";
import type { Lang } from "@/lib/setlist/types";

// Deliberately not a link: this page is private and has no way back to the public site.
export function Header({ lang, setLang, back, backLabel }: { lang: Lang; setLang: (l: Lang) => void; back?: () => void; backLabel?: string }) {
  return (
    <header className="sl-head">
      {back ? (
        <button className="sl-back" onClick={back} aria-label={backLabel}>
          <span aria-hidden="true">←</span> {backLabel}
        </button>
      ) : (
        <Image src="/logos/logo-white-transparent.png" alt="Dan's Events" width={200} height={23} priority />
      )}
      <div className="sl-lang" role="group" aria-label="Language">
        {(["en", "ru"] as const).map((l) => (
          <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
