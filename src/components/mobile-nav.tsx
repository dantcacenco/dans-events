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
        <div className="fixed top-16 left-0 w-full bg-black z-[999] px-6 py-10 border-b-[3px] border-red">
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
              className="block text-sm font-semibold uppercase tracking-[3px] py-4 text-white/60 border-b border-white/[0.06] hover:text-red transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
