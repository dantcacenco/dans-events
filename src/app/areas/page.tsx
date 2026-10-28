import Link from "next/link";
import GuidePage from "@/components/seo/guide-page";
import { pageMeta, webPageLd } from "@/lib/seo";
import { CITIES, FACTS, REGIONS, cityLabel } from "@/lib/site";
import { venuesInCity } from "@/lib/venues";

const TITLE = "Areas We Serve: NC, SC & TN Weddings | Dan's Events";
const DESCRIPTION =
  "Wedding host, DJ and lighting from Asheville across Western NC, Charlotte, the Piedmont, Upstate SC and East Tennessee. Pick your city or venue.";

export const metadata = pageMeta({ path: "/areas", title: TITLE, description: DESCRIPTION });

export default function AreasPage() {
  return (
    <GuidePage
      current="/areas"
      crumbs={[{ name: "Areas", href: "/areas" }]}
      eyebrow="Areas we serve"
      h1="Where we work"
      lede={`Based in Asheville, working weddings across four regions. In the 2026 season we worked ${FACTS.season2026Events} weddings and events in ${FACTS.season2026States}. Pick your area for local venues, notes and the service you need.`}
      sections={[
        {
          h2: "How travel works",
          p: [
            "Asheville is home, so Western North Carolina and Upstate South Carolina are everyday drives. Charlotte, the Triad and East Tennessee are regular trips, and we travel farther for the right wedding. Each area page below has its own notes on the region, local venues and the questions couples there ask.",
            "Every city has four pages: an overview, the wedding host (MC) page, the DJ page and the lighting page, plus Russian versions of the host, DJ and lighting pages. Venue guides are listed under the city they are closest to.",
          ],
          links: [
            ["/venues", "All venue guides"],
            ["/faq", "Do you travel?"],
          ],
        },
      ]}
      related={[
        ["/venues", "Venue guides"],
        ["/mc", "Wedding MC & host"],
        ["/dj", "Wedding DJ"],
        ["/lighting", "Wedding lighting"],
        ["/special-effects", "Special effects"],
      ]}
      jsonLd={[webPageLd({ path: "/areas", name: TITLE, description: DESCRIPTION, type: "CollectionPage" })]}
    >
      <section className="bg-[#f4f1ee] px-6 py-[clamp(56px,8vw,104px)]">
        <div className="max-w-[1100px] mx-auto space-y-16">
          {REGIONS.map((region) => (
            <div key={region.id}>
              <h2 className="text-[clamp(22px,3vw,34px)] font-black uppercase text-black mb-8">{region.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CITIES.filter((c) => c.region === region.id).map((c) => {
                  const venues = venuesInCity(c.slug);
                  return (
                    <div key={c.slug} className="bg-white p-7">
                      <h3 className="text-[22px] font-black uppercase text-black mb-4">
                        <Link href={`/${c.slug}`} className="hover:text-red transition-colors">
                          {cityLabel(c)}
                        </Link>
                      </h3>
                      <ul className="list-none space-y-2 text-[14px] font-light text-black/70">
                        <li><Link href={`/hosting/${c.slug}`} className="hover:text-red">Wedding MC &amp; host</Link></li>
                        <li><Link href={`/dj/${c.slug}`} className="hover:text-red">Wedding DJ</Link></li>
                        <li><Link href={`/lighting/${c.slug}`} className="hover:text-red">Wedding lighting</Link></li>
                        <li className="text-black/50">
                          По-русски:{" "}
                          <Link href={`/ru/hosting/${c.slug}`} className="hover:text-red">ведущий</Link>,{" "}
                          <Link href={`/ru/dj/${c.slug}`} className="hover:text-red">диджей</Link>,{" "}
                          <Link href={`/ru/lighting/${c.slug}`} className="hover:text-red">свет</Link>
                        </li>
                      </ul>
                      {venues.length > 0 && (
                        <p className="mt-4 pt-4 border-t border-black/[0.07] text-[13px] font-light text-black/60 leading-[1.7]">
                          <span className="block text-[10px] font-bold uppercase tracking-[3px] text-black/40 mb-1">Venue guides</span>
                          {venues.map((v, i) => (
                            <span key={v.slug}>
                              {i > 0 && ", "}
                              <Link href={`/venues/${v.slug}`} className="hover:text-red underline-offset-[3px] underline decoration-black/15">
                                {v.name}
                              </Link>
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </GuidePage>
  );
}
