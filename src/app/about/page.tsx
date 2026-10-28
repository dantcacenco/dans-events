import GuidePage from "@/components/seo/guide-page";
import ReviewsBlock from "@/components/seo/reviews-block";
import { ABOUT_FAQ } from "@/lib/faq";
import { PHOTOS } from "@/lib/photos";
import { BUNDLE, SERVICE_PRICES, usd } from "@/lib/pricing";
import { FIVE_STAR_COUNT, REVIEW_COUNT, REVIEW_RATING, REVIEWS_AS_OF } from "@/lib/reviews";
import { pageMeta, webPageLd } from "@/lib/seo";
import { CITIES, FACTS } from "@/lib/site";

const TITLE = "About Dan's Events: Wedding Host, DJ & Lighting | Asheville";
const DESCRIPTION = `Who we are and what we do: Dan Tcacenco hosts weddings in English and Russian, with DJ, lighting and effects from one Asheville team. Rated ${REVIEW_RATING} on Google.`;

export const metadata = pageMeta({ path: "/about", title: TITLE, description: DESCRIPTION, image: PHOTOS.danFloor.src });

const price = (href: string) => usd(SERVICE_PRICES.find((s) => s.href === href)!.price);

export default function AboutPage() {
  return (
    <GuidePage
      current="/about"
      crumbs={[{ name: "About", href: "/about" }]}
      eyebrow="About Dan's Events"
      h1="One team for the whole night"
      lede={`Dan's Events is a wedding entertainment team from ${FACTS.base}. I'm ${FACTS.owner}. I host weddings in English and Russian, and my team brings the DJ, the sound, the lighting and the effects, so your night has one plan and one person calling the moments.`}
      hero={PHOTOS.danFloor}
      facts={[
        { label: "Based in", value: "Asheville, North Carolina" },
        { label: "Owner and host", value: FACTS.owner },
        { label: "Languages", value: "English and Russian" },
        { label: "Services", value: "Wedding MC and host, DJ and ceremony sound, lighting, low fog, cold sparklers" },
        { label: "Google rating", value: `${REVIEW_RATING} from ${REVIEW_COUNT} reviews (${FIVE_STAR_COUNT} five-star), ${REVIEWS_AS_OF}` },
        { label: "2026 season", value: `${FACTS.season2026Events} weddings and events, ${FACTS.season2026Range}` },
        { label: "Where", value: `${CITIES.length} areas in NC, SC and TN, plus travel weddings` },
        { label: "Prices", value: `Hosting ${price("/mc")}, DJ ${price("/dj")}, lighting from ${price("/lighting")}, 2027 package ${usd(BUNDLE.price)}` },
      ]}
      factsTitle="Dan's Events in facts"
      sections={[
        {
          h2: "What we do",
          p: [
            "I'm a wedding host first. In my culture the host of a wedding is called a tamada: not someone who reads announcements off a card, but the person who holds the room together, introduces the families to each other, gives the toasts their moment and keeps the night moving. I bring that to every wedding, in English, in Russian, or in both.",
            "Around the hosting, my team runs the DJ and the ceremony sound, the lighting and the special effects. Lighting is warm white and white, designed for each room. Effects are low fog for the first dance and cold sparklers for the entrance or the send-off. Because it is one team, the song, the announcement, the light and the sparks are one cue.",
          ],
          links: [
            ["/mc", "Hosting"],
            ["/dj", "DJ"],
            ["/lighting", "Lighting"],
            ["/special-effects", "Effects"],
          ],
        },
        {
          h2: "Who hires us",
          p: [
            `Couples who want their guests to have the best night of their lives, and who do not want to manage five vendors to get there. Many of our couples come from Russian, Ukrainian and Moldovan families and want a host who can carry both languages and both sets of traditions. Many do not, and simply want a host who makes a room of strangers feel like one family.`,
            `In the 2026 season (${FACTS.season2026Range}) we worked ${FACTS.season2026Events} weddings and events in ${FACTS.season2026States}. Our home ground is Western North Carolina and Upstate South Carolina, and we travel to Charlotte, the Piedmont and East Tennessee.`,
          ],
          links: [
            ["/areas", "Areas we serve"],
            ["/venues", "Venues we know"],
          ],
        },
        {
          h2: "What couples say",
          p: [
            `Dan's Events is rated ${REVIEW_RATING} from ${REVIEW_COUNT} Google reviews as of ${REVIEWS_AS_OF}; ${FIVE_STAR_COUNT} of them are five stars. The themes that come up again and again are energy, organization and making every guest feel included. Every review is on the reviews page, copied word for word.`,
          ],
          links: [["/reviews", "Read every review"]],
        },
      ]}
      faq={ABOUT_FAQ}
      related={[
        ["/faq", "All questions"],
        ["/pricing", "Pricing"],
        ["/2027", "2027 package"],
        ["/reviews", "Reviews"],
      ]}
      jsonLd={[webPageLd({ path: "/about", name: TITLE, description: DESCRIPTION, type: "AboutPage", about: { "@id": "https://dans-events.com/#business" } })]}
    >
      <ReviewsBlock limit={3} />
    </GuidePage>
  );
}
