"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Drop, GiveConfig } from "@/lib/teo/types";
import { DeviceShell } from "./device-shell";
import { DropsPanel } from "./drops-panel";
import { GivePanel } from "./give-panel";

const TABS = ["The Drop", "Give"] as const;

export function CardExperience({
  drops,
  give,
}: {
  drops: Drop[];
  give: GiveConfig;
}) {
  const panelsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Derive the active tab from scroll position so swiping and tapping stay
  // in sync without fighting each other.
  useEffect(() => {
    const element = panelsRef.current;
    if (!element) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(element.scrollLeft / element.clientWidth);
        setActive(index);
      });
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const element = panelsRef.current;
    if (!element) return;
    element.scrollTo({ left: index * element.clientWidth, behavior: "smooth" });
  }, []);

  const latestTag = drops[0]?.tag ?? "STAY TUNED";
  const ticker = `${latestTag}  •  KEEP THE CARD  •  THIS PAGE CHANGES  •  `;

  return (
    <DeviceShell>
      <div className="flex h-full flex-col bg-[var(--paper)]">
        <h1 className="sr-only">T.E.O. — The Drop</h1>

        {/* LCD readout */}
        <div className="teo-lcd flex items-center gap-2 overflow-hidden border-b-2 border-[var(--ink)] px-3 py-1.5">
          <span className="teo-blink shrink-0 text-[9px]">●</span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="teo-marquee flex w-max text-[11px] uppercase tracking-[0.2em] whitespace-pre"
              style={{ fontFamily: "var(--font-teo-mono)" }}
            >
              <span>{ticker.repeat(3)}</span>
              <span aria-hidden="true">{ticker.repeat(3)}</span>
            </div>
          </div>
        </div>

        {/* Panels */}
        <div ref={panelsRef} className="teo-panels teo-noscroll min-h-0 flex-1">
          <DropsPanel drops={drops} />
          <GivePanel give={give} />
        </div>

        {/* Transport-key tab bar */}
        <nav
          className="grid shrink-0 grid-cols-2 border-t-2 border-[var(--ink)] bg-[var(--ink)]"
          aria-label="Sections"
        >
          {TABS.map((label, index) => {
            const isActive = active === index;
            return (
              <button
                key={label}
                type="button"
                onClick={() => goTo(index)}
                aria-current={isActive ? "true" : undefined}
                className={`px-3 py-3.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "bg-[var(--orange)] text-[var(--paper)]"
                    : "text-[var(--paper)]/50"
                }`}
                style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </DeviceShell>
  );
}
