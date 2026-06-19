import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Brevard, NC — Dan's Events",
  description:
    "Brevard's top-rated wedding DJ and MC. Serving the Land of Waterfalls — Deerwoode Reserve, Greystone Inn, Circle Square Farm, and all Transylvania County venues. ~33 miles from Asheville.",
  keywords: [
    "wedding DJ Brevard NC",
    "Brevard NC wedding MC",
    "Transylvania County wedding DJ",
    "Pisgah Forest wedding DJ",
    "Land of Waterfalls wedding",
    "Deerwoode Reserve wedding DJ",
    "Greystone Inn wedding DJ",
    "WNC wedding DJ",
  ],
  alternates: {
    canonical: "https://dans-events.com/brevard",
  },
  openGraph: {
    title: "Wedding DJ & MC in Brevard, NC — Dan's Events",
    description:
      "Brevard's top-rated wedding DJ and MC. Serving the Land of Waterfalls — Deerwoode Reserve, Greystone Inn, Circle Square Farm, and all Transylvania County venues. ~33 miles from Asheville.",
    url: "https://dans-events.com/brevard",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding DJ & MC in Brevard, NC — Dan's Events",
    description:
      "Brevard's top-rated wedding DJ and MC. Serving the Land of Waterfalls — Deerwoode Reserve, Greystone Inn, Circle Square Farm, and all Transylvania County venues. ~33 miles from Asheville.",
    images: ["/opengraph-image"],
  },
};

const data: LocationData = {
  city: "Brevard",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "brevard",
  heroTagline:
    "In the Land of Waterfalls, surrounded by Pisgah National Forest — bringing world-class wedding entertainment to Transylvania County.",
  introParagraph:
    "Brevard is one of Western North Carolina's most magical wedding destinations — a small arts town nestled inside Transylvania County, framed by Pisgah National Forest and more than 250 waterfalls. It sits about 33 miles from my Asheville base, a straightforward drive down US-64 through the mountains. Every time I pull into Brevard for a wedding, I'm reminded why couples travel from across the country to get married here: the light is different, the air is different, and the settings are simply unlike anywhere else.",
  regionDescription:
    "Transylvania County is nicknamed the \"Land of Waterfalls\" for good reason — Looking Glass Falls, Sliding Rock, and Hooker Falls are all within a few miles of downtown Brevard. The town itself has a thriving arts scene anchored by the Brevard Music Center, a walkable historic district, and some of the most diverse wedding venues in the Blue Ridge — from historic lodges and working farms to lakeside estates and rustic barns tucked into the forest.",
  venues: [
    {
      name: "Deerwoode Reserve",
      location: "Brevard",
      description:
        "A private mountain preserve first developed as a summer camp in the 1920s, now home to the Mayes Event Center (added 2024), rustic cabins, and the Coyote Lodge — a 4,000 sq ft cabin with a soaring 2-story stone fireplace. Up to 40 guests for intimate ceremonies, full receptions in the event center.",
    },
    {
      name: "The Greystone Inn",
      location: "Lake Toxaway",
      description:
        "Originally built in 1915 as the Armstrong family's vacation home, this iconic lakeside inn sits on the shores of Lake Toxaway with sweeping Blue Ridge Mountain views. From intimate lakeside gatherings to grand mountain celebrations, the setting is genuinely spectacular.",
    },
    {
      name: "Circle Square Farm",
      location: "Pisgah Forest",
      description:
        "An 18-acre river-valley property with breathtaking mountain views and on-site lodging for up to 15 guests. The Event Center seats 150 with a large dance floor, wet bar, and catering kitchen — a true all-in-one venue tucked into the Pisgah Forest foothills.",
    },
    {
      name: "Forever Home Farm",
      location: "Brevard",
      description:
        "The oldest documented home in Transylvania County, with records tracing back to the 1800s. This pioneer mountain estate sits in a valley carved by the French Broad and Davidson Rivers — a destination wedding venue with deep roots and timeless beauty.",
    },
    {
      name: "Forge Valley Event Center",
      location: "Mills River",
      description:
        "Family-owned since 2010 and set between Hendersonville, Brevard, and Asheville, Forge Valley overlooks scenic Lyday Lake with the Blue Ridge as backdrop. The 5,000 sq ft event center accommodates 200 guests and includes a covered ceremony lawn.",
    },
    {
      name: "Brevard Lumber Yard Arts District",
      location: "Brevard",
      description:
        "Fifteen thousand square feet of vintage industrial charm in the heart of downtown Brevard, with indoor seating for 300 and a covered, lighted patio. Originally a historic lumber operation, now one of the most versatile event spaces in Transylvania County.",
    },
    {
      name: "The Shamrock Room",
      location: "Brevard",
      description:
        "Brevard's newest dedicated event venue, featuring a state-of-the-art sound system and audio/visual technology. Designed for stylish occasions with a casual elegance — ideal for receptions where the music and atmosphere need to shine.",
    },
    {
      name: "Springdale Resort",
      location: "Pisgah Forest",
      description:
        "A picturesque mountain resort offering a rustic, nature-inspired setting for weddings in the heart of Western North Carolina. Features multiple event spaces, including the Rocky Face Tavern, surrounded by forest and mountain scenery.",
    },
    {
      name: "Seven Maples",
      location: "Brevard",
      description:
        "Rolling farm property bordered by a babbling creek, featuring a barn, open ceremony field, bridal suite, and a tree-lined pond. A quietly romantic setting where mountain light and pastoral scenery do most of the decorating.",
    },
    {
      name: "The Inn at Brevard",
      location: "Brevard",
      description:
        "A stately inn built in 1885 that anchors Brevard's historic district. On-site catering and intimate event spaces make it a natural choice for couples who want the charm of a Victorian-era property with modern hospitality.",
    },
    {
      name: "Brevard Music Center",
      location: "Brevard",
      description:
        "An internationally recognized summer music institute with more than 75 years of history. Its grounds and performance spaces offer a cultured, architecturally rich backdrop for weddings with a love of the arts.",
    },
    {
      name: "Sherwood Forest Robin Hood Barn",
      location: "Brevard",
      description:
        "A historic chestnut barn that has hosted generations of weddings, receptions, square dances, and family gatherings. This rustic landmark carries the spirit of old Appalachia and remains one of Brevard's most beloved event spaces.",
    },
    {
      name: "Connestee Falls Overlook Clubhouse",
      location: "Brevard",
      description:
        "A private community clubhouse perched above the waterfalls of Connestee Falls, described as the area's premier venue for banquets and weddings. Surrounded by nature with breathtaking falls views and mountain air.",
    },
  ],
  nearbyAreas: [
    "Pisgah Forest",
    "Rosman",
    "Lake Toxaway",
    "Cedar Mountain",
    "Mills River",
    "Hendersonville",
    "Flat Rock",
    "Asheville",
    "Horse Shoe",
    "Saluda",
    "Highlands",
    "Cashiers",
  ],
  faq: [
    {
      question: "How far is Dan's Events from Brevard?",
      answer:
        "Brevard is about 33 miles from Asheville — roughly a 45-minute drive via US-64 West. Travel within 60 miles of Asheville is included in all packages, so there's no travel surcharge for Brevard-area weddings. I'm familiar with the roads and the venues, and I build extra drive time into my schedule to make sure I'm set up and sound-checked well before your guests arrive.",
    },
    {
      question: "Have you performed at venues in the Brevard area?",
      answer:
        "Yes — the Brevard and Pisgah Forest area is one of my favorite parts of Western North Carolina. I've worked at venues throughout Transylvania County and always do a pre-event walkthrough to understand the acoustics, load-in logistics, and any power or outdoor-sound considerations specific to each property.",
    },
    {
      question: "What makes you different from other wedding DJs in the Brevard area?",
      answer:
        "My background as a tamada — the Eastern European tradition of a master of ceremonies who serves as the emotional anchor of the entire celebration — sets me apart from a DJ who just plays music. I host the whole event: introductions, toasts, transitions, crowd energy. Couples in Brevard choose me because they want one person who's fully invested in the arc of their night, not just someone filling silence between announcements.",
    },
    {
      question: "Do you handle ceremony music at outdoor venues in Pisgah Forest?",
      answer:
        "Absolutely. Many Brevard-area venues have outdoor ceremony sites — hilltops, creekside clearings, meadows with waterfall views. I bring professional outdoor-rated audio equipment and handle everything from your processional to the recessional. One person, one setup, no gaps. I coordinate directly with your officiant so every moment lands exactly as planned.",
    },
    {
      question: "How early should I book for a Brevard wedding?",
      answer:
        "Brevard is a sought-after destination market — many couples book their venue a year or more in advance, and entertainment fills up just as fast. Peak season (May through October) sees the most competition for dates, especially Saturdays. I'd recommend reaching out as soon as you've locked your venue date, even if other details are still coming together.",
    },
  ],
};

export default function BrevardPage() {
  return <LocationPage data={data} />;
}
