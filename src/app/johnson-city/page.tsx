import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Johnson City & the Tri-Cities, TN — Dan's Events",
  description:
    "Dan's Events brings Asheville's premier wedding DJ and MC experience to Johnson City, Kingsport, Bristol, and the entire Tri-Cities region of Northeast Tennessee. 40+ five-star reviews.",
  keywords: [
    "wedding DJ Johnson City TN",
    "Tri-Cities wedding DJ",
    "Kingsport wedding DJ",
    "Bristol TN wedding DJ",
    "Northeast Tennessee wedding DJ",
    "Elizabethton wedding DJ",
    "Jonesborough wedding DJ",
    "Appalachian Highlands wedding DJ",
    "Johnson City wedding MC",
    "Tennessee wedding entertainment",
  ],
  alternates: {
    canonical: "https://dans-events.com/johnson-city",
  },
  openGraph: {
    title: "Wedding DJ & MC in Johnson City & the Tri-Cities, TN — Dan's Events",
    description:
      "Dan's Events brings Asheville's premier wedding DJ and MC experience to Johnson City, Kingsport, Bristol, and the entire Tri-Cities region of Northeast Tennessee. 40+ five-star reviews.",
    url: "https://dans-events.com/johnson-city",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding DJ & MC in Johnson City & the Tri-Cities, TN — Dan's Events",
    description:
      "Dan's Events brings Asheville's premier wedding DJ and MC experience to Johnson City, Kingsport, Bristol, and the entire Tri-Cities region of Northeast Tennessee. 40+ five-star reviews.",
    images: ["/opengraph-image"],
  },
};

const data: LocationData = {
  city: "Johnson City",
  state: "Tennessee",
  stateAbbr: "TN",
  slug: "johnson-city",
  heroTagline:
    "From the Appalachian Highlands to the heart of the Tri-Cities — crafting unforgettable wedding celebrations across Northeast Tennessee.",
  introParagraph:
    "Johnson City and the Tri-Cities sit just about 60 miles from my home base in Asheville — close enough that I'm a familiar face at venues throughout Northeast Tennessee, far enough that every wedding here feels like a destination event. Whether you're celebrating at a historic mansion in Kingsport, a vineyard estate in Bristol, or a riverside barn tucked into the Appalachian foothills, I bring the same intentional craft: reading your crowd, guiding your timeline, and turning a reception into the kind of night your guests talk about for years.",
  regionDescription:
    "The Tri-Cities region — Johnson City, Kingsport, and Bristol — offers an extraordinary range of wedding settings. You have gracious estate venues and lakeside resorts, working farms and barns framed by the Cherokee National Forest, and intimate historic venues in Tennessee's oldest town. I've performed across this corridor and I understand what makes each space tick acoustically, logistically, and emotionally.",
  venues: [
    {
      name: "Carnegie Hotel & Spa",
      location: "Johnson City",
      description:
        "A boutique luxury hotel in downtown Johnson City offering polished ballroom and event spaces with full-service hospitality — one of the city's top upscale wedding destinations.",
    },
    {
      name: "Johnson City Country Club",
      location: "Johnson City",
      description:
        "A classic country club venue with scenic Blue Ridge Mountain views, timeless indoor ballroom space, and gracious outdoor ceremony settings.",
    },
    {
      name: "Knob Creek Meadows",
      location: "Johnson City",
      description:
        "An open meadow wedding venue on Knob Creek Road with picturesque pastoral scenery and flexible indoor-outdoor event space for larger celebrations.",
    },
    {
      name: "Monarch on Main",
      location: "Johnson City",
      description:
        "A 10,000-square-foot historic downtown Johnson City venue with enchanting architectural character — a stunning blank canvas for modern and classic weddings alike.",
    },
    {
      name: "Greenwood Oaks Farm and Venue",
      location: "Johnson City",
      description:
        "A farmhouse wedding venue in the Tri-Cities area set on sprawling green acreage, offering a warm, rustic aesthetic with genuine farm character.",
    },
    {
      name: "Allandale Mansion",
      location: "Kingsport",
      description:
        "Known as Kingsport's White House, this 5,700 sq ft Georgian-style mansion sits on 25 acres. Rental options include the mansion, Harvey's Barn, Brooks Pavilion, and a 2,000 sq ft outdoor amphitheater.",
    },
    {
      name: "MeadowView Marriott Conference Resort & Convention Center",
      location: "Kingsport",
      description:
        "Nestled in the heart of Kingsport, this full-service Marriott resort offers grand ballrooms and expansive convention space — ideal for large, elegant receptions.",
    },
    {
      name: "The Social",
      location: "Kingsport",
      description:
        "A stylish downtown Kingsport event facility at 240 East Main Street offering a modern, flexible space for receptions of varying sizes.",
    },
    {
      name: "Hoovana Farm",
      location: "Kingsport",
      description:
        "A scenic working farm venue on Cooks Valley Road offering a natural, pastoral setting with the warmth and charm of East Tennessee's rural landscape.",
    },
    {
      name: "Nicewonder Farm & Vineyards",
      location: "Bristol, VA",
      description:
        "Nestled among rolling Virginia hills just across the Tennessee-Virginia state line, this luxury vineyard estate delivers equal parts sophistication and genuine Appalachian hospitality.",
    },
    {
      name: "The Bristol Hotel",
      location: "Bristol, VA",
      description:
        "A stylish boutique hotel in the heart of downtown Bristol — straddling the Tennessee-Virginia border — with modern decor and elegant event spaces for chic urban receptions.",
    },
    {
      name: "The Hidden Vale",
      location: "Elizabethton",
      description:
        "A unique 25-acre barn-style wedding venue minutes from downtown Elizabethton and Johnson City, featuring expansive outdoor ceremony spaces and a sweeping mountain backdrop.",
    },
    {
      name: "Cherokee Creek Farm",
      location: "Jonesborough",
      description:
        "A 23-acre event venue centered on an 1830 farmhouse listed on the National Register of Historic Places — located in Tennessee's oldest town, Jonesborough.",
    },
    {
      name: "The Camp at Buffalo Mountain",
      location: "Jonesborough",
      description:
        "107 acres of unparalleled seclusion tucked between a valley below Buffalo Mountain — a family-owned venue offering complete privacy and tranquility for an intimate or destination-style celebration.",
    },
    {
      name: "The Farm at Jackson Bridge",
      location: "Jonesborough",
      description:
        "A premier 8,000 sq ft event venue along the Nolichucky River framed by the Appalachian Mountains, offering both indoor and outdoor facilities for ceremonies and receptions.",
    },
  ],
  nearbyAreas: [
    "Kingsport",
    "Bristol",
    "Elizabethton",
    "Jonesborough",
    "Greeneville",
    "Erwin",
    "Abingdon, VA",
    "Marion, VA",
    "Unicoi",
    "Mountain City",
    "Blountville",
    "Gray",
    "Piney Flats",
  ],
  faq: [
    {
      question: "Do you travel from Asheville to Johnson City and the Tri-Cities?",
      answer:
        "Yes — Johnson City is approximately 60 miles from my home base in Asheville, and Kingsport and Bristol are roughly 80–95 miles. I regularly serve the entire Tri-Cities corridor. Travel fees are straightforward and outlined clearly in your package — no surprise charges.",
    },
    {
      question: "How far in advance should I book for a Tri-Cities wedding?",
      answer:
        "Peak season Saturdays in Northeast Tennessee book up 12–18 months ahead, especially at popular venues like Allandale Mansion and MeadowView Marriott. As soon as you have your date secured, reach out — even if you haven't finalized your venue yet.",
    },
    {
      question: "What is a tamada, and why does it matter for my wedding?",
      answer:
        "A tamada is the Eastern European tradition of a dedicated wedding host — someone whose sole job is to guide the celebration, connect guests across generations, create toasts, and make sure every moment lands. My background in this tradition means I'm more than a DJ who plays music: I'm the emotional anchor of your reception, keeping energy high and your timeline moving without anyone feeling rushed.",
    },
    {
      question: "Can you handle outdoor venues in the Appalachian foothills?",
      answer:
        "Absolutely. Venues like The Hidden Vale, Cherokee Creek Farm, and The Camp at Buffalo Mountain all have outdoor or semi-outdoor ceremony and reception spaces. I bring professional outdoor-rated equipment and know how to manage acoustics, sightlines, and weather logistics for open-air events.",
    },
    {
      question: "Do you cover the full wedding — ceremony, cocktail hour, and reception?",
      answer:
        "Yes, always. From the ceremony processional to the last dance send-off, I run the entire evening as one cohesive show. One person, one vision, zero handoff gaps. No wondering who cues the first dance or when dinner is supposed to start.",
    },
  ],
};

export default function JohnsonCityPage() {
  return <LocationPage data={data} />;
}
