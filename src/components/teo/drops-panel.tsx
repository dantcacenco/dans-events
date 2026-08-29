"use client";

import type { Drop } from "@/lib/teo/types";
import { BlockView } from "./block-view";
import { EmailCapture } from "./email-capture";

function formatDate(ms: number): string {
  return new Date(ms)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "2-digit" })
    .toUpperCase();
}

/** The feed. Newest drop first, email capture slotted in after the first one. */
export function DropsPanel({ drops }: { drops: Drop[] }) {
  return (
    // Colour is set here rather than inherited so the panel also renders
    // correctly inside the admin preview, which sits on a dark surface.
    <div className="teo-panel teo-noscroll teo-grain relative bg-[var(--paper)] text-[var(--ink)]">
      <header className="sticky top-0 z-10 border-b-2 border-[var(--ink)] bg-[var(--paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-baseline justify-between">
          <h2
            className="text-[22px] leading-none uppercase"
            style={{ fontFamily: "var(--font-teo-display)" }}
          >
            The Drop
          </h2>
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-soft)]"
            style={{ fontFamily: "var(--font-teo-mono)" }}
          >
            {drops.length} {drops.length === 1 ? "track" : "tracks"}
          </span>
        </div>
      </header>

      {drops.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p
            className="text-[13px] uppercase tracking-[0.2em] text-[var(--ink-soft)]"
            style={{ fontFamily: "var(--font-teo-mono)" }}
          >
            Nothing queued yet
          </p>
          <p className="mt-3 text-[15px] text-[var(--ink-soft)]">
            Keep the card. This page changes.
          </p>
        </div>
      ) : (
        drops.map((drop, index) => (
          <div key={drop.id}>
            <article className="px-4 pt-5 pb-2">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="border-2 border-[var(--ink)] bg-[var(--ink)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--paper)]"
                  style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
                >
                  {drop.tag}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]"
                  style={{ fontFamily: "var(--font-teo-mono)" }}
                >
                  {formatDate(drop.createdAt)}
                </span>
              </div>

              {drop.blocks.map((block) => (
                <BlockView key={block.id} block={block} />
              ))}
            </article>

            {index === 0 && <EmailCapture />}
            <div className="teo-stripes mx-4 my-2 opacity-25" aria-hidden="true" />
          </div>
        ))
      )}

      {/* Capture still appears when the feed is empty. */}
      {drops.length === 0 && <EmailCapture />}

      <footer className="px-4 pt-4 pb-10 text-center">
        <p
          className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-teo-mono)" }}
        >
          Swipe for ways to give →
        </p>
      </footer>
    </div>
  );
}
