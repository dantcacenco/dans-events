"use client";

/**
 * Mobile: the page IS the device — the screen fills the viewport.
 * Desktop: the same screen sits inside a portable-cassette-player body.
 *
 * Children render exactly once; everything around the screen is decoration
 * hidden below md. Rendering two copies would double the scroll containers,
 * component state and <video> loads.
 */
export function DeviceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:grid md:min-h-[100dvh] md:place-items-center md:bg-[var(--ink)] md:p-8">
      <div className="teo-shell relative">
        {/* Top plate: brand + status lamp */}
        <div className="mb-3 hidden items-center justify-between px-1.5 md:flex">
          <span
            className="text-[10px] uppercase tracking-[0.32em] text-[var(--paper)]/70"
            style={{ fontFamily: "var(--font-teo-mono)", fontWeight: 700 }}
          >
            T.E.O. Portable
          </span>
          <span className="flex items-center gap-1.5">
            <span className="teo-blink block h-1.5 w-1.5 rounded-full bg-[var(--orange)]" />
            <span
              className="text-[9px] uppercase tracking-[0.24em] text-[var(--paper)]/50"
              style={{ fontFamily: "var(--font-teo-mono)" }}
            >
              Play
            </span>
          </span>
        </div>

        <div className="teo-screen relative">{children}</div>

        {/* Bottom plate: speaker grille + decorative transport keys */}
        <div className="mt-4 hidden items-center justify-between px-1.5 md:flex">
          <div className="teo-grille h-6 w-28 rounded-sm opacity-70" aria-hidden="true" />
          <div className="flex gap-1.5" aria-hidden="true">
            {["◀◀", "▶", "▶▶"].map((glyph) => (
              <span
                key={glyph}
                className="grid h-6 w-9 place-items-center rounded-[3px] bg-black/45 text-[9px] text-[var(--paper)]/45"
              >
                {glyph}
              </span>
            ))}
          </div>
          <div className="h-6 w-10 rounded-sm bg-[var(--orange)]/80" aria-hidden="true" />
        </div>
      </div>

      <p
        className="mt-5 hidden text-center text-[10px] uppercase tracking-[0.24em] text-[var(--paper)]/35 md:block"
        style={{ fontFamily: "var(--font-teo-mono)" }}
      >
        Best on your phone — scan the card
      </p>
    </div>
  );
}
