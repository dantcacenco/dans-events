import type { QA } from "@/components/seo/faq-section";
import { BUNDLE, SERVICE_PRICES, usd } from "./pricing";
import { REVIEW_COUNT, REVIEW_RATING, REVIEWS_AS_OF } from "./reviews";
import { FACTS } from "./site";

const price = (href: string) => usd(SERVICE_PRICES.find((s) => s.href === href)!.price);

// The questions couples (and AI assistants) ask most, with plain answers built from real facts.
export const MAIN_FAQ: QA[] = [
  {
    q: "Who is Dan's Events?",
    a: `Dan's Events is a wedding entertainment team based in ${FACTS.base}. ${FACTS.owner} hosts weddings as the MC (in the tradition of a tamada) in English and Russian, and the team provides the DJ, ceremony sound, warm-white lighting, low fog and cold sparklers. Dan's Events is rated ${REVIEW_RATING} from ${REVIEW_COUNT} Google reviews as of ${REVIEWS_AS_OF}.`,
  },
  {
    q: "How much does a wedding host or DJ cost with Dan's Events?",
    a: `Hosting and MC is ${price("/mc")}. DJ and ceremony sound is ${price("/dj")}. Lighting starts at ${price("/lighting")}, and a full lighting package is closer to $3,000. The 2027 Full Experience (hosting, DJ with ceremony sound, two wash lights, two spotlights and low fog) is ${usd(BUNDLE.price)} for the first ${BUNDLE.spots} couples with 2027 weddings.`,
  },
  {
    q: "How far in advance should we book?",
    a: "Peak season runs from May to October, and Saturdays in those months often book 12 or more months ahead. Send your date as soon as you have it, even before the venue contract is signed, and I will tell you right away whether it is open.",
  },
  {
    q: "Do you travel outside Asheville?",
    a: `Yes. I'm based in Asheville and work weddings across Western North Carolina, Charlotte and the Piedmont, Upstate South Carolina and East Tennessee. In the 2026 season (${FACTS.season2026Range}) we worked ${FACTS.season2026Events} weddings and events in ${FACTS.season2026States}.`,
  },
  {
    q: "Can you host a bilingual English and Russian wedding?",
    a: "Yes, it is one of the things couples hire me for. I host in English and Russian, switch languages at the right moments so both sides of the family feel included, and build toasts, games and traditions from Slavic weddings into the program when you want them.",
  },
  {
    q: "What do you need from our venue?",
    a: "Load-in time to set up and sound check before guests arrive, power near the DJ and the dance floor (separate 20 amp circuits for sound and lights, and a dedicated 30 amp circuit if you add low fog), and the venue's written OK for any fog, haze or cold sparklers. I coordinate this with your venue directly and send them a short power plan.",
  },
  {
    q: "Do you do the lighting and effects yourselves?",
    a: "Yes. The lighting rig, the low-fog machine and the cold spark machines are run by our team, on cue with the music and the program. That is the point of one team: the host, the DJ and the effects work from one run of show.",
  },
  {
    q: "What happens on the day?",
    a: "We arrive early to set up and test sound and lights, run the ceremony sound, then host and DJ the reception from the grand entrance through toasts, dances and games to the send-off. Before the day we plan the timeline with you and your coordinator, collect your must-play and do-not-play songs, and prepare introductions and toasts.",
  },
];

// Short answers for the home page (the full answers live on /faq).
export const HOME_FAQ: QA[] = [
  {
    q: "What does it cost?",
    a: `Hosting ${price("/mc")}, DJ and ceremony sound ${price("/dj")}, lighting from ${price("/lighting")}. The 2027 package with all three plus low fog is ${usd(BUNDLE.price)}.`,
  },
  {
    q: "How early should we reach out?",
    a: "As soon as you have a date. Saturdays from May to October go first.",
  },
  {
    q: "Do you travel?",
    a: "Yes: Western NC, Upstate SC, Charlotte, the Triad and East Tennessee, and farther for the right wedding.",
  },
  {
    q: "Can you host in English and Russian?",
    a: "Yes. Both languages, switched at the right moments, so both families feel at home.",
  },
];

// About-page questions (different from /faq so each page answers its own questions).
export const ABOUT_FAQ: QA[] = [
  {
    q: "Is Dan the person who actually hosts our wedding?",
    a: "Yes. When you book hosting, I host your wedding myself. My team runs the DJ, sound, lighting and effects alongside me, and we plan the night together with you before the day.",
  },
  {
    q: "What is a tamada?",
    a: "Tamada is the word for the wedding host in many Slavic and Caucasus traditions. A tamada does more than announce: they lead toasts, introduce the families to each other, run games and keep the energy of the whole night. That is the kind of hosting I do, in English, Russian or both.",
  },
  {
    q: "What makes one team better than separate vendors?",
    a: "Timing. When the host, the DJ and the lighting are one team, the grand entrance, the first dance and the send-off are single cues. Nobody waits for another vendor to notice the moment has started.",
  },
  {
    q: "How do we know the reviews are real?",
    a: "Every review on this site is copied word for word from our public Google Business Profile, with a link to read them there. We do not edit them, and the reviews page shows all of them, including the ones that are not five stars.",
  },
];
