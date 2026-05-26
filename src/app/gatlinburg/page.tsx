import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Gatlinburg & the Smoky Mountains — Dan's Events",
  description:
    "Asheville-based wedding DJ and MC serving Gatlinburg, Pigeon Forge, and Sevierville. Smoky Mountain destination weddings done right — only ~90 miles from home base.",
  keywords: [
    "wedding DJ Gatlinburg TN",
    "Smoky Mountain wedding DJ",
    "Pigeon Forge wedding DJ",
    "Sevierville wedding DJ",
    "Great Smoky Mountains wedding entertainment",
    "destination wedding DJ Tennessee",
    "Gatlinburg wedding MC",
    "Smoky Mountains wedding music",
    "Pigeon Forge wedding MC",
    "wedding DJ near Gatlinburg",
  ],
};

const data: LocationData = {
  city: "Gatlinburg",
  state: "Tennessee",
  stateAbbr: "TN",
  slug: "gatlinburg",
  heroTagline:
    "Where the Smokies meet your forever — destination wedding DJ and MC for Gatlinburg, Pigeon Forge, and the Great Smoky Mountains.",
  introParagraph:
    "The Great Smoky Mountains have been drawing couples from across the country for generations, and it's easy to see why — misty ridgelines, national park scenery, and a sense of timeless romance that no ballroom can replicate. As an Asheville-based DJ and MC, I'm just ~90 miles from Gatlinburg, making me a natural fit for couples planning destination weddings across the Pigeon Forge, Sevierville, and Gatlinburg corridor. Whether your wedding is on a mountaintop at 4,000 feet or in a riverfront barn, I bring the same energy, precision, and personal touch that I've honed across hundreds of mountain weddings.",
  regionDescription:
    "The Gatlinburg–Pigeon Forge–Sevierville triangle sits at the gateway to Great Smoky Mountains National Park, the most-visited national park in the United States. The region offers every type of wedding setting imaginable: historic mountain chapels, panoramic mountaintop venues, working farms and orchards, riverside event spaces, and full-service resort properties. Couples who choose this area often plan multi-day celebrations — the abundance of cabin rentals and resort accommodations makes it easy for guests to turn the wedding weekend into a true mountain getaway.",
  venues: [
    {
      name: "The Trillium",
      location: "Pigeon Forge",
      description:
        "Luxurious mountaintop venue perched atop Bluff Mountain with unobstructed 180° panoramic views of the Smokies. The craftsman-inspired Grand Hall features vaulted ceilings, exposed wood beams, and floor-to-ceiling windows. Covered and open patios, a second-story ceremony deck, and six on-site glamping cottages for the wedding party. Accommodates up to 150 guests.",
    },
    {
      name: "The Magnolia",
      location: "Pigeon Forge",
      description:
        "Intimate mountaintop barn venue set on 56 private acres above Pigeon Forge with sweeping Smoky Mountain views. Features exposed beams, roll-away doors, elegant chandeliers, and a connected patio for indoor-outdoor flow. Exclusive buyout — one wedding per day, with a private shuttle to the mountaintop. Up to 100 guests.",
    },
    {
      name: "Honeysuckle Hills",
      location: "Pigeon Forge",
      description:
        "An all-inclusive boutique wedding property on Mill Creek Road featuring a historic 1950s barn, charming chapel, seasonal flower gardens, mountain ridge views, a waterfall, and resident horses Sugar and Ben. Specializes in intimate elopements and weddings up to 75 guests. Open April through mid-November.",
    },
    {
      name: "Norton Creek Resort",
      location: "Gatlinburg",
      description:
        "Idyllic mountain resort on Norton Creek Road offering four distinct wedding venues — The Fish House Lawn, The Pavilion, The Treehouses, and a full resort package. Located adjacent to the national park with treehouse ceremony spaces and creekside settings. Accommodates up to 50 guests for an intimate, immersive experience.",
    },
    {
      name: "Park Vista — a DoubleTree by Hilton",
      location: "Gatlinburg",
      description:
        "Gatlinburg's most prominent full-service hotel wedding venue, offering 25,000 sq ft of event space including a Grand Ballroom for up to 800 guests, manicured outdoor ceremony lawns, and mountain-view guest rooms on every floor. A certified wedding planner is on staff, with in-house catering and AV throughout.",
    },
    {
      name: "Nichols Heir",
      location: "Sevierville",
      description:
        "Modern estate venue spanning 100 acres in Sevierville with three distinct event spaces: The Glass House (floor-to-ceiling glass walls with panoramic mountain views), The Grand Hall (exposed beams and grand staircase, up to 200 guests), and The Garden (a 220-foot stone walkway leading to a ceremony knoll with Smoky Mountain views).",
    },
    {
      name: "White Chapel Farms",
      location: "Sevierville",
      description:
        "An 80-acre family estate established in 1790 in the foothills of the Great Smoky Mountains. Features a classic white chapel, a reception barn, rolling hills, a lake, and mountain views. One of the most historically rooted wedding properties in the Smokies — operating as a venue while still in the same family after 235 years.",
    },
    {
      name: "The River Place",
      location: "Sevierville",
      description:
        "Modern farmhouse-inspired venue tucked away on 56 scenic acres in Sevierville with riverfront views and a Smoky Mountain backdrop. Climate-controlled indoor space for 100 guests (expandable to 300 indoors and out), plus on-site treehouses and an Airbnb for the wedding party. Minutes from historic downtown Sevierville.",
    },
    {
      name: "Dollywood's HeartSong Lodge & Resort",
      location: "Pigeon Forge",
      description:
        "A flagship Smoky Mountains resort with 26,000 sq ft of indoor and outdoor event space. The HeartSong Ballroom accommodates 10 to 700 guests with beautiful chandeliers and Smokies-inspired decor. Features 302 rooms and suites, multiple dining options, and the full Dollywood experience for out-of-town guests staying on site.",
    },
    {
      name: "Above the Vineyard Event Farm",
      location: "Pigeon Forge",
      description:
        "A working orchard and former vineyard in the Smoky Mountain foothills offering an outdoor amphitheater for ceremonies, a newly constructed event barn for receptions, and the option to finish the day with a wine tasting or berry-picking on the farm. A unique farm-to-wedding setting with mountain scenery throughout.",
    },
    {
      name: "Deer Ridge Mountain Resort",
      location: "Gatlinburg",
      description:
        "A mountain resort wedding venue in Gatlinburg featuring expansive views of the Smoky Mountains and 84 condos across three floors, giving guests the rare ability to stay on-site at the actual venue. Sweeping outdoor ceremony spaces set against forested ridgelines make this a popular choice for larger destination celebrations.",
    },
    {
      name: "Velora",
      location: "Sevierville",
      description:
        "A modern farmhouse-style boutique venue in Sevierville featuring a restored 200-year-old historic barn, an elegant covered pavilion, picturesque ponds, willow trees, and open fields — all set against a rolling Smoky Mountain backdrop. Curated for couples who want rustic character with refined, contemporary amenities.",
    },
    {
      name: "Wedding Chapel at the Park",
      location: "Gatlinburg",
      description:
        "One of Gatlinburg's most versatile ceremony venues, offering a traditional chapel, an outdoor arbor, a waterfall ceremony site, and an Enchanted Forest setting — all within a single property. Beloved for intimate elopements and small ceremonies with the national park on the doorstep.",
    },
    {
      name: "The Fox's Den at Foxfire Adventure Park",
      location: "Sevierville",
      description:
        "A stunning mountain wedding venue inside Foxfire Adventure Park in Sevierville offering an unforgettable backdrop of forested ridges and Smoky Mountain scenery. Combines a dramatic natural setting with event facilities suited to adventurous couples who want their wedding to feel like an experience, not just a party.",
    },
    {
      name: "Parkside Resort",
      location: "Pigeon Forge",
      description:
        "A luxury hilltop resort venue in Pigeon Forge with panoramic views and a tranquil setting designed for full weekend-getaway celebrations. On-site lodging lets the wedding party and guests stay together on the property, creating the immersive, resort-style destination wedding experience that the Smokies are known for.",
    },
  ],
  nearbyAreas: [
    "Pigeon Forge",
    "Sevierville",
    "Townsend",
    "Wears Valley",
    "Cosby",
    "Dandridge",
    "Newport",
    "Kodak",
    "Knoxville",
    "Maryville",
    "Alcoa",
    "Jefferson City",
  ],
  faq: [
    {
      question: "How far is Gatlinburg from Asheville, and do you charge travel fees?",
      answer:
        "Gatlinburg is approximately 90 miles from Asheville — about a 90-minute drive through some of the most scenic mountain roads in the Southeast. Because the Smoky Mountains are such a natural extension of the Asheville region I serve, travel to the Gatlinburg–Pigeon Forge–Sevierville corridor is included in all packages at no extra cost. I treat it the same as driving to a venue in Western NC.",
    },
    {
      question: "Have you performed at Smoky Mountain destination weddings before?",
      answer:
        "Yes. The Gatlinburg and Pigeon Forge area is one of the most active destination wedding markets in the country, and I've had the pleasure of performing at several events across the corridor. Even at venues I'm visiting for the first time, I do a site visit or detailed venue consult beforehand to understand the acoustics, layout, and logistics so everything runs seamlessly on your day.",
    },
    {
      question: "What is the tamada tradition, and how does it apply to a Smoky Mountain wedding?",
      answer:
        "The tamada is the traditional Slavic role of wedding host — someone who does much more than play music, but acts as the emotional and ceremonial anchor of the entire celebration. I weave this into every wedding I host: introducing families, leading toasts, creating connective moments between ceremony and reception. In a destination setting like Gatlinburg — where guests may be meeting for the first time — that role of bringing everyone together matters even more.",
    },
    {
      question: "Can you handle outdoor mountain ceremonies where there is no power nearby?",
      answer:
        "Absolutely. Many Smoky Mountain venues feature ceremony sites on ridgelines, meadows, or along creek banks that are far from any power source. I travel with battery-powered speaker systems capable of filling outdoor spaces for 200+ guests without a single cable running to a wall. Sound quality never gets sacrificed for location.",
    },
    {
      question: "Should we book our DJ before or after finalizing a Gatlinburg venue?",
      answer:
        "Either order works, but if you have a peak-season date in mind — September or October especially — I'd recommend locking in your entertainment at the same time you book your venue. Smoky Mountain weddings are extremely popular in fall foliage season, and prime Saturday dates across the corridor go fast. The earlier you reach out, the better your chances of securing the exact date.",
    },
  ],
};

export default function GatlinburgPage() {
  return <LocationPage data={data} />;
}
