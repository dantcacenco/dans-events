"use client";

import { useState } from "react";
import Link from "next/link";

const HOME_LINKS: [string, string][] = [
  ["#craft", "The Craft"],
  ["/mc", "MC & Host"],
  ["/dj", "DJ"],
  ["/lighting", "Lighting"],
  ["/special-effects", "Effects"],
  ["/venues", "Venues"],
  ["/areas", "Areas"],
  ["/reviews", "Reviews"],
  ["/pricing", "Pricing"],
  ["/2027", "2027 Package"],
  ["#check-date", "Check Your Date"],
];

export default function MobileNav({ links = HOME_LINKS, breakpoint = "md" }: { links?: [string, string][]; breakpoint?: "md" | "lg" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`flex ${breakpoint === "lg" ? "lg:hidden" : "md:hidden"} flex-col gap-[5px] cursor-pointer bg-transparent border-none p-2`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="block w-6 h-0.5 bg-white transition-all" />
        <span className="block w-6 h-0.5 bg-white transition-all" />
        <span className="block w-6 h-0.5 bg-white transition-all" />
      </button>

      {open && (
        <div className="fixed top-16 left-0 w-full max-h-[calc(100svh-4rem)] overflow-y-auto bg-red z-[999] px-6 py-6 border-b-[3px] border-red-dark">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-sm font-semibold uppercase tracking-[3px] py-4 text-white border-b border-white/[0.15] hover:text-white/80 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
