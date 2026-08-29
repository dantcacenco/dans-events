"use client";

import type { Block } from "@/lib/teo/types";
import { RevealText } from "./reveal-text";

/** Renders one content block inside a drop. */
export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "title":
      return (
        <h3
          className="mt-1 mb-2 text-[30px] leading-[0.95] uppercase"
          style={{ fontFamily: "var(--font-teo-display)" }}
        >
          {block.text}
        </h3>
      );

    case "subtitle":
      return (
        <p
          className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-teo-mono)" }}
        >
          {block.text}
        </p>
      );

    case "text":
      return (
        <p className="my-3 whitespace-pre-wrap text-[16px] leading-relaxed text-[var(--ink)]">
          {block.text}
        </p>
      );

    case "reveal":
      return <RevealText text={block.text} hint={block.hint} />;

    case "image":
      return (
        <figure className="my-4 -mx-1">
          {/* Remote R2 URLs aren't in next.config images config, so plain img. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.alt ?? ""}
            className="w-full border-2 border-[var(--ink)] object-cover"
          />
          {block.caption && (
            <figcaption
              className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]"
              style={{ fontFamily: "var(--font-teo-mono)" }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      return (
        <figure className="my-4 -mx-1">
          <video
            src={block.url}
            poster={block.posterUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full border-2 border-[var(--ink)] bg-black"
          />
          {block.caption && (
            <figcaption
              className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]"
              style={{ fontFamily: "var(--font-teo-mono)" }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "link":
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 block border-2 border-[var(--ink)] bg-[var(--orange)] px-4 py-3.5 text-center text-[13px] uppercase tracking-[0.16em] text-[var(--paper)] transition-transform active:translate-y-[2px]"
          style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
        >
          {block.label || "Open"}
        </a>
      );

    case "divider":
      return <div className="teo-stripes my-5 opacity-40" aria-hidden="true" />;
  }
}
