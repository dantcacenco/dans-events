import Image from "next/image";
import Link from "next/link";
import MobileNav from "./mobile-nav";
import { ABOUT_LINKS, CITIES, NAV_LINKS, SERVICE_LINKS, cityLabel } from "@/lib/site";

// Shared nav and footer for the standalone, hub, guide, venue and city pages.
// The footer doubles as an HTML sitemap: every hub, service and city page is one click away.

export function SiteNav({ current, ctaHref = "/#check-date" }: { current: string; ctaHref?: string }) {
  const mobileLinks: [string, string][] = [["/", "Home"], ...NAV_LINKS, ["/2027", "2027 Package"], [ctaHref, "Check Your Date"]];
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
      <ul className="hidden lg:flex items-center gap-7 list-none">
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
      <div className="lg:hidden flex items-center gap-3">
        <Link
          href={ctaHref}
          className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[1.5px] text-white bg-red px-3 py-2"
        >
          Check My Date
        </Link>
        <MobileNav links={mobileLinks} breakpoint="lg" />
      </div>
    </nav>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">{title}</h2>
      <ul className="list-none space-y-3">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-[13px] font-light text-white/60 hover:text-red transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const cityLinks: [string, string][] = CITIES.map((c) => [`/${c.slug}`, cityLabel(c)]);
  return (
    <footer className="bg-black pt-16 pb-12 px-6 border-t border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logos/logo-white-transparent.png"
              alt="Dan's Events"
              width={200}
              height={23}
              className="h-8 w-auto mx-auto opacity-80"
            />
          </Link>
          <div className="text-[11px] font-normal uppercase tracking-[6px] text-white/30">
            Wedding host, DJ &amp; lighting. Asheville, NC
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <FooterColumn title="Services" links={SERVICE_LINKS} />
          <FooterColumn title="Dan's Events" links={ABOUT_LINKS} />
          <div className="col-span-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">
              <Link href="/areas" className="hover:text-red transition-colors">Areas we serve</Link>
            </h2>
            <ul className="list-none grid grid-cols-2 gap-x-6 gap-y-3">
              {cityLinks.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] font-light text-white/60 hover:text-red transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] text-white/30 tracking-[2px] uppercase">
          &copy; 2026 Dan&apos;s Events. Asheville, NC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
