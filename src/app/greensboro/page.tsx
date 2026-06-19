import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Greensboro, NC — Dan's Events",
  description:
    "Greensboro's premier wedding DJ and MC traveling from Asheville. 40+ five-star reviews. Serving Revolution Mill, Grandover Resort, Starmount Forest Country Club, and all Piedmont Triad venues.",
  keywords: [
    "wedding DJ Greensboro NC",
    "Greensboro wedding MC",
    "Greensboro wedding entertainment",
    "Piedmont Triad wedding DJ",
    "wedding DJ Guilford County",
    "Grandover Resort wedding DJ",
    "Revolution Mill wedding DJ",
  ],
  alternates: {
    canonical: "https://dans-events.com/greensboro",
  },
  openGraph: {
    title: "Wedding DJ & MC in Greensboro, NC — Dan's Events",
    description:
      "Greensboro's premier wedding DJ and MC traveling from Asheville. 40+ five-star reviews. Serving Revolution Mill, Grandover Resort, Starmount Forest Country Club, and all Piedmont Triad venues.",
    url: "https://dans-events.com/greensboro",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding DJ & MC in Greensboro, NC — Dan's Events",
    description:
      "Greensboro's premier wedding DJ and MC traveling from Asheville. 40+ five-star reviews. Serving Revolution Mill, Grandover Resort, Starmount Forest Country Club, and all Piedmont Triad venues.",
    images: ["/opengraph-image"],
  },
};

const data: LocationData = {
  city: "Greensboro",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "greensboro",
  heroTagline:
    "From Revolution Mill to Grandover Resort — bringing Asheville's most celebrated wedding DJ experience to the heart of the Piedmont Triad.",
  introParagraph:
    "Greensboro sits about 165 miles east of Asheville, and I make that drive because the Piedmont Triad deserves the same level of craft that western NC couples have come to expect. The Triad's wedding scene is genuinely impressive — restored industrial mills, resort ballrooms, botanical gardens, and rolling farmland all within an hour of each other. I bring the same skills to every venue: reading the room, connecting your families, and building the kind of energy that turns a reception into the night your guests never stop talking about.",
  regionDescription:
    "The Piedmont Triad — Greensboro, Winston-Salem, and High Point — offers a rich mix of wedding settings that reflects the region's blend of history and reinvention. From the brick-and-beam character of Revolution Mill to the championship-course grandeur of Grandover Resort, there's a venue here for every vision. Greensboro's walkable downtown, proximity to the NC Triad's event infrastructure, and easy access from I-40 and I-85 make it a natural choice for couples drawing guests from across the Southeast.",
  venues: [
    {
      name: "The Colonnade at Revolution Mill Events",
      location: "Greensboro",
      description:
        "A stunning industrial-chic venue inside the historic Revolution Mill complex. Original maple floors, exposed brick, enormous windows, a private courtyard, and capacity for up to 250 guests managed by Pepper Moon Catering.",
    },
    {
      name: "Grandover Resort & Spa",
      location: "Greensboro",
      description:
        "AAA Four Diamond resort with the Grandville Ballroom (up to 900 guests), outdoor lawn ceremonies framed by two championship golf courses, on-site spa, and 244 guestrooms for out-of-town family.",
    },
    {
      name: "Starmount Forest Country Club",
      location: "Greensboro",
      description:
        "Classic country club elegance in the heart of Greensboro — grand ballroom with sixteen-foot ceilings, crystal chandeliers, a faux fireplace, and lush golf course views through floor-to-ceiling windows.",
    },
    {
      name: "The McAlister-Leftwich House",
      location: "Downtown Greensboro",
      description:
        "Two beautifully restored historic homes in the heart of downtown Greensboro offering boutique-scale weddings up to 150 seated guests — intimate, architecturally rich, and full of character.",
    },
    {
      name: "The Historic Magnolia House",
      location: "Downtown Greensboro",
      description:
        "The only 100% fully restored Green Book Hotel in North Carolina, now a landmark wedding and event venue near downtown Greensboro with deep historical significance and boutique charm.",
    },
    {
      name: "The Cadillac Service Garage",
      location: "Greensboro",
      description:
        "A registered National Historic landmark repurposed as one of NC's premiere wedding venues — dramatic industrial bones, high ceilings, and a one-of-a-kind atmosphere unlike anything else in the Triad.",
    },
    {
      name: "The Meridian Convention Center",
      location: "Greensboro",
      description:
        "One of the largest event venues in Greensboro with 40,000 square feet of flexible space and capacity for up to 500 seated guests — ideal for grand-scale celebrations with full-service infrastructure.",
    },
    {
      name: "Greensboro Marriott Downtown",
      location: "Downtown Greensboro",
      description:
        "Renovated full-service hotel with 24,000 sq ft of event space accommodating up to 450 guests, combining the convenience of downtown Greensboro with polished ballroom elegance and built-in overnight accommodations.",
    },
    {
      name: "Summerfield Farms",
      location: "Summerfield",
      description:
        "Over 600 acres of rolling green farmland just outside Greensboro — a pastoral, picturesque setting offering open-air ceremonies and rustic barn receptions with countryside tranquility.",
    },
    {
      name: "Covington Gardens",
      location: "Pleasant Garden",
      description:
        "An elegant outdoor garden wedding venue in Pleasant Garden, NC, featuring manicured grounds, lush landscaping, and a romantic natural backdrop just a short drive from downtown Greensboro.",
    },
    {
      name: "Paul J. Ciener Botanical Garden",
      location: "Kernersville",
      description:
        "A seven-acre botanical garden with 15 distinct garden environments — ceremony spaces framed by seasonal blooms, sculpture, and water features create a truly unique and naturally beautiful wedding setting.",
    },
    {
      name: "Oakhaven",
      location: "Greensboro",
      description:
        "A boutique micro-wedding and elopement venue in Greensboro offering an intimate, curated experience for smaller celebrations — thoughtfully designed spaces for couples who want quality over scale.",
    },
    {
      name: "Whisper Chateau",
      location: "Greensboro",
      description:
        "A private seven-acre estate venue in Greensboro combining chateau-style elegance with lush outdoor grounds — a secluded, upscale setting that feels worlds away from the everyday.",
    },
    {
      name: "Shooting Star Horse Farm",
      location: "Greensboro",
      description:
        "A barn and equestrian farm venue with rolling hills, multiple indoor and outdoor ceremony and reception spaces, and the warm, organic character that makes farm weddings so memorable.",
    },
  ],
  nearbyAreas: [
    "Winston-Salem",
    "High Point",
    "Burlington",
    "Kernersville",
    "Summerfield",
    "Oak Ridge",
    "Jamestown",
    "Archdale",
    "Whitsett",
    "Graham",
    "Mebane",
    "Eden",
    "Reidsville",
    "Asheboro",
    "Thomasville",
  ],
  faq: [
    {
      question: "Do you travel from Asheville to Greensboro for weddings?",
      answer:
        "Yes — Greensboro is about 165 miles from my home base in Asheville, roughly a 2.5-hour drive. I travel to the Piedmont Triad regularly and factor travel into all destination packages. Reach out and we'll walk through the details together.",
    },
    {
      question: "What does it mean that you're a tamada?",
      answer:
        "A tamada is the traditional Slavic wedding host — the person responsible for orchestrating the entire emotional arc of the celebration. It's not just about playing music; it's about connecting families, creating genuine moments, and making sure every single guest feels like they belong. It's a centuries-old tradition, and it's exactly how I approach every wedding I host.",
    },
    {
      question: "How far in advance should I book for a Greensboro wedding?",
      answer:
        "Peak season dates (May through October) at popular Triad venues like Grandover and Revolution Mill book up quickly. I'd recommend reaching out 12–18 months in advance to secure your date, especially for Saturdays. The earlier you contact me, the more planning support I can offer.",
    },
    {
      question: "Do you handle ceremony music as well as the reception?",
      answer:
        "Absolutely. I handle everything from the ceremony processional to the last dance — cocktail hour, dinner, and the full reception included. One vendor, one consistent vision, no gaps between moments. You'll never wonder who's responsible for what.",
    },
    {
      question: "Have you worked at Greensboro venues before?",
      answer:
        "I've worked at venues throughout NC and always do thorough advance preparation for every wedding, including site visits when possible. I study the acoustics, layout, and flow of each space so the experience on your wedding day is seamless — whether it's a grand ballroom at Grandover or an intimate courtyard at the McAlister-Leftwich House.",
    },
  ],
};

export default function GreensboroPage() {
  return <LocationPage data={data} />;
}
