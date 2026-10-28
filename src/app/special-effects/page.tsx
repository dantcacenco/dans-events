import Image from "next/image";
import Link from "next/link";
import GuidePage from "@/components/seo/guide-page";
import { PHOTOS } from "@/lib/photos";
import { pageMeta, serviceLd } from "@/lib/seo";

const TITLE = "Wedding Special Effects: Fog, Sparks, Light | Dan's Events";
const DESCRIPTION =
  "Low fog, cold sparklers, beams and spotlights for weddings in NC, SC and TN: what each effect does, when to use it and what your venue needs.";

export const metadata = pageMeta({ path: "/special-effects", title: TITLE, description: DESCRIPTION, image: PHOTOS.danceBeamsHaze.src });

const EFFECTS = [
  {
    href: "/low-fog",
    name: "Low fog",
    line: "A cloud on the dance floor for the first dance. Needs its own 30 amp circuit.",
    photo: PHOTOS.firstDanceCloud,
  },
  {
    href: "/cold-sparklers",
    name: "Cold sparklers",
    line: "Spark fountains on cue for the entrance, first dance, cake or send-off.",
    photo: PHOTOS.sparkFountains,
  },
  {
    href: "/wedding-uplighting",
    name: "Uplighting & beams",
    line: "Warm light on the room, soft light on faces, beams for the party.",
    photo: PHOTOS.drapedCeiling,
  },
];

const FAQ = [
  {
    q: "Which wedding effects are worth it?",
    a: "If you pick one, pick light, because it changes every photo from dinner to the last dance. If you pick two, add low fog for the first dance. Cold sparklers are the best send-off if your venue allows them. More effects is not better: three well-timed moments beat a fog machine running all night.",
  },
  {
    q: "Can one company do the DJ, the hosting and the effects?",
    a: "Yes, that is how we work. I host in English and Russian, my team runs the DJ, sound, lighting and effects, and every effect is a cue in the same run of show. Nobody waits for a separate vendor to notice the first dance has started.",
  },
  {
    q: "Do effects need venue approval?",
    a: "Fog, haze and sparks always need the venue's OK, and sometimes the fire marshal's. I ask your coordinator in writing as soon as you book and plan around their answer.",
  },
  {
    q: "What is included in the 2027 package?",
    a: "The 2027 Full Experience includes hosting in English and Russian, the DJ with ceremony sound, two wash lights, two spotlights with beams over the dance floor, and low fog for your first dance, for $3,900.",
  },
];

export default function SpecialEffectsPage() {
  return (
    <GuidePage
      current="/special-effects"
      crumbs={[{ name: "Special effects", href: "/special-effects" }]}
      eyebrow="Special effects"
      h1="Fog, sparks and light"
      lede="The effects that make a wedding feel like an event, planned around the moments that matter and run by the same team that hosts and DJs your night."
      hero={PHOTOS.danceBeamsHaze}
      sections={[
        {
          h2: "Three effects, used on purpose",
          p: [
            "Special effects work when they mark a moment. A cloud of low fog during the first dance, a wall of sparks as you walk out, a spotlight that finds you during the grand entrance. Used all night, the same effects turn into noise. So I plan them like music: where the build is, where the drop is, and where the room needs to be quiet.",
            "Everything below is something we actually run. Our lighting rig includes moving beam and spot heads, high-CRI wash lights, pixel bars, warm retro-style lamps, blinders and a low-fog machine, and we use cold spark machines for entrances and send-offs. In the 2026 season, cold sparklers were the most requested effect and the grand exit was the most requested moment.",
          ],
        },
        {
          h2: "Low fog",
          p: [
            "Low-lying fog that stays on the floor, so the two of you look like you are dancing on a cloud while guests still see your faces. It is the effect people ask about most after the wedding. It needs a dedicated 30 amp circuit, so I plan it with the venue in advance.",
          ],
          links: [["/low-fog", "Read the low fog guide"]],
        },
        {
          h2: "Cold sparklers",
          p: [
            "Floor-standing spark machines that fire on cue: for your entrance, your first dance, the cake or the send-off. No lighters and no handheld sparklers. Venue approval comes first, always in writing.",
          ],
          links: [["/cold-sparklers", "Read the cold sparklers guide"]],
        },
        {
          h2: "Light: uplighting, beams and spotlights",
          p: [
            "Warm uplighting on the room, soft front light for toasts, a spotlight for the entrance, and beams through haze for the dance floor. My style is warm white and white, with color only when you ask for it. All of it is programmed into scenes for your venue.",
          ],
          links: [
            ["/wedding-uplighting", "Read the lighting guide"],
            ["/lighting", "See our lighting design"],
          ],
        },
        {
          h2: "What your venue needs to know",
          list: [
            "Written approval for fog, haze and cold sparks",
            "A dedicated 30 amp circuit if you want low fog",
            "Separate 20 amp circuits for sound and lights",
            "Load-in time to set up and test before guests arrive",
          ],
          p: [
            "I send venues a short power and effects plan before every wedding. If something is not allowed, you hear it from me early, along with an alternative that still gives you the moment.",
          ],
        },
      ]}
      faq={FAQ}
      related={[
        ["/low-fog", "Low fog"],
        ["/cold-sparklers", "Cold sparklers"],
        ["/wedding-uplighting", "Uplighting guide"],
        ["/lighting", "Wedding lighting"],
        ["/2027", "2027 package"],
        ["/venues", "Venue guides"],
      ]}
      jsonLd={[
        serviceLd({
          name: "Wedding special effects: low fog, cold sparklers and lighting",
          path: "/special-effects",
          description: DESCRIPTION,
          serviceType: "Wedding special effects",
        }),
      ]}
    >
      <section className="bg-[#f4f1ee] px-6 py-[clamp(56px,8vw,104px)]" aria-label="Effects">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {EFFECTS.map((e) => (
            <Link key={e.href} href={e.href} className="group block bg-white">
              <Image
                src={e.photo.src}
                alt={e.photo.alt}
                width={e.photo.width}
                height={e.photo.height}
                sizes="(min-width: 768px) 360px, 100vw"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-[22px] font-black uppercase text-black group-hover:text-red transition-colors">{e.name}</h3>
                <p className="mt-2 text-[14px] font-light text-black/60 leading-[1.7]">{e.line}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </GuidePage>
  );
}
