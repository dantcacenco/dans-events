"use client";

import { useState } from "react";
import type { GiveConfig } from "@/lib/teo/types";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard can be blocked; the handle is visible on screen anyway.
        }
      }}
      aria-label={`Copy ${label}`}
      className="shrink-0 border-2 border-[var(--ink)] px-3 py-2 text-[10px] uppercase tracking-[0.14em]"
      style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Method({
  name,
  handle,
  href,
  accent,
}: {
  name: string;
  handle: string;
  href?: string;
  accent: string;
}) {
  return (
    <div className="border-2 border-[var(--ink)] bg-[var(--paper)]">
      <div
        className="border-b-2 border-[var(--ink)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--paper)]"
        style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700, background: accent }}
      >
        {name}
      </div>
      <div className="flex items-center gap-2 p-3">
        <span className="min-w-0 flex-1 truncate text-[17px]" style={{ fontWeight: 600 }}>
          {handle}
        </span>
        <CopyButton value={handle} label={`${name} handle`} />
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block border-t-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-3 text-center text-[12px] uppercase tracking-[0.16em] text-[var(--paper)] active:translate-y-[1px]"
          style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
        >
          Open {name}
        </a>
      )}
    </div>
  );
}

export function GivePanel({ give }: { give: GiveConfig }) {
  const venmoUser = give.venmo.replace(/^@/, "");
  const cashTag = give.cashApp.replace(/^\$/, "");

  const hasAny = give.venmo || give.cashApp || give.zelle;

  return (
    <div className="teo-panel teo-noscroll teo-grain relative bg-[var(--paper-dim)] text-[var(--ink)]">
      <header className="sticky top-0 z-10 border-b-2 border-[var(--ink)] bg-[var(--paper-dim)]/95 px-4 py-3 backdrop-blur">
        <h2
          className="text-[22px] leading-none uppercase"
          style={{ fontFamily: "var(--font-teo-display)" }}
        >
          Give
        </h2>
      </header>

      <div className="px-4 py-5">
        <p className="text-[16px] leading-relaxed">{give.blurb}</p>

        <div className="teo-stripes my-5 opacity-30" aria-hidden="true" />

        {hasAny ? (
          <div className="grid gap-3">
            {give.venmo && (
              <Method
                name="Venmo"
                handle={give.venmo.startsWith("@") ? give.venmo : `@${venmoUser}`}
                href={`https://venmo.com/u/${encodeURIComponent(venmoUser)}`}
                accent="#008CFF"
              />
            )}
            {give.cashApp && (
              <Method
                name="Cash App"
                handle={give.cashApp.startsWith("$") ? give.cashApp : `$${cashTag}`}
                href={`https://cash.app/$${encodeURIComponent(cashTag)}`}
                accent="#00C244"
              />
            )}
            {give.zelle && (
              // Zelle has no universal deep link — it lives inside each bank's
              // app — so this is copy-the-handle only, by design.
              <Method name="Zelle" handle={give.zelle} accent="#6D1ED4" />
            )}
          </div>
        ) : (
          <p
            className="py-10 text-center text-[12px] uppercase tracking-[0.2em] text-[var(--ink-soft)]"
            style={{ fontFamily: "var(--font-teo-mono)" }}
          >
            Payment handles coming soon
          </p>
        )}

        <p className="mt-6 pb-10 text-center text-[13px] leading-snug text-[var(--ink-soft)]">
          Every dollar goes back into the music and the room it fills.
        </p>
      </div>
    </div>
  );
}
