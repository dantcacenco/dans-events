import Link from "next/link";
import GuidePage from "@/components/seo/guide-page";
import { PHOTOS } from "@/lib/photos";
import { pageMeta, webPageLd } from "@/lib/seo";
import { CITIES, REGIONS, cityLabel } from "@/lib/site";
import { VENUES, venuesInCity } from "@/lib/venues";

const TITLE = "Wedding Venue Guides: NC, SC & TN | Dan's Events";
const DESCRIPTION =
  "Venue-by-venue notes for hosting, DJ, lighting, low fog and sparklers at wedding venues around Asheville, Upstate SC, Charlotte and East Tennessee.";

export const metadata = pageMeta({ path: "/venues", title: TITLE, description: DESCRIPTION });

export default function VenuesPage() {
  const worked = VENUES.filter((v) => v.tier === "worked");
  return (
    <GuidePage
      current="/venues"
      crumbs={[{ name: "Venues", href: "/venues" }]}
      eyebrow="Venue guides"
      h1="Wedding venues"
      lede={`${VENUES.length} venue guides, each written for that room: its spaces, how sound and hosting work there, lighting and power, and what the venue publishes about fog, sparklers and music cutoffs. ${worked.length} are venues our team has already worked.`}
      hero={PHOTOS.longTableRetro}
      sections={[
        {
          h2: "How these guides are written",
          p: [
            "Every fact on a venue page comes from the venue's own website or published documents, listed as sources at the bottom of each page with the date we checked. Where a venue does not publish a rule, for example on cold sparklers or fog, the page says so instead of guessing.",
            "Pages marked as venues we have worked say exactly when, from our booking records. The rest are planning guides: how I would approach the room if your wedding is there. If your venue is not here, that is fine. I plan every new room from its floor plan and photos, and the area pages list many more venues.",
          ],
          links: [
            ["/areas", "Areas we serve"],
            ["/special-effects", "Effects and venue rules"],
          ],
        },
      ]}
      related={[
        ["/areas", "Areas"],
        ["/low-fog", "Low fog"],
        ["/cold-sparklers", "Cold sparklers"],
        ["/wedding-uplighting", "Lighting guide"],
        ["/faq", "Questions"],
      ]}
      jsonLd={[
        webPageLd({ path: "/venues", name: TITLE, description: DESCRIPTION, type: "CollectionPage" }),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Wedding venue guides",
          itemListElement: VENUES.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.name, url: `https://dans-events.com/venues/${v.slug}` })),
        },
      ]}
    >
      <section className="bg-[#f4f1ee] px-6 py-[clamp(56px,8vw,104px)]">
        <div className="max-w-[1100px] mx-auto space-y-16">
          {REGIONS.map((region) => {
            const cities = CITIES.filter((c) => c.region === region.id && venuesInCity(c.slug).length > 0);
            if (!cities.length) return null;
            return (
              <div key={region.id}>
                <h2 className="text-[clamp(22px,3vw,34px)] font-black uppercase text-black mb-8">{region.name}</h2>
                <div className="space-y-10">
                  {cities.map((c) => (
                    <div key={c.slug}>
                      <h3 className="text-[11px] font-bold uppercase tracking-[4px] text-black/45 mb-4">
                        <Link href={`/${c.slug}`} className="hover:text-red">Near {cityLabel(c)}</Link>
                      </h3>
                      <ul className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {venuesInCity(c.slug).map((v) => (
                          <li key={v.slug}>
                            <Link href={`/venues/${v.slug}`} className="group block bg-white p-6 h-full hover:outline hover:outline-2 hover:outline-red">
                              <span className="block text-[18px] font-black uppercase text-black leading-tight group-hover:text-red transition-colors">
                                {v.name}
                              </span>
                              <span className="block mt-2 text-[12px] font-medium uppercase tracking-[2px] text-black/40">
                                {v.town}, {v.state}
                                {v.tier === "worked" && <span className="text-red"> / we&apos;ve worked here</span>}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </GuidePage>
  );
}
