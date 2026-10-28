import Link from "next/link";
import { cityBySlug, nearbyCities } from "@/lib/site";
import { venuesInCity } from "@/lib/venues";

export type CityVariant = "hub" | "dj" | "hosting" | "lighting";

const EN: Record<CityVariant, { label: string; path: (s: string) => string }> = {
  hub: { label: "Overview", path: (s) => `/${s}` },
  hosting: { label: "Wedding MC & host", path: (s) => `/hosting/${s}` },
  dj: { label: "Wedding DJ", path: (s) => `/dj/${s}` },
  lighting: { label: "Wedding lighting", path: (s) => `/lighting/${s}` },
};

const RU: Record<Exclude<CityVariant, "hub">, { label: string; path: (s: string) => string }> = {
  hosting: { label: "Ведущий", path: (s) => `/ru/hosting/${s}` },
  dj: { label: "Диджей", path: (s) => `/ru/dj/${s}` },
  lighting: { label: "Освещение", path: (s) => `/ru/lighting/${s}` },
};

function Pill({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  if (active) {
    return (
      <span aria-current="page" className="inline-block text-[11px] font-semibold uppercase tracking-[2px] px-4 py-3 bg-red text-white">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-block text-[11px] font-semibold uppercase tracking-[2px] px-4 py-3 border border-white/15 text-white/75 hover:border-red hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

// Cross-links for every city page: the city's other service pages, venue guides in the area,
// effects guides and nearby cities. This is what makes the city pages reachable without the sitemap.
export default function CityLinks({ citySlug, current, lang = "en" }: { citySlug: string; current: CityVariant; lang?: "en" | "ru" }) {
  const city = cityBySlug(citySlug);
  if (!city) return null;
  const venues = venuesInCity(citySlug);
  const nearby = nearbyCities(citySlug);
  const ru = lang === "ru";
  return (
    <section className="bg-black py-16 px-6 border-t border-white/[0.06]" aria-label={ru ? "Ещё по городу" : `More for ${city.name}`}>
      <div className="max-w-[1100px] mx-auto space-y-10">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">
            {ru ? `${city.name}: все услуги` : `Dan's Events in ${city.name}, ${city.stateAbbr}`}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EN) as CityVariant[]).map((v) => (
              <Pill key={v} href={EN[v].path(citySlug)} active={!ru && v === current}>
                {EN[v].label}
              </Pill>
            ))}
            {(Object.keys(RU) as Exclude<CityVariant, "hub">[]).map((v) => (
              <Pill key={`ru-${v}`} href={RU[v].path(citySlug)} active={ru && v === current}>
                {RU[v].label}
              </Pill>
            ))}
          </div>
        </div>

        {venues.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">
              {ru ? "Площадки (на английском)" : `Venue guides near ${city.name}`}
            </h2>
            <ul className="list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {venues.map((v) => (
                <li key={v.slug}>
                  <Link href={`/venues/${v.slug}`} className="text-[14px] font-light text-white/70 hover:text-red transition-colors">
                    {v.name}
                    {v.tier === "worked" && <span className="ml-2 text-[10px] uppercase tracking-[2px] text-red">{ru ? "работали" : "we've worked here"}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">{ru ? "Эффекты (на английском)" : "Effects and lighting guides"}</h2>
            <ul className="list-none space-y-3">
              {[
                ["/low-fog", "Low fog: dancing on a cloud"],
                ["/cold-sparklers", "Cold sparklers"],
                ["/wedding-uplighting", "Uplighting & dance floor lighting"],
                ["/special-effects", "All special effects"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] font-light text-white/70 hover:text-red transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[4px] text-white/35 mb-5">{ru ? "Рядом" : "Nearby areas"}</h2>
            <ul className="list-none space-y-3">
              {nearby.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={ru && current !== "hub" ? `/ru/${current}/${c.slug}` : current === "hub" ? `/${c.slug}` : `/${current}/${c.slug}`}
                    className="text-[14px] font-light text-white/70 hover:text-red transition-colors"
                  >
                    {c.name}, {c.stateAbbr}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/areas" className="text-[14px] font-light text-white/70 hover:text-red transition-colors">
                  {ru ? "Все города" : "All areas we serve"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
