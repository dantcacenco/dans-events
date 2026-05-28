"use client";

import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex md:hidden flex-col gap-[5px] cursor-pointer bg-transparent border-none p-2"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <span className="block w-6 h-0.5 bg-white transition-all" />
        <span className="block w-6 h-0.5 bg-white transition-all" />
        <span className="block w-6 h-0.5 bg-white transition-all" />
      </button>

      {open && (
        <div className="fixed top-16 left-0 w-full bg-red z-[999] px-6 py-10 border-b-[3px] border-red-dark">
          {[
            ["#craft", "The Craft"],
            ["#services", "Services"],
            ["#proof", "Proof"],
            ["#check-date", "Check Your Date"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-sm font-semibold uppercase tracking-[3px] py-4 text-white border-b border-white/[0.15] hover:text-white/80 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
