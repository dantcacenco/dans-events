import GuidePage from "@/components/seo/guide-page";
import { PHOTOS } from "@/lib/photos";
import { pageMeta, serviceLd } from "@/lib/seo";

const TITLE = "Cold Sparklers for Weddings | Dan's Events";
const DESCRIPTION =
  "Cold spark fountains for a grand entrance, first dance, cake or send-off: how they differ from handheld sparklers, venue approval and safety.";

export const metadata = pageMeta({ path: "/cold-sparklers", title: TITLE, description: DESCRIPTION, image: PHOTOS.sparkFountains.src });

const FAQ = [
  {
    q: "What is the difference between cold sparklers and handheld sparklers?",
    a: "Handheld sparklers are fireworks that every guest lights and holds. Cold sparklers, also called cold spark machines or spark fountains, are machines that sit on the floor and throw a column of sparks on cue. Nobody holds anything, there is no lighter, and the effect starts and stops exactly when we press the button.",
  },
  {
    q: "Can we use cold sparklers indoors?",
    a: "Often yes, but it is always the venue's decision, and sometimes the local fire marshal's. Many venues that do not allow handheld sparklers will consider spark machines. I ask your coordinator in writing before we plan the moment, and I tell you right away if the answer is no.",
  },
  {
    q: "When during the wedding do cold sparklers work best?",
    a: "The four favorites are the grand entrance into the reception, the first dance, the cake cutting and the send-off at the end of the night. In our 2026 season the send-off was the most requested: couples walked out between two lines of sparks while the last song played.",
  },
  {
    q: "Are cold sparklers safe around the dress?",
    a: "We place the machines on the floor at a distance from the couple and the guests, away from drapes, low ceilings and decor, and we run them ourselves. Nobody walks through the sparks. The photos make it look closer than it is, which is the point.",
  },
];

export default function ColdSparklersPage() {
  return (
    <GuidePage
      current="/special-effects"
      crumbs={[
        { name: "Special effects", href: "/special-effects" },
        { name: "Cold sparklers", href: "/cold-sparklers" },
      ]}
      eyebrow="Special effects / Cold sparklers"
      h1="Cold sparklers"
      lede="Fountains of sparks on cue for your grand entrance, first dance, cake or send-off. No lighters, no handheld sparklers, no guests juggling sticks in the dark. In 2026 we ran cold sparklers at at least five weddings, most of them for the grand exit."
      hero={PHOTOS.sparkFountains}
      facts={[
        { label: "Also called", value: "Cold spark machines, spark fountains, cold sparks" },
        { label: "Best moments", value: "Grand entrance, first dance, cake cutting, send-off" },
        { label: "Who runs them", value: "My team, on cue with the music and the host" },
        { label: "Indoors", value: "Often allowed, always with the venue's written OK" },
        { label: "2026 season", value: "Used at five or more of our weddings" },
        { label: "Pairs with", value: "Low fog and warm stage lighting" },
      ]}
      factsTitle="Cold sparklers at a glance"
      sections={[
        {
          h2: "What cold sparklers are",
          p: [
            "A cold spark machine is a small box that sits on the floor and sends a fountain of bright sparks straight up for as long as we hold the cue. My team fires them on cue, so two or four machines start at the same moment and stop together.",
            "That control is the whole difference from handheld sparklers. With handheld sparklers half the guests are still looking for a lighter when you walk out. With machines, the music hits, the sparks go up, and the photographer gets a clean frame of the two of you between them.",
          ],
        },
        {
          h2: "Four moments that work",
          p: [
            "The grand entrance: you are announced into the reception and the sparks go up as you step onto the floor. As your host I build the introduction so the room is already on its feet when it happens.",
            "The first dance: a pair of fountains on either side of the floor for the last chorus. With low fog under your feet it becomes the photo of the night. The cake: two small fountains behind the cake table as you cut it. The send-off: the most requested moment in our 2026 season. Instead of a tunnel of handheld sparklers, the guests make the tunnel and the machines make the sparks.",
          ],
          photo: PHOTOS.cakeSparks,
          caption: "Cold spark fountains and low fog during a cake cutting.",
        },
        {
          h2: "Venue approval and safety",
          p: [
            "Cold sparklers are not a flame in the way a candle is, but they still make sparks, and every venue has its own rules. Some allow them anywhere, some only outdoors, some only on a hard floor, some not at all. I do not guess: as soon as you book, I ask your coordinator in writing and I tell you what they said.",
            "On the night we place the machines on a stable floor with clear space around them, away from drapes, greenery, low ceilings and walkways. Guests do not handle them and nobody walks through the sparks. My team runs them on cue, and we test before guests arrive.",
          ],
          list: [
            "Written approval from the venue before we plan the moment",
            "Hard, level floor and clear space around each machine",
            "Away from drapes, florals, low ceilings and walkways",
            "Run by us on cue, never handed to guests",
          ],
        },
        {
          h2: "Planning it into the night",
          p: [
            "Cold sparklers work best when one person calls the moment. Because I host, DJ and run the effects as one team, the song, the announcement and the sparks are one cue, not three vendors waving at each other across the room. Tell me which moments you want when we plan your timeline and I will build them in, along with lighting so the sparks read in photos.",
          ],
          photo: PHOTOS.stageWarmBeams,
          caption: "Warm stage lighting that makes sparks and faces read in photos.",
          links: [
            ["/low-fog", "Low fog"],
            ["/special-effects", "All special effects"],
            ["/mc", "Hosting the moment"],
          ],
        },
      ]}
      faq={FAQ}
      related={[
        ["/special-effects", "All special effects"],
        ["/low-fog", "Low fog"],
        ["/wedding-uplighting", "Uplighting guide"],
        ["/lighting", "Wedding lighting"],
        ["/venues", "Venue guides"],
        ["/pricing", "Pricing"],
      ]}
      jsonLd={[
        serviceLd({
          name: "Cold spark machines for weddings",
          path: "/cold-sparklers",
          description: DESCRIPTION,
          serviceType: "Wedding special effects",
        }),
      ]}
    />
  );
}
