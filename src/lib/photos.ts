// Photos used on the guide, venue and hub pages. Alt text describes what is actually in each picture.
// The effects photos come from the 1919 Lighting portfolio (Dan's lighting work). None is captioned with
// a venue name because none is tied to a specific venue in the files. See the SEO image manifest.

export type Photo = { src: string; width: number; height: number; alt: string };

export const PHOTOS = {
  lowFogLift: {
    src: "/photos/2027/low-fog.jpg",
    width: 1080,
    height: 1440,
    alt: "Groom lifting the bride during their first dance on a thick cloud of low fog, lit by bright wash lights",
  },
  firstDanceCloud: {
    src: "/photos/effects/first-dance-on-a-cloud.jpg",
    width: 1080,
    height: 1440,
    alt: "Bride and groom dancing waist-deep in white low fog while guests watch from their tables",
  },
  fatherDaughterFog: {
    src: "/photos/effects/father-daughter-dance-low-fog-beams.jpg",
    width: 1080,
    height: 1351,
    alt: "Bride dancing with an older man on low fog under three white light beams",
  },
  cakeSparks: {
    src: "/photos/effects/cake-cold-sparks-low-fog.jpg",
    width: 914,
    height: 1218,
    alt: "Couple kissing over their cake in front of a columned rotunda, with four cold spark fountains and low fog around them",
  },
  sparkFountains: {
    src: "/photos/effects/first-dance-cold-spark-fountains.jpg",
    width: 1080,
    height: 1440,
    alt: "Couple embracing on the dance floor beside a cold spark fountain throwing sparks into the air",
  },
  longTableRetro: {
    src: "/photos/effects/long-table-warm-retro-lights.jpg",
    width: 1080,
    height: 1440,
    alt: "Long candlelit reception table with flowers, framed by warm round lamps and vertical bars of warm bulbs",
  },
  stageWarmBeams: {
    src: "/photos/effects/stage-warm-beams-toast.jpg",
    width: 1080,
    height: 1440,
    alt: "Couple on a small stage giving a toast, with warm beams fanning from the ceiling and vertical warm light bars behind them",
  },
  drapedCeiling: {
    src: "/photos/effects/draped-ceiling-warm-uplighting.jpg",
    width: 1080,
    height: 1440,
    alt: "Fabric draped across a reception ceiling glowing warm from uplights, with beams over the dance floor below",
  },
  danceBeamsHaze: {
    src: "/photos/effects/dance-floor-beams-haze.jpg",
    width: 1080,
    height: 1350,
    alt: "Couple mid-dance in low fog under a row of white moving-head beams while guests film on their phones",
  },
  hostMic: {
    src: "/photos/2027/hosting-mic.jpg",
    width: 1080,
    height: 1351,
    alt: "Wedding host speaking into a microphone under string lights and stage beams",
  },
  danFloor: {
    src: "/photos/craft.jpg",
    width: 5908,
    height: 8862,
    alt: "Dan with a microphone pointing to the crowd at an outdoor evening reception under string lights",
  },
  danceFloor: {
    src: "/photos/2027/dance-floor.jpg",
    width: 914,
    height: 1218,
    alt: "Wedding guests dancing on a crowded dance floor under a starburst of light",
  },
} satisfies Record<string, Photo>;
