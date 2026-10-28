import GuidePage from "@/components/seo/guide-page";
import { PHOTOS } from "@/lib/photos";
import { pageMeta, serviceLd } from "@/lib/seo";

const TITLE = "Wedding Uplighting & Dance Floor Lighting | Dan's Events";
const DESCRIPTION =
  "A plain-English guide to wedding lighting: uplighting, dance floor beams, warm ambient light, toast and spotlight moments, DMX scenes and venue power.";

export const metadata = pageMeta({ path: "/wedding-uplighting", title: TITLE, description: DESCRIPTION, image: PHOTOS.longTableRetro.src });

const FAQ = [
  {
    q: "What is wedding uplighting?",
    a: "Uplighting means lights placed on the floor, pointed up at walls, columns, beams, drapes or trees. It changes how the whole room feels at night without lighting anyone in the face. It is usually the first layer of a lighting plan.",
  },
  {
    q: "Do you use colored lights?",
    a: "My style is warm white and white: candle-warm walls, clean white beams on the dance floor, and nothing that turns faces purple in photos. The fixtures can do color, so if you want a color for one song or a party moment, we can plan it.",
  },
  {
    q: "How many uplights does a reception need?",
    a: "It depends on the room, not a number on a package. A barn with exposed beams needs a different plan than a hotel ballroom with mirrors. I look at the floor plan and photos of your venue and plan where each light goes, then tell you what it will look like.",
  },
  {
    q: "What power does wedding lighting need?",
    a: "Lights and sound each run on their own ordinary 20 amp circuits, planned for your room. If you add low fog, that machine needs a separate dedicated 30 amp circuit. I send your venue a short power plan before the wedding so the outlets are ready when we load in.",
  },
  {
    q: "How much is wedding lighting?",
    a: "Lighting starts at $1,500 for the stage and dance floor. A full lighting package is closer to $3,000. The 2027 Full Experience package includes hosting, DJ, two wash lights, two spotlights and low fog.",
  },
];

export default function WeddingUplightingPage() {
  return (
    <GuidePage
      current="/lighting"
      crumbs={[
        { name: "Lighting", href: "/lighting" },
        { name: "Uplighting & dance floor", href: "/wedding-uplighting" },
      ]}
      eyebrow="Lighting guide"
      h1="Uplighting, dance floor and the light in between"
      lede="Good wedding lighting is layers, not a pile of fixtures: warm light on the room, flattering light on faces, beams for the dance floor, and a few planned moments. This guide explains each layer and what it asks of your venue."
      hero={PHOTOS.longTableRetro}
      facts={[
        { label: "Style", value: "Warm white and white, color only when you ask for it" },
        { label: "Layers", value: "Uplighting, ambient, stage and toasts, dance floor, moments" },
        { label: "Fixtures", value: "Moving beams and spots, high-CRI washes, pixel bars, warm retro lamps, blinders" },
        { label: "Control", value: "DMX, with scenes programmed for your venue" },
        { label: "Power", value: "Separate 20 amp circuits for lights and sound, planned in advance" },
        { label: "Price", value: "From $1,500; a full lighting package is closer to $3,000" },
      ]}
      factsTitle="Wedding lighting at a glance"
      sections={[
        {
          h2: "Layer one: uplighting the room",
          p: [
            "Uplights sit on the floor and wash up a surface: a stone wall, timber beams, drapes, a row of trees outside a glass wall. They do not light people, they light the room people are in, and that is what makes a space feel finished after dark.",
            "I keep this layer warm, close to candlelight, because warm walls make skin look good and keep the room calm through dinner. Where the room has strong architecture, like a gable, columns or a fireplace, I light that and leave the rest in soft shadow. A room lit evenly from corner to corner looks like a conference hall.",
          ],
          photo: PHOTOS.drapedCeiling,
          caption: "Warm uplighting on draped fabric, with beams over the dance floor below.",
        },
        {
          h2: "Layer two: ambient and table light",
          p: [
            "Between the walls and the dance floor there is the light your guests sit in. Warm retro-style lamps, vertical pixel bars and low blinders add glow and depth without glare, and they look beautiful in the background of portraits. This is the layer people describe as the room feeling expensive.",
          ],
          photo: PHOTOS.longTableRetro,
          caption: "Warm round lamps and vertical light bars behind a long reception table.",
        },
        {
          h2: "Layer three: stage, toasts and faces",
          p: [
            "Toasts, the head table and any stage need soft, even front light, or your photographer has to choose between dark faces and blown-out backgrounds. I use high-CRI wash lights for this, which keep skin tones natural in photos and video. When someone stands up to speak, the light is already on them.",
            "For the grand entrance and first dance, a spotlight follows the two of you. It is one of the simplest effects and one of the most powerful, because it tells every guest where to look.",
          ],
          photo: PHOTOS.stageWarmBeams,
          caption: "Warm beams and light bars framing a toast on stage.",
        },
        {
          h2: "Layer four: the dance floor",
          p: [
            "When the party starts, the moving heads take over: beams that sweep over the crowd, spots that throw patterns on the floor, washes that pulse with the music. With a little haze or low fog the beams become visible in the air, which is what makes a dance floor feel like a show instead of a wedding with the lights turned down.",
            "All of it runs over DMX, the standard control signal for stage lighting. I program scenes for your room before the wedding: dinner, toasts, first dance, party, last dance. On the night my team changes scenes on cue with the music and the program, because the same team runs the microphone, the music and the lights.",
          ],
          photo: PHOTOS.danceBeamsHaze,
          caption: "White beams through haze and low fog over the dance floor.",
        },
        {
          h2: "Power and what your venue needs",
          p: [
            "Lighting is where weddings trip breakers. Every fixture has a real power draw, and I add them up per circuit before the wedding, using my own power planner. The venue gets a short plan listing the circuits I need and where, so their team can confirm or suggest alternatives in advance. Sound and lights run on separate 20 amp circuits. Low fog, if you add it, needs its own dedicated 30 amp circuit.",
          ],
          list: [
            "A floor plan or photos of the room so I can place the lights",
            "Circuits near the dance floor and the stage, confirmed in advance",
            "Load-in time before guests arrive, for setup and a full test",
            "The venue's rules on fog, haze, sparks and anything hung from the ceiling",
          ],
          links: [
            ["/lighting", "Our lighting design"],
            ["/low-fog", "Low fog"],
            ["/cold-sparklers", "Cold sparklers"],
          ],
        },
      ]}
      faq={FAQ}
      related={[
        ["/lighting", "Wedding lighting"],
        ["/special-effects", "All special effects"],
        ["/low-fog", "Low fog"],
        ["/cold-sparklers", "Cold sparklers"],
        ["/venues", "Venue guides"],
        ["/pricing", "Pricing"],
      ]}
      jsonLd={[
        serviceLd({
          name: "Wedding uplighting and dance floor lighting",
          path: "/wedding-uplighting",
          description: DESCRIPTION,
          serviceType: "Wedding lighting design",
        }),
      ]}
    />
  );
}
