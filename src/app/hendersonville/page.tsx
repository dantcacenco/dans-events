import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Hendersonville, NC — Dan's Events",
  description:
    "Hendersonville's premier wedding DJ and MC, based just 22 miles away in Asheville. Serving Henderson County, Flat Rock, Mills River, and all WNC venues.",
  keywords: [
    "wedding DJ Hendersonville NC",
    "Hendersonville wedding MC",
    "Henderson County wedding DJ",
    "Flat Rock NC wedding DJ",
    "wedding DJ near Hendersonville",
    "WNC wedding DJ",
    "Blue Ridge wedding entertainment",
  ],
};

const data: LocationData = {
  city: "Hendersonville",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "hendersonville",
  heroTagline:
    "Apple orchards, mountain barns, and vineyard sunsets — bringing unforgettable energy to Henderson County's finest weddings.",
  introParagraph:
    "Hendersonville is practically my backyard — just 22 miles from my home base in Asheville, it's a place I know well and love performing in. Henderson County has a character all its own: the apple orchards, the charming downtown, Flat Rock's arts scene, and venues that range from working farms to lakeside resorts. I've worked events across this region and I bring the same depth of craft here that I do at every wedding — reading the room, hosting with intention, and making sure the music and energy match exactly who you are as a couple.",
  regionDescription:
    "Henderson County sits at the heart of the Southern Blue Ridge, with a distinct identity that sets it apart from Asheville. Flat Rock offers the historic Carl Sandburg estate and a sophisticated arts community. Mills River and Horse Shoe are home to spectacular farm and vineyard venues tucked into quiet mountain hollows. The area draws couples who want the mountain magic without the Asheville bustle — and the venues here deliver that beautifully.",
  venues: [
    {
      name: "The Horse Shoe Farm",
      location: "Horse Shoe",
      description:
        "85-acre boutique resort along the French Broad River with a stunning Sunset Barn, curated gardens, and luxury on-site accommodations for the wedding party.",
    },
    {
      name: "Jeter Mountain Farm",
      location: "Hendersonville",
      description:
        "411-acre working farm just minutes from downtown Hendersonville with 11,000 sq ft of dedicated venue space, massive barns, and sweeping mountain pastures.",
    },
    {
      name: "Burntshirt Vineyards",
      location: "Hendersonville",
      description:
        "21.5 acres of grapevines just off I-26, with multiple ceremony sites including The Summit Center, The Vineyards, The Meadows, and The Barn — all surrounded by estate-grown wines.",
    },
    {
      name: "Kanuga",
      location: "Hendersonville",
      description:
        "Conference and retreat center set on a private lake in the Blue Ridge Mountains, offering lakeside vows and candlelit receptions in a serene wooded setting.",
    },
    {
      name: "SKYLARANNA Resort & Spa",
      location: "Hendersonville",
      description:
        "Boutique resort on over 60 acres with more than 16,000 sq ft of indoor event space, panoramic mountain vistas, and complete resort amenities for the full wedding weekend.",
    },
    {
      name: "Highland Lake Inn & Resort",
      location: "Flat Rock",
      description:
        "Nestled in the Blue Ridge Mountains in Flat Rock, the Grand Ole Hall features big timber architecture, vaulted ceilings, solid wood floors, and an outdoor deck overlooking the private lake.",
    },
    {
      name: "The Lodge at Flat Rock",
      location: "Flat Rock",
      description:
        "Mountain lodge and conference center in the heart of Flat Rock with a waterfall courtyard ceremony space, 64 on-site suites for guests, and a dedicated in-house catering team.",
    },
    {
      name: "Kenmure Country Club",
      location: "Flat Rock",
      description:
        "Historic private country club in Flat Rock set against the Blue Ridge Mountains, offering elegant ballroom reception space and lush golf course grounds for outdoor ceremonies.",
    },
    {
      name: "Mountain View Acres",
      location: "Flat Rock",
      description:
        "Rustic outdoor wedding and event center on a 20-acre farm with rolling hills, mountain views, and a cozy yet spacious farmhouse aesthetic.",
    },
    {
      name: "Camp Wayfarer",
      location: "Flat Rock",
      description:
        "60 wooded acres five miles from Hendersonville, crisscrossed by streams and ridgelines — an intimate, nature-immersed venue for couples who want their day to feel like an adventure.",
    },
    {
      name: "The Barn at Tall Oaks Farm",
      location: "Hendersonville",
      description:
        "A romantic 15-acre farm venue in Hendersonville perfect for a modern ranch wedding with natural elements, a spacious barn, and pastoral mountain surroundings.",
    },
    {
      name: "Wag Valley Farm",
      location: "Hendersonville",
      description:
        "A gorgeous barn and farm venue with DuPont State Forest steps away, offering an exquisite nature-immersed setting and stunning views for ceremonies and receptions.",
    },
    {
      name: "Brookside Pavilion on Featherstone Creek",
      location: "Hendersonville",
      description:
        "Delightfully rustic outdoor venue surrounded by majestic mountains and woodland, featuring a lovely pond, a waterfall, and open-air pavilion space for intimate gatherings.",
    },
  ],
  nearbyAreas: [
    "Flat Rock",
    "Mills River",
    "Horse Shoe",
    "Brevard",
    "Saluda",
    "Tryon",
    "Asheville",
    "Arden",
    "Fletcher",
    "East Flat Rock",
    "Etowah",
    "Laurel Park",
    "Chimney Rock",
    "Lake Lure",
  ],
  faq: [
    {
      question: "How far do you travel for Hendersonville weddings?",
      answer:
        "Hendersonville is just 22 miles from my home base in Asheville — it's one of my most frequent service areas and practically local to me. There is no travel fee for weddings in Hendersonville, Flat Rock, Mills River, Horse Shoe, or anywhere in Henderson County.",
    },
    {
      question: "How far in advance should I book for a Hendersonville wedding?",
      answer:
        "Peak season in Henderson County (May through October) fills up quickly, especially at the most sought-after farm and vineyard venues. I'd recommend reaching out 12–18 months ahead for a Saturday date. That said, if you have a specific date in mind, check with me regardless — last-minute availability does open up.",
    },
    {
      question: "Do you DJ and MC, or just one of the two?",
      answer:
        "I do both, and that's the whole point. When the DJ and MC are the same person, your reception flows seamlessly — there's no disconnect between what's playing and what's being said. I manage ceremony music, cocktail hour, dinner, toasts, first dances, and the dance floor all as one unified experience.",
    },
    {
      question: "What is the tamada tradition and how does it apply to my wedding?",
      answer:
        "A tamada is the traditional Slavic role of master of ceremonies — someone who is the emotional and social anchor of the celebration, not just a background vendor. I trained in this tradition, which means I don't just announce the next dance. I connect your families, craft genuine moments, draw guests in, and make every person in the room feel like part of the story. It's the difference between a good wedding and one people talk about for years.",
    },
    {
      question: "Have you worked at Henderson County venues before?",
      answer:
        "Yes — I've performed at venues throughout Hendersonville, Flat Rock, Mills River, and the surrounding area. Every venue has its own acoustic character, layout quirks, and local logistics. I do a thorough pre-event walk-through before every wedding so there are zero surprises on the day.",
    },
  ],
};

export default function HendersonvillePage() {
  return <LocationPage data={data} />;
}
