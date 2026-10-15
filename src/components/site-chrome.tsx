import Image from "next/image";
import Link from "next/link";

// Nav and footer for the simpler standalone pages (/pricing, /2027), styled like /mc and /dj.

const NAV_LINKS = [
  ["/", "Home"],
  ["/dj", "DJ"],
  ["/mc", "MC & Host"],
  ["/lighting", "Lighting"],
  ["/pricing", "Pricing"],
  ["/2027", "2027 Package"],
] as const;

export function SiteNav({ current, ctaHref = "#check-date" }: { current: string; ctaHref?: string }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] bg-black px-6 h-16 flex items-center justify-between border-b border-white/[0.06]">
      <Link href="/" className="block">
        <Image
          src="/logos/logo-white-transparent.png"
          alt="Dan's Events"
          width={200}
          height={23}
          className="h-7 w-auto"
          priority
        />
      </Link>
      <ul className="hidden lg:flex items-center gap-8 list-none">
        {NAV_LINKS.filter(([href]) => href !== current).map(([href, label]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[11px] font-medium uppercase tracking-[2px] text-white/60 hover:text-white transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={ctaHref}
            className="text-[11px] font-semibold uppercase tracking-[2px] text-white bg-red px-4 py-2 hover:bg-red-dark transition-colors"
          >
            Check My Date
          </Link>
        </li>
      </ul>
      <Link
        href={ctaHref}
        className="lg:hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[1.5px] text-white bg-red px-3 py-2"
      >
        Check My Date
      </Link>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-black py-16 px-6 text-center border-t border-white/[0.06]">
      <Link href="/" className="inline-block mb-4">
        <Image
          src="/logos/logo-white-transparent.png"
          alt="Dan's Events"
          width={200}
          height={23}
          className="h-8 w-auto mx-auto opacity-80"
        />
      </Link>
      <div className="text-[11px] font-normal uppercase tracking-[6px] text-white/30 mb-10">
        Wedding DJ &amp; MC — Asheville, NC
      </div>
      <ul className="flex justify-center gap-x-10 gap-y-4 list-none mb-10 flex-wrap">
        {[...NAV_LINKS, ["/#proof", "Reviews"]].map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-[11px] font-medium uppercase tracking-[2px] text-white/50 hover:text-red transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="text-[10px] text-white/30 tracking-[2px] uppercase">
        &copy; 2026 Dan&apos;s Events. Asheville, NC. All rights reserved.
      </div>
    </footer>
  );
}
