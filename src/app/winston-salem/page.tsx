import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Winston-Salem, NC — Dan's Events",
  description:
    "Winston-Salem's premier wedding DJ and MC, based in Asheville. Serving the Piedmont Triad — Graylyn Estate, Millennium Center, Kimpton Cardinal, Tanglewood Park, and venues across Forsyth County.",
  keywords: [
    "wedding DJ Winston-Salem NC",
    "Winston-Salem wedding MC",
    "wedding DJ Piedmont Triad",
    "Winston-Salem wedding entertainment",
    "Forsyth County wedding DJ",
    "Graylyn Estate wedding DJ",
    "Millennium Center wedding DJ",
    "Kimpton Cardinal wedding DJ",
  ],
};

const data: LocationData = {
  city: "Winston-Salem",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "winston-salem",
  heroTagline:
    "From historic estates to Art Deco ballrooms — bringing unforgettable wedding energy to the Piedmont Triad.",
  introParagraph:
    "Winston-Salem sits about 135 miles east of my Asheville home base — a drive I'm glad to make for couples who want a wedding that actually feels like a celebration. The Piedmont Triad has stunning venues, a rich cultural scene, and the kind of warm Southern hospitality that makes for great weddings. What I bring is the craft: reading your crowd, bridging your families, and creating the kind of reception energy that people talk about long after the last dance. One DJ, one MC, one seamless night.",
  regionDescription:
    "The Winston-Salem area blends Old South elegance with a thriving arts scene, giving couples a remarkable range of venue options — grand historic estates, sophisticated downtown ballrooms, sprawling equestrian properties, and intimate brewpub spaces. Forsyth County venues are backed by the legacy of the Reynolds and Gray families, whose philanthropic investments created many of the region's most beautiful event spaces. Whether you're drawn to the grandeur of Graylyn Estate or the craft-beer warmth of Foothills Brewing, the Piedmont Triad delivers.",
  venues: [
    {
      name: "Graylyn Estate",
      location: "Winston-Salem",
      description:
        "Award-winning luxury boutique hotel and event venue on 85 acres, built in 1932 as the country estate of Bowman Gray. Historic Norman Revival architecture, curated gardens, and indoor/outdoor spaces for up to 150 guests.",
    },
    {
      name: "The Millennium Center",
      location: "Downtown Winston-Salem",
      description:
        "Neo-Classical Greek Revival landmark in Winston-Salem's Downtown Arts District. The 72,000 sq ft venue hosts 96–400 guests across a grand ballroom with 20 crystal chandeliers, an art gallery, and a cocktail bar.",
    },
    {
      name: "Kimpton Cardinal Hotel",
      location: "Downtown Winston-Salem",
      description:
        "Glamorous Art Deco hotel in the historic R.J. Reynolds building, featuring the Magnolia Ballroom with Maya Angelou-inspired carpeting and a 20th-floor space with sweeping city and mountain views. Capacity up to 217 guests.",
    },
    {
      name: "The Barn at Reynolda Village",
      location: "Winston-Salem",
      description:
        "Exclusive historic barn adjacent to Reynolda Gardens on the Reynolds estate. Full-day access from 9 a.m. to midnight for up to 130 guests, complete with tables, chairs, and a vintage wood bar.",
    },
    {
      name: "Tanglewood Park — The Red Barn",
      location: "Clemmons",
      description:
        "Beautifully redesigned 4,600 sq ft barn within Tanglewood's 1,100-acre public park. Seats up to 250 guests with manicured park grounds and Tanglewood's scenic lakes and arboretum as your backdrop.",
    },
    {
      name: "Legacy Stables & Events",
      location: "Winston-Salem",
      description:
        "30-acre family equestrian estate with three distinct event spaces — the Grace Barn (up to 700 guests), Cate's Ballroom, and Salem Stallway. Rustic elegance set among gorgeous gardens and rolling grounds.",
    },
    {
      name: "Forsyth Country Club",
      location: "Winston-Salem",
      description:
        "Premier private club ballroom with twin bay windows, two fireplaces, and a terrace overlooking the golf course greens. The ballroom seats up to 350 guests in an atmosphere of refined Southern tradition.",
    },
    {
      name: "Old Town Club",
      location: "Winston-Salem",
      description:
        "Established in 1939, this private country club offers elegant event spaces with a whole-floor rental including covered and uncovered balconies, perfectly suited for weddings of all sizes on an 18-hole golf course estate.",
    },
    {
      name: "Knollwood Country Club",
      location: "Winston-Salem",
      description:
        "A charming private club with a contemporary clubhouse, panoramic golf course views, and a dining room that comfortably accommodates up to 150 guests for an intimate, well-appointed celebration.",
    },
    {
      name: "Historic Brookstown Inn",
      location: "Winston-Salem",
      description:
        "Industrial-chic venue in a textile mill dating to 1837. The Artista Mills room features exposed brick, historic wood columns, chandeliers, and oversized windows. Outdoor courtyard ceremonies for up to 200 guests.",
    },
    {
      name: "The Hawthorne Inn & Conference Center",
      location: "Winston-Salem",
      description:
        "Modern hotel venue with over 10,000 sq ft of flexible event space spread across four rooms, accommodating up to 320 guests for ceremonies, receptions, rehearsal dinners, and bridal showers.",
    },
    {
      name: "Foothills Brewing",
      location: "Downtown Winston-Salem",
      description:
        "Winston-Salem's beloved craft brewery offering 4,500 sq ft of event space across three rooms at their Footnote venue. Full-service catering from an on-site culinary team. Ideal for rehearsal dinners and relaxed receptions up to 250 guests.",
    },
    {
      name: "Studio Novella Winston",
      location: "Winston-Salem",
      description:
        "A sleek 2,100 sq ft blank-canvas studio in the heart of the city — a minimalist backdrop that lets your florals, lighting, and personal style take center stage for intimate celebrations.",
    },
  ],
  nearbyAreas: [
    "Greensboro",
    "High Point",
    "Kernersville",
    "Clemmons",
    "Lewisville",
    "Pfafftown",
    "Mocksville",
    "Lexington",
    "Thomasville",
    "Burlington",
    "Salisbury",
    "Statesville",
  ],
  faq: [
    {
      question: "Do you travel from Asheville to Winston-Salem for weddings?",
      answer:
        "Yes — Winston-Salem is about 135 miles from my Asheville base, roughly a 2-hour drive. I regularly travel throughout North Carolina and the Southeast for weddings. Travel fees apply for distances beyond 60 miles, and I'm happy to discuss what that looks like for your date and venue.",
    },
    {
      question: "How far in advance should I book for a Winston-Salem wedding?",
      answer:
        "Peak season in the Piedmont Triad runs May through October, and popular venues like Graylyn Estate and the Millennium Center book up fast. I'd recommend reaching out 12–18 months before your date — even earlier if you have a Saturday in peak season. The sooner we connect, the more time we have to plan something truly personal.",
    },
    {
      question: "What is a tamada, and how does it apply to my wedding?",
      answer:
        "A tamada is the master of ceremonies in the Slavic wedding tradition — the person responsible for keeping the energy alive, toasting to the couple, connecting families, and making sure every guest feels like a cherished part of the celebration. It's a role I've trained for seriously, and it's what separates my approach from a DJ who simply plays music. I run your entire reception with intention and heart.",
    },
    {
      question: "Can you handle both the ceremony and reception at Winston-Salem venues?",
      answer:
        "Absolutely. I cover everything from the ceremony processional to the final song of the night — one person, one cohesive vision. That means no awkward handoffs between vendors, no wondering who is in charge of the mic, and no dead air. Whether you're at the Kimpton Cardinal's ballroom or Legacy Stables' Grace Barn, I'll have the sound dialed in and the timeline running smoothly.",
    },
    {
      question: "Have you worked at venues in the Winston-Salem area before?",
      answer:
        "I've performed at venues across North Carolina, and I study every new venue before the event — acoustics, layout, load-in logistics, and sight lines all matter. Even if I haven't performed at your specific venue before, I do thorough advance preparation so the day runs like I've been there a hundred times.",
    },
  ],
};

export default function WinstonSalemPage() {
  return <LocationPage data={data} />;
}
