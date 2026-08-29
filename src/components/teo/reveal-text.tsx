"use client";

import { useCallback, useRef, useState } from "react";

/**
 * iOS-style invisible ink: blurred behind a drifting particle haze, resolving
 * while the reader holds it. Keyboard users get a sticky toggle instead, since
 * there is no hold gesture on a keyboard.
 */
export function RevealText({ text, hint }: { text: string; hint?: string }) {
  const [held, setHeld] = useState(false);
  const [locked, setLocked] = useState(false);
  const pointerActive = useRef(false);

  const revealed = held || locked;

  const start = useCallback(() => {
    pointerActive.current = true;
    setHeld(true);
  }, []);

  const end = useCallback(() => {
    pointerActive.current = false;
    setHeld(false);
  }, []);

  return (
    <div className="my-5">
      {hint && !revealed && (
        <p
          className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-teo-mono)" }}
        >
          {hint}
        </p>
      )}
      <button
        type="button"
        className="teo-reveal"
        data-revealed={revealed}
        aria-expanded={revealed}
        aria-label={revealed ? undefined : "Hidden message — hold or press Enter to reveal"}
        onPointerDown={start}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={() => pointerActive.current && end()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setLocked((value) => !value);
          }
        }}
      >
        <span className="teo-reveal-haze" aria-hidden="true" />
        <span className="teo-reveal-text block whitespace-pre-wrap text-[17px] leading-relaxed">
          {text}
        </span>
      </button>
    </div>
  );
}
