import GuidePage from "@/components/seo/guide-page";
import { MAIN_FAQ } from "@/lib/faq";
import { PHOTOS } from "@/lib/photos";
import { pageMeta, webPageLd } from "@/lib/seo";

const TITLE = "Wedding Host & DJ Questions, Answered | Dan's Events";
const DESCRIPTION =
  "Prices, booking lead time, travel, bilingual English and Russian hosting, and what your venue needs: straight answers from Dan's Events in Asheville.";

export const metadata = pageMeta({ path: "/faq", title: TITLE, description: DESCRIPTION });

export default function FaqPage() {
  return (
    <GuidePage
      current="/faq"
      crumbs={[{ name: "Questions", href: "/faq" }]}
      eyebrow="Questions couples ask"
      h1="Straight answers"
      lede="What it costs, how early to book, how far we travel, what your venue needs, and how a bilingual wedding works. If your question is not here, ask me directly and I will answer it personally."
      hero={PHOTOS.hostMic}
      sections={[
        {
          h2: "Before you read the answers",
          p: [
            "Every wedding is planned around the couple, the venue and the guests, so the answers below are the honest defaults, not fine print. Prices are the same ones on the pricing page. Where an answer depends on your venue, such as power for low fog or permission for cold sparklers, I say so and explain what I check.",
            "Two things make our weddings different, and most answers come back to them. First, one team runs the microphone, the music, the lights and the effects, so every moment is one cue instead of three vendors guessing. Second, I host in English and Russian, which matters when two families do not share a first language.",
          ],
          links: [
            ["/pricing", "Pricing"],
            ["/about", "About Dan's Events"],
            ["/reviews", "Google reviews"],
          ],
        },
      ]}
      faq={MAIN_FAQ}
      related={[
        ["/mc", "Wedding MC & host"],
        ["/dj", "Wedding DJ"],
        ["/lighting", "Wedding lighting"],
        ["/special-effects", "Special effects"],
        ["/areas", "Areas we serve"],
        ["/venues", "Venue guides"],
      ]}
      jsonLd={[webPageLd({ path: "/faq", name: TITLE, description: DESCRIPTION })]}
    />
  );
}
