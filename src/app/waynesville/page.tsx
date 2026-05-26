import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Waynesville, NC — Dan's Events",
  description:
    "Waynesville's premier wedding DJ and MC. Serving Maggie Valley, Canton, Clyde, Sylva, and all of Haywood County. Unforgettable Smoky Mountain weddings ~31 miles from Asheville.",
  keywords: [
    "wedding DJ Waynesville NC",
    "Maggie Valley wedding DJ",
    "Canton NC wedding DJ",
    "Haywood County wedding DJ",
    "Great Smoky Mountains wedding DJ",
    "Waynesville NC wedding MC",
    "Blue Ridge wedding DJ",
    "mountain wedding DJ NC",
    "Clyde NC wedding DJ",
    "Sylva NC wedding DJ",
  ],
};

const data: LocationData = {
  city: "Waynesville",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "waynesville",
  heroTagline:
    "Gateway to the Great Smoky Mountains — crafting unforgettable weddings where the Blue Ridge meets the Smokies.",
  introParagraph:
    "Waynesville is one of Western North Carolina's most beloved wedding destinations, and I make the drive from Asheville — about 31 miles — for every couple who chooses it. Haywood County sits at the meeting point of the Blue Ridge and the Great Smoky Mountains, giving you a landscape that's genuinely hard to match anywhere on the East Coast: rolling ridgelines, valley farms, and mountain creeks that run through nearly every property. I bring the same craft I've honed across Western North Carolina to every Waynesville and Maggie Valley wedding — reading your crowd, connecting your families, and building the kind of energy that turns a Smoky Mountain reception into the night no one forgets.",
  regionDescription:
    "Haywood County stretches from the charming Main Street shops of Waynesville into the deep hollows of Maggie Valley and the rugged terrain along the edge of Great Smoky Mountains National Park. Canton, just east of Waynesville along the Pigeon River, offers farm and estate venues with Cold Mountain as a backdrop, while Maggie Valley draws couples with its creekside settings, resort grounds, and storybook mountain scenery. The region sits along the southern end of the Blue Ridge Parkway and is home to more than a dozen working farms, historic barns, and private estates — all within easy reach of Asheville's culinary and hospitality infrastructure.",
  venues: [
    {
      name: "Laurel Ridge Country Club",
      location: "Waynesville",
      description:
        "The largest special event venue in Haywood County, hosting over 60 weddings a year. The outdoor Pavilion accommodates 250+ guests beside a river rock stone fireplace with panoramic mountain views, while the Grand Rustic Lodge offers elegant indoor space up to 400 guests. A true full-service venue with in-house catering.",
    },
    {
      name: "The Yellow House",
      location: "Waynesville",
      description:
        "An intimate garden estate on five acres in the foothills of the Blue Ridge, featuring ponds, a stream, a waterfall, and winding pathways. Perfect for micro-weddings and elopements of up to 40 guests who want an exclusive, private property with an in-house planner and inn accommodations included.",
    },
    {
      name: "Barn Star Events",
      location: "Jonathan Valley / Waynesville",
      description:
        "A beautifully restored 1940s Angus cattle and tobacco barn still in the original family, set at the edge of the Smoky Mountains in Jonathan Valley. Updated with a bridal suite, dressing rooms, prep kitchen, and sound system — all the character of a century-old Appalachian barn with modern comforts.",
    },
    {
      name: "Brookside Mountain Mist Inn",
      location: "Waynesville",
      description:
        "A luxury bed-and-breakfast wedding venue a mile from downtown Waynesville, nestled beneath the Balsam Mountains. The back patio and wooden pergola overlook a private waterfall feature, offering an intimate, secluded backdrop ideal for smaller ceremonies and vow renewals.",
    },
    {
      name: "The 37",
      location: "Downtown Waynesville",
      description:
        "A historic ballroom venue in the heart of downtown Waynesville, offering an elegant, architecturally distinct space for receptions. Walking distance to hotels, restaurants, and the vibrant arts district that makes Waynesville one of Western NC's most charming small towns.",
    },
    {
      name: "Maggie Valley Club & Resort",
      location: "Maggie Valley",
      description:
        "A full-service resort venue resting between the Blue Ridge and the Great Smoky Mountains, featuring the Renaissance Room — a rustic lodge-style ballroom with cathedral ceilings seating up to 200. Beautiful golf course grounds and mountain views make it ideal for couples wanting a resort-style weekend experience.",
    },
    {
      name: "The Willow House and Social Barn",
      location: "Maggie Valley",
      description:
        "A stunning creekside weekend wedding venue in Maggie Valley featuring waterfalls and breathtaking mountain views. The handcrafted modern barn seats 150 with chandeliers and globe lights, and couples get the whole weekend — with lodging on-site for up to 93 guests — instead of just a 12-hour window.",
    },
    {
      name: "Miss Caroline's Wedding Chapel",
      location: "Maggie Valley",
      description:
        "An all-inclusive intimate wedding chapel in the heart of Maggie Valley, offering two chapel spaces and a waterfall setting for small, meaningful ceremonies. Designed for couples who want a dedicated ceremony space with Smoky Mountain character and no-fuss coordination.",
    },
    {
      name: "Meadowlark Motel",
      location: "Maggie Valley",
      description:
        "A reimagined mountain motel turned unique Appalachian wedding venue accommodating up to 150 guests, blending vintage character with modern comforts. Ceremony, reception, indoor, outdoor, and get-ready rooms are all available, giving couples a full-weekend destination feel in the Smokies.",
    },
    {
      name: "Chestnut Ridge",
      location: "Canton",
      description:
        "An award-winning luxury estate on 150 acres between the Blue Ridge and the Smokies, just 30 minutes from Asheville. Vaulted ceilings and picture windows frame rolling ridgelines throughout the day, and the covered Ceremony Pavilion with retractable windows and panoramic views is one of the finest ceremony sites in Western NC.",
    },
    {
      name: "Springdale Resort",
      location: "Canton",
      description:
        "The Royal Oaks Venue at Springdale Resort is a beautifully restored barn set against Rocky Face Mountain with unobstructed views of Cold Mountain — one of the most recognizable peaks in Western NC. The gathering lawn accommodates up to 120 guests; on-site lodging for 56 makes it perfect for destination weekend celebrations.",
    },
    {
      name: "Henson Farms",
      location: "Canton",
      description:
        "A charming family-owned farm wedding venue with genuine rustic character in the Canton area, offering an authentic Haywood County agricultural setting. For couples who want a real working-farm backdrop with the warmth and flexibility that only a family-run property can offer.",
    },
  ],
  nearbyAreas: [
    "Maggie Valley",
    "Canton",
    "Clyde",
    "Sylva",
    "Dillsboro",
    "Bryson City",
    "Cherokee",
    "Lake Junaluska",
    "Jonathan Valley",
    "Balsam",
    "Hazelwood",
    "Cruso",
    "Bethel",
    "Fines Creek",
    "Cullowhee",
  ],
  faq: [
    {
      question: "Do you travel to Waynesville and Haywood County from Asheville?",
      answer:
        "Yes — Waynesville is about 31 miles from my base in Asheville, which puts it well within my regular service area. Travel is smooth and straightforward on I-40, and I make the trip gladly for every couple who chooses a Haywood County venue. Any travel fees are transparent and included in your quote from the start.",
    },
    {
      question: "How far in advance should I book for a Waynesville wedding?",
      answer:
        "Haywood County's peak season runs May through October, with fall foliage weekends in mid-October booking out 14–18 months in advance. Popular venues like Chestnut Ridge, Laurel Ridge, and The Willow House fill their Saturdays fast. Reach out as soon as you have a date — don't wait until after you've signed your venue contract.",
    },
    {
      question: "Have you worked at Smoky Mountain venues before?",
      answer:
        "I've performed at venues throughout Western NC, including Haywood County and the surrounding Smokies region. For every venue I haven't visited before, I do advance site work — walking the space, checking acoustics, and coordinating with your venue coordinator well before the wedding day. Whether you're in an open-air barn in Jonathan Valley or a resort ballroom in Maggie Valley, the sound and energy are dialed in.",
    },
    {
      question: "What is a tamada, and how does it make my Smoky Mountain wedding different?",
      answer:
        "A tamada is the traditional Slavic wedding host — the person who guides the entire celebration, unites families, leads toasts, and ensures the emotional arc of the night builds toward something unforgettable. It's a fundamentally different role than a standard DJ. I'm not just playing music; I'm the emotional anchor of your reception: creating real moments, bridging families, and turning a schedule of events into a night that actually means something. Most DJs hand you a playlist. I give you a night your guests talk about for years.",
    },
    {
      question: "Do you cover ceremony music and cocktail hour at Waynesville venues?",
      answer:
        "Absolutely. Ceremony, cocktail hour, dinner, and the full reception — one person running everything from the processional to the last dance. No handoffs between a separate ceremony musician and the DJ, no miscommunication between vendors. From the moment guests arrive to the send-off, one vision executed start to finish.",
    },
  ],
};

export default function WaynesvillePage() {
  return <LocationPage data={data} />;
}
