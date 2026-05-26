import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Columbia, SC — Dan's Events",
  description:
    "Premier wedding DJ and MC serving Columbia, SC and the Midlands. 40+ five-star reviews. Based ~140 miles from Asheville, serving all Columbia-area venues.",
  keywords: [
    "wedding DJ Columbia SC",
    "Columbia SC wedding MC",
    "Columbia wedding entertainment",
    "Midlands SC wedding DJ",
    "Columbia wedding DJ",
    "South Carolina wedding DJ",
    "wedding DJ Columbia South Carolina",
  ],
};

const data: LocationData = {
  city: "Columbia",
  state: "South Carolina",
  stateAbbr: "SC",
  slug: "columbia-sc",
  heroTagline:
    "From the Vista to the Congaree — bringing world-class wedding energy to the heart of South Carolina.",
  introParagraph:
    "Columbia is South Carolina's capital and one of the state's most vibrant wedding destinations — and it's a city I love serving. Based in Asheville, NC, I'm about 140 miles away and travel to Columbia regularly, with travel included in my packages. Whether you're celebrating in a restored historic bank downtown, a riverside estate in the Vista, a stunning botanical garden, or a lakeside garden venue, I bring the same commitment: reading your crowd, honoring every tradition, and creating the kind of reception energy your guests will talk about for years.",
  regionDescription:
    "The Columbia Midlands offers a remarkable range of wedding settings — from the walkable, arts-rich streets of the Vista and downtown to plantation-style estates, zoo garden ceremonies, historic Victorian homes, and scenic riverfront venues along the Congaree. The city blends deep Southern heritage with a lively university-town energy, and the surrounding Midlands region offers rolling countryside and lakeside properties just minutes from the city center.",
  venues: [
    {
      name: "701 Whaley",
      location: "Olympia Mill Village, Columbia",
      description:
        "A lovingly restored 1903 community center in the heart of Columbia's historic Olympia Mill Village, featuring the Grand Hall with soaring 35-foot ceilings, vintage windows, and multiple event spaces accommodating up to 500 guests.",
    },
    {
      name: "Stone River",
      location: "West Columbia",
      description:
        "A stunning riverfront property at 121 Alexander Rd overlooking the Congaree River and Three Rivers Greenway, featuring a stone fireplace, natural wood floors, a wrap-around porch, and a covered outdoor pavilion.",
    },
    {
      name: "Senate's End",
      location: "The Vista, Columbia",
      description:
        "A collection of distinctive buildings nestled between a wooded ravine and the Congaree River in the Vista, with a Wedding Garden, the Manor House, and grand reception hall — all served by Dupre Catering since 1989.",
    },
    {
      name: "The Lace House",
      location: "Arsenal Hill, Columbia",
      description:
        "A stunning historic home at 800 Richland Street within the Governor's Mansion Complex, offering beautifully manicured gardens, intricate ironwork, and ceremony settings beneath centuries-old magnolia trees.",
    },
    {
      name: "1208 Washington Place",
      location: "Downtown Columbia",
      description:
        "A hidden gem in the heart of downtown Columbia dating to 1924 — once The First National Bank, now a National Historic Register event venue with original bank vaults, 22-foot vaulted ceilings, and a private outdoor patio.",
    },
    {
      name: "Riverbanks Zoo & Garden",
      location: "Columbia",
      description:
        "One of the Southeast's most unique wedding settings at 500 Wildlife Parkway, with elegant indoor spaces and botanical garden grounds among lush plant collections — a truly unforgettable backdrop for ceremonies and receptions.",
    },
    {
      name: "The Millstone at Adams Pond",
      location: "South Columbia",
      description:
        "A historic 1700s estate at 5301 Bluff Road set on 30 acres in the Cowasee Basin, featuring a signature red brick building at the pond's edge, a woodland footbridge, and wraparound deck just 5 miles from downtown.",
    },
    {
      name: "The M Garden",
      location: "West Columbia",
      description:
        "A meticulously landscaped indoor-outdoor garden venue at 3506 Bush River Road featuring picturesque ponds, cascading fountains, a waterfall, a wooden water wheel, and an elegant pergola ceremony space.",
    },
    {
      name: "Central Energy",
      location: "Bull Street District, Columbia",
      description:
        "A modern, flexible event space in the vibrant Bull Street District at 2030 Gregg Street, offering over 8,000 square feet of indoor-outdoor space with a stage that opens to the lawn — perfect for lively, design-forward weddings.",
    },
    {
      name: "The River Road House & Jasmine House",
      location: "North Columbia",
      description:
        "A family-owned venue campus at 2204 North Lake Drive featuring two historic houses, blooming gardens, and enchanting outdoor spaces that create a romantic, intimate atmosphere for ceremonies and receptions.",
    },
    {
      name: "South Carolina State Museum",
      location: "Downtown Columbia",
      description:
        "An iconic venue at 301 Gervais Street in downtown Columbia's Vista, with unique gallery and atrium spaces that accommodate from intimate rehearsal dinners to grand receptions of over 1,000 guests.",
    },
    {
      name: "Columbia Museum of Art",
      location: "Downtown Columbia",
      description:
        "A premier cultural venue in the heart of downtown Columbia offering nine distinct event spaces, from intimate gallery rooms to grand halls — accommodating 40 to 1,400 guests with dedicated events staff.",
    },
    {
      name: "Thomas House and Garden",
      location: "Ridgeway, SC",
      description:
        "A picturesque Victorian property built in 1906 and listed on the National Historic Register, located just north of Columbia in Ridgeway — offering intimate garden weddings and all-inclusive elopement packages.",
    },
    {
      name: "Inn at USC / Graduate by Hilton Columbia",
      location: "University District, Columbia",
      description:
        "A historic boutique hotel at 1619 Pendleton Street just steps from the USC Horseshoe, offering charming campus-adjacent event spaces with onsite catering for ceremonies and receptions of all sizes.",
    },
  ],
  nearbyAreas: [
    "Lexington",
    "West Columbia",
    "Irmo",
    "Chapin",
    "Blythewood",
    "Winnsboro",
    "Sumter",
    "Camden",
    "Newberry",
    "Batesburg-Leesville",
    "Orangeburg",
    "Lake Murray",
    "Cayce",
    "Forest Acres",
    "Lugoff",
  ],
  faq: [
    {
      question: "Do you travel to Columbia, SC from Asheville?",
      answer:
        "Absolutely. Columbia is about 140 miles from my base in Asheville, NC — roughly a 2-hour drive through the Carolinas. Travel to Columbia and the surrounding Midlands area is included in all of my packages, so there are no surprise fees when you book.",
    },
    {
      question: "How far in advance should I book for a Columbia wedding?",
      answer:
        "Columbia's wedding calendar fills quickly, especially at popular venues like 701 Whaley, Stone River, and Senate's End. Peak weekends from April through October tend to book 12 to 18 months out. I'd recommend reaching out as soon as your date is set, even if venue details are still being finalized.",
    },
    {
      question: "Have you worked at Columbia-area venues before?",
      answer:
        "Yes, I've performed at venues throughout the Columbia Midlands region. Even at venues I'm visiting for the first time, I do a thorough pre-event site walkthrough to map acoustics, power placement, and the flow of the space — so the day runs seamlessly from the first dance to the last.",
    },
    {
      question: "What does it mean that you're a tamada?",
      answer:
        "A tamada is the Eastern European tradition of a professional wedding host — someone who doesn't just play music but serves as the emotional anchor of the celebration. I connect families, guide every transition, create real moments, and make sure every guest feels welcomed and part of the story. It's a fundamentally different approach than a DJ who just queues songs.",
    },
    {
      question: "Do you handle ceremony music as well as the reception?",
      answer:
        "Yes — from the processional to the last dance, I handle it all. One person, one vision, zero handoff gaps. I coordinate directly with your venue and vendors so you don't have to manage a single audio cue on your wedding day.",
    },
  ],
};

export default function ColumbiaSCPage() {
  return <LocationPage data={data} />;
}
