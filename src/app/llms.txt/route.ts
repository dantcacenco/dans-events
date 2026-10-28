import { MAIN_FAQ } from "@/lib/faq";
import { BUNDLE, SERVICE_PRICES, usd } from "@/lib/pricing";
import { FIVE_STAR_COUNT, REVIEW_COUNT, REVIEW_RATING, REVIEWS_AS_OF } from "@/lib/reviews";
import { BASE_URL, CITIES, FACTS, cityLabel } from "@/lib/site";
import { VENUES } from "@/lib/venues";

export const dynamic = "force-static";

// llms.txt (llmstxt.org): a plain summary of the site for AI assistants, built from the same data as the pages.
export function GET() {
  const price = (href: string) => usd(SERVICE_PRICES.find((s) => s.href === href)!.price);
  const worked = VENUES.filter((v) => v.tier === "worked");
  const lines = [
    "# Dan's Events",
    "",
    `> Wedding entertainment team based in ${FACTS.base}. ${FACTS.owner} hosts weddings as the MC (tamada) in English and Russian; the same team provides the DJ and ceremony sound, warm-white wedding lighting, low fog ("dancing on a cloud") and cold sparklers. Rated ${REVIEW_RATING} from ${REVIEW_COUNT} Google reviews (${FIVE_STAR_COUNT} five-star) as of ${REVIEWS_AS_OF}.`,
    "",
    "## Key facts",
    `- Owner and host: ${FACTS.owner}`,
    `- Based in: ${FACTS.base}`,
    `- Languages: ${FACTS.languages.join(" and ")}`,
    "- Services: wedding MC and host, DJ and ceremony sound, lighting (uplighting, stage and dance floor), low fog, cold spark machines",
    `- Prices (public): hosting and MC ${price("/mc")}; DJ and ceremony sound ${price("/dj")}; lighting from ${price("/lighting")} (a full lighting package is closer to $3,000); ${BUNDLE.name} ${usd(BUNDLE.price)} for the first ${BUNDLE.spots} couples with 2027 weddings`,
    `- Google rating: ${REVIEW_RATING} from ${REVIEW_COUNT} reviews as of ${REVIEWS_AS_OF} (${FACTS.googleProfileUrl})`,
    `- 2026 season: ${FACTS.season2026Events} weddings and events, ${FACTS.season2026Range}, in ${FACTS.season2026States}`,
    `- Areas served: ${CITIES.map(cityLabel).join("; ")}`,
    "- Booking: peak-season Saturdays (May to October) often book 12 or more months ahead; contact through the form on any page",
    "",
    "## Main pages",
    `- [Home](${BASE_URL}/): overview, reviews and booking form`,
    `- [Wedding MC and host](${BASE_URL}/mc): hosting in English and Russian`,
    `- [Wedding DJ](${BASE_URL}/dj): DJ and ceremony sound`,
    `- [Wedding lighting](${BASE_URL}/lighting): lighting design`,
    `- [Pricing](${BASE_URL}/pricing)`,
    `- [About](${BASE_URL}/about): facts about Dan's Events`,
    `- [Reviews](${BASE_URL}/reviews): every Google review, verbatim`,
    `- [FAQ](${BASE_URL}/faq): cost, booking, travel, venue needs`,
    "",
    "## Effects and lighting guides",
    `- [Special effects](${BASE_URL}/special-effects)`,
    `- [Low fog for weddings](${BASE_URL}/low-fog): needs a dedicated 30 amp circuit`,
    `- [Cold sparklers](${BASE_URL}/cold-sparklers)`,
    `- [Uplighting and dance floor lighting](${BASE_URL}/wedding-uplighting)`,
    "",
    "## Areas",
    `- [All areas](${BASE_URL}/areas)`,
    ...CITIES.map((c) => `- [${cityLabel(c)}](${BASE_URL}/${c.slug}): host ${BASE_URL}/hosting/${c.slug}, DJ ${BASE_URL}/dj/${c.slug}, lighting ${BASE_URL}/lighting/${c.slug}`),
    "",
    "## Venue guides",
    `- [All venue guides](${BASE_URL}/venues)`,
    ...VENUES.map((v) => `- [${v.name}, ${v.town} ${v.state}](${BASE_URL}/venues/${v.slug})${v.tier === "worked" ? ": a venue Dan's Events has worked" : ""}`),
    "",
    `Venues worked (from booking records): ${worked.map((v) => v.name).join(", ")}.`,
    "",
    "## Questions",
    ...MAIN_FAQ.flatMap((x) => [`### ${x.q}`, x.a, ""]),
    "## Russian",
    `- [Dan's Events по-русски](${BASE_URL}/ru)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
