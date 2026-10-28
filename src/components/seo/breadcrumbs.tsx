import Link from "next/link";
import JsonLd from "./json-ld";
import { BASE_URL } from "@/lib/site";

export type Crumb = { name: string; href: string };

// Visible breadcrumb trail plus BreadcrumbList structured data. The first crumb (Home) is added here.
export default function Breadcrumbs({ items, dark = true, homeLabel = "Home" }: { items: Crumb[]; dark?: boolean; homeLabel?: string }) {
  const all = [{ name: homeLabel, href: "/" }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${BASE_URL}${c.href === "/" ? "" : c.href}`,
    })),
  };
  const tone = dark ? "text-white/45" : "text-black/45";
  const hover = dark ? "hover:text-white" : "hover:text-black";
  return (
    <nav aria-label="Breadcrumb" className={`text-[11px] font-medium uppercase tracking-[2px] ${tone}`}>
      <JsonLd data={data} />
      <ol className="flex flex-wrap gap-x-2 gap-y-1 list-none">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-red">/</span>}
            {i === all.length - 1 ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.href} className={`${hover} transition-colors`}>
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// A thin breadcrumb band. underNav adds room for the fixed 64px nav when it is the first thing on the page.
export function BreadcrumbBar({ items, underNav = false, homeLabel }: { items: Crumb[]; underNav?: boolean; homeLabel?: string }) {
  return (
    <div className={`bg-black px-6 ${underNav ? "pt-20" : "pt-4"} pb-4 border-b border-white/[0.06]`}>
      <div className="max-w-[1100px] mx-auto">
        <Breadcrumbs items={items} homeLabel={homeLabel} />
      </div>
    </div>
  );
}
