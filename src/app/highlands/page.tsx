import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Highlands & Cashiers, NC — Dan's Events",
  description:
    "Highlands and Cashiers NC's premier wedding DJ and MC. Serving Old Edwards Inn, High Hampton, Chimney Pond Farm, and all of the Plateau's upscale mountain venues. Unforgettable destination weddings ~55 miles from Asheville.",
  keywords: [
    "wedding DJ Highlands NC",
    "Cashiers NC wedding DJ",
    "Highlands NC wedding MC",
    "Old Edwards Inn wedding DJ",
    "High Hampton Resort wedding DJ",
    "Chimney Pond Farm wedding DJ",
    "Nantahala Plateau wedding DJ",
    "Sapphire Valley wedding DJ",
    "Blue Ridge mountain destination wedding DJ",
    "Highlands Cashiers wedding entertainment",
    "upscale mountain wedding DJ NC",
    "Lake Glenville wedding DJ",
  ],
};

const data: LocationData = {
  city: "Highlands",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "highlands",
  heroTagline:
    "The Nantahala Plateau's most elevated destination wedding area — where resort luxury meets the Blue Ridge at 4,000 feet.",
  introParagraph:
    "Highlands and Cashiers sit at the pinnacle of Appalachian destination wedding territory — roughly 55 miles south of Asheville, perched at some of the highest elevations in the eastern United States. This is a world of private clubs, luxury resorts, lake-view farms, and estates that attract couples from across the country for their distinctly unhurried, upscale mountain character. I make the drive from Asheville for every couple who chooses the Plateau — bringing the same focused craft, crowd-reading instinct, and full-night hosting that I give to every event I take on. When your guests have traveled this far, the energy in that room has to match the setting.",
  regionDescription:
    "The Highlands-Cashiers Plateau spans southern Macon and Jackson Counties, sitting atop the Nantahala National Forest at elevations between 3,500 and 4,500 feet. The town of Highlands is famous for its arts community, fine dining, and boutique resort scene anchored by Old Edwards Inn. Just 11 miles east, Cashiers is home to world-class private clubs, Lake Glenville — the highest major reservoir in eastern North America — and the sweeping open grounds of High Hampton Resort. The broader area includes Sapphire, Lake Toxaway, Glenville, and Scaly Mountain — each with its own character and a remarkable concentration of premier event venues per square mile.",
  venues: [
    {
      name: "Old Edwards Inn and Spa",
      location: "Highlands",
      description:
        "The anchor of Highlands luxury hospitality, Old Edwards Inn is a full-service boutique resort with multiple distinct event spaces — from intimate garden courtyards to the grand Madison's ballroom. A landmark Highlands venue for upscale destination weddings.",
    },
    {
      name: "Half-Mile Farm by Old Edwards",
      location: "Highlands",
      description:
        "A serene 14-acre lakeside estate managed by the Old Edwards team, featuring a sloping ceremony lawn beside the water, the Garden House and Dining Pavilion, farm-to-table catering, and adults-only accommodations. One of the most romantically intimate settings on the Plateau.",
    },
    {
      name: "Skyline Lodge",
      location: "Highlands",
      description:
        "A modern mountaintop lodge perched on a hilltop just outside downtown Highlands with stunning long-range views in every direction. Features multiple indoor and outdoor event spaces including the Big Creek Pavilion, Ceremony Lawn, and on-site Oak Steakhouse for curated culinary experiences.",
    },
    {
      name: "High Hampton Resort",
      location: "Cashiers",
      description:
        "A legendary 1,400-acre mountain resort in Cashiers offering full-property wedding buyouts and intimate packages alike. Sweeping lawns, a private lake, and the storied character of one of the most celebrated resort properties in Western North Carolina.",
    },
    {
      name: "Chimney Pond Farm",
      location: "Glenville / Lake Glenville area",
      description:
        "Eighty acres of Frasier fir and blueberry fields at 3,600 feet elevation, with hilltop ceremony sites overlooking the shimmering expanse of Lake Glenville. Accommodates over 250 guests and consistently earns some of the highest reviews of any venue in the region.",
    },
    {
      name: "The Chattooga Club",
      location: "Cashiers",
      description:
        "An exclusive private mountain club in Cashiers Valley featuring a historic rustic clubhouse with stone fireplace, covered porches furnished with antiques, and a lush ceremony lawn. Indoor capacity around 150; elegant and storied in equal measure.",
    },
    {
      name: "Trillium Links and Lake Club",
      location: "Cashiers",
      description:
        "A private residential lake and golf community in the heart of the Blue Ridge with a grand dining room, covered porches, and The Landings deck overlooking Lake Glenville — perfect for cocktail hours and farewell brunches. Scales from 10 to 200+ guests.",
    },
    {
      name: "The Village Green of Cashiers",
      location: "Cashiers",
      description:
        "A 13-acre nonprofit park system in the center of Cashiers featuring the Common's Event Hall and beautifully maintained grounds. A beloved community venue that brings a relaxed, organic mountain elegance to celebrations of all sizes.",
    },
    {
      name: "The Bascom",
      location: "Highlands",
      description:
        "A striking contemporary arts center in Highlands with a distinctive wood, glass, and steel event space that offers one of the most architecturally dramatic settings in Western NC. Ideal for couples who want cultural character alongside mountain scenery.",
    },
    {
      name: "Rockwood Lodge",
      location: "Highlands",
      description:
        "An Adirondack-style estate nestled on beautifully landscaped gardens with dramatic mountain views. This classic lodge venue brings timeless mountain elegance to both ceremonies and receptions on the Highlands Plateau.",
    },
    {
      name: "Fire Mountain Resort",
      location: "Scaly Mountain / Highlands area",
      description:
        "Perched atop one of the highest ridges in the Southern Appalachians, Fire Mountain Resort offers an unparalleled combination of elevation, seclusion, and panoramic mountain vistas — a true destination resort experience for full-weekend wedding celebrations.",
    },
    {
      name: "The Vineyard at High Holly",
      location: "Highlands area",
      description:
        "A boutique vineyard venue near Highlands set on 28 acres of rolling green pastures with phenomenal long-range views of the Blue Ridge. Combines the romance of a working vineyard with the grandeur of mountain scenery.",
    },
    {
      name: "Cedar Creek Club",
      location: "Cashiers",
      description:
        "A private club in the heart of Cashiers originally built as a summer retreat in 1938, carrying decades of mountain heritage. Its intimate, storied character makes it a distinctive choice for couples seeking genuine Plateau history alongside their celebration.",
    },
  ],
  nearbyAreas: [
    "Cashiers",
    "Sapphire",
    "Lake Toxaway",
    "Glenville",
    "Scaly Mountain",
    "Franklin",
    "Brevard",
    "Rosman",
    "Cullowhee",
    "Sylva",
    "Dillsboro",
    "Tuckasegee",
    "Nantahala",
    "Walhalla, SC",
    "Seneca, SC",
  ],
  faq: [
    {
      question: "Do you travel from Asheville to Highlands and Cashiers for weddings?",
      answer:
        "Yes — Highlands and Cashiers are about 55 miles south of Asheville, and it's a drive I make gladly. Travel fees apply for distances beyond 60 miles and are always outlined clearly in your quote. Couples who choose the Plateau deserve entertainment that matches the caliber of the venues up here, and that's exactly what I bring.",
    },
    {
      question: "How far in advance should I book for a Highlands or Cashiers wedding?",
      answer:
        "The Highlands-Cashiers area books exceptionally fast for a destination market. Prime Saturdays at Old Edwards, High Hampton, Chimney Pond Farm, and The Chattooga Club typically fill 14–18 months out, especially June through October. If you have a date in mind, reach out before you've even signed your venue contract — it's not uncommon for entertainment to book before the venue does in this market.",
    },
    {
      question: "What is a tamada, and why does it matter for a destination wedding?",
      answer:
        "A tamada is the traditional Slavic wedding host — the person guiding the emotional arc of the celebration, toasting the couple, uniting families, and making sure the night builds toward something genuinely unforgettable. In a destination wedding setting like Highlands or Cashiers — where guests have traveled far and expectations are high — having a real host rather than just a DJ changes everything. I'm not playing background music; I'm running the room, connecting families who may not know each other, and turning a beautiful venue into an experience people talk about for years.",
    },
    {
      question: "Have you performed at venues on the Highlands-Cashiers Plateau?",
      answer:
        "I've worked across Western North Carolina and do thorough advance preparation for every venue I visit — reviewing acoustics, coordinating with your venue team, and scouting the space before your wedding day. The Plateau's mix of outdoor ceremony lawns, covered pavilions, and historic clubhouses each presents its own audio considerations, and I'm ready for all of them.",
    },
    {
      question: "Do you handle ceremony, cocktail hour, and the full reception?",
      answer:
        "Yes — one person running the entire night from processional to last dance. No vendor handoffs, no miscommunication between a separate ceremony musician and the reception DJ, no gaps in energy. Ceremony, cocktail hour, dinner, and full reception are all part of a single, seamlessly executed experience. For a venue as refined as Old Edwards or High Hampton, that continuity matters.",
    },
  ],
};

export default function HighlandsPage() {
  return <LocationPage data={data} />;
}
