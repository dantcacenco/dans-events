import GuidePage from "@/components/seo/guide-page";
import { PHOTOS } from "@/lib/photos";
import { pageMeta, serviceLd } from "@/lib/seo";

const TITLE = "Low Fog for Weddings: Dancing on a Cloud | Dan's Events";
const DESCRIPTION =
  "How low-lying fog works for a first dance, what it needs from your venue (its own 30 amp circuit), and how we plan it in NC, SC and TN.";

export const metadata = pageMeta({ path: "/low-fog", title: TITLE, description: DESCRIPTION, image: PHOTOS.lowFogLift.src });

const FAQ = [
  {
    q: "Is low fog the same as haze or a smoke machine?",
    a: "No. Haze hangs in the air so you can see light beams, and a regular fog machine fills the room. Low fog is made to stay low and hug the floor, so it looks like a cloud around your feet while the room above stays clear.",
  },
  {
    q: "How long does the cloud last?",
    a: "It is a moment effect. We fill the floor right before the first dance or the moment you choose, it holds for the song, and then it thins out and clears. If you want it twice in one night, for example the first dance and a parent dance, tell me early so we plan the timing.",
  },
  {
    q: "What does my venue need to provide for low fog?",
    a: "One dedicated 30 amp circuit near the dance floor, used only by the fog machine. Our machine draws up to 3,000 watts on 120 volts while it warms up, which is more than a normal 20 amp outlet can carry. I send your venue a power plan in advance so nobody is surprised on the day.",
  },
  {
    q: "Will low fog set off the smoke detectors?",
    a: "That depends on the building and its detectors, so we never assume. I ask the venue in writing before the wedding, and if they want a test or a detector plan, we do it before guests arrive.",
  },
  {
    q: "How much does low fog cost?",
    a: "Low fog is included in the 2027 Full Experience package. On its own it is added to a lighting plan, and lighting starts at $1,500. Every room is different, so I quote it with your venue in mind.",
  },
];

export default function LowFogPage() {
  return (
    <GuidePage
      current="/special-effects"
      crumbs={[
        { name: "Special effects", href: "/special-effects" },
        { name: "Low fog", href: "/low-fog" },
      ]}
      eyebrow="Special effects / Low fog"
      h1="Dancing on a cloud"
      lede="Low-lying fog turns your first dance into the photo everyone asks about: a white cloud around your feet, light cutting through it, and the room above still clear. Here is how we do it, and what your venue needs to know."
      hero={PHOTOS.lowFogLift}
      facts={[
        { label: "What it is", value: "A thick, white fog that stays low on the dance floor" },
        { label: "Best moments", value: "First dance, parent dances, grand entrance" },
        { label: "Power", value: "Its own 30 amp, 120 volt circuit (NEMA L5-30 or equivalent)" },
        { label: "Warm-up", value: "About 5 minutes at full power before the moment" },
        { label: "Included in", value: "The 2027 Full Experience package" },
        { label: "Where", value: "Weddings across NC, SC and East Tennessee" },
      ]}
      factsTitle="Low fog at a glance"
      sections={[
        {
          h2: "What low fog looks like",
          p: [
            "Low fog is the effect people call dancing on a cloud. The fog rolls out across the floor and stays there, knee to waist high, while the air above it stays clear. Guests can still see your faces, the photographer can still shoot across the room, and the two of you look like you are standing in the sky.",
            "On its own it is beautiful. With light it is something else. I aim the wash lights and beams so they hit the top of the cloud, which makes it glow and gives your photographer clean edge light on both of you. That is why low fog and lighting are planned together, not as separate add-ons.",
          ],
          photo: PHOTOS.firstDanceCloud,
          caption: "Low fog under warm and white light during a first dance.",
        },
        {
          h2: "When to use it",
          p: [
            "Most couples use low fog once, for the first dance, because it is the one moment every guest is watching. Other moments that work well are a parent dance, the grand entrance into the reception, and a slow song late in the night when you want one more big picture.",
            "Low fog needs a few minutes of lead time, so it goes into the run of show like any other cue. As your host I am the one calling that cue, which is the advantage of one team running the microphone, the music and the effects: the fog is ready exactly when the song starts, not two minutes late.",
          ],
        },
        {
          h2: "Power: the part venues need to know",
          p: [
            "This is the technical detail that catches people out. Our low-fog machine draws up to 3,000 watts on 120 volts during its warm-up, about 26 amps. A standard wall outlet sits on a 20 amp circuit, so the fog machine cannot share an outlet with anything else and it cannot run off the same circuit as the lights or the sound.",
            "So for low fog I ask the venue for one dedicated 30 amp circuit near the dance floor (a NEMA L5-30 outlet or the venue's equivalent). After the warm-up the heater cycles down, but the circuit has to be sized for the peak. I plan every wedding's power in advance and send the venue a short power plan listing each circuit and where it needs to be, so the electrician or coordinator can say yes or offer an alternative before the day, not during dinner.",
          ],
          list: [
            "One dedicated 30 amp, 120 volt circuit for the fog machine",
            "Separate 20 amp circuits for sound and for lights, planned per room",
            "Written OK from the venue for fog, plus any detector rules",
            "Time to set up and test before guests walk in",
          ],
        },
        {
          h2: "Venue rules and safety",
          p: [
            "Every venue has its own rules about fog, haze and anything that might affect a fire alarm. I never assume. Once you book, I ask your coordinator in writing whether low fog is allowed, where the nearest suitable power is, and whether they want a test or a detector plan. If a venue says no, I tell you right away and we plan a different moment, for example a spotlight and beams for the first dance.",
            "On the night, the fog stays on the dance floor and someone from my team runs the machine. We keep cables taped and out of walkways and we test the effect before guests arrive.",
          ],
          photo: PHOTOS.fatherDaughterFog,
          caption: "A parent dance with low fog and three white beams.",
          links: [
            ["/cold-sparklers", "Cold sparklers"],
            ["/wedding-uplighting", "Uplighting and dance floor lighting"],
            ["/2027", "The 2027 package with low fog"],
          ],
        },
      ]}
      faq={FAQ}
      related={[
        ["/special-effects", "All special effects"],
        ["/cold-sparklers", "Cold sparklers"],
        ["/wedding-uplighting", "Uplighting guide"],
        ["/lighting", "Wedding lighting"],
        ["/venues", "Venue guides"],
        ["/pricing", "Pricing"],
      ]}
      jsonLd={[
        serviceLd({
          name: "Low fog for weddings (dancing on a cloud)",
          path: "/low-fog",
          description: DESCRIPTION,
          serviceType: "Wedding special effects",
        }),
      ]}
    />
  );
}
