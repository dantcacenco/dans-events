import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Greenville, SC — Dan's Events",
  description:
    "Premier wedding DJ and MC serving Greenville, SC and the Upstate. 40+ five-star reviews. Based ~65 miles from Asheville, serving all Greenville-area venues.",
  keywords: [
    "wedding DJ Greenville SC",
    "Greenville SC wedding MC",
    "Greenville wedding entertainment",
    "Upstate SC wedding DJ",
    "Greenville wedding DJ",
    "South Carolina wedding DJ",
  ],
  alternates: {
    canonical: "https://dans-events.com/greenville-sc",
  },
  openGraph: {
    title: "Wedding DJ & MC in Greenville, SC — Dan's Events",
    description:
      "Premier wedding DJ and MC serving Greenville, SC and the Upstate. 40+ five-star reviews. Based ~65 miles from Asheville, serving all Greenville-area venues.",
    url: "https://dans-events.com/greenville-sc",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding DJ & MC in Greenville, SC — Dan's Events",
    description:
      "Premier wedding DJ and MC serving Greenville, SC and the Upstate. 40+ five-star reviews. Based ~65 miles from Asheville, serving all Greenville-area venues.",
    images: ["/opengraph-image"],
  },
};

const data: LocationData = {
  city: "Greenville",
  state: "South Carolina",
  stateAbbr: "SC",
  slug: "greenville-sc",
  heroTagline:
    "From Falls Park to the Blue Ridge foothills — bringing world-class wedding energy to Upstate South Carolina.",
  introParagraph:
    "Greenville is one of the Southeast's most exciting wedding destinations, and it's one I love serving. Based in Asheville, NC — just ~65 miles away — I travel to Greenville and all of Upstate SC regularly, and travel is included in my packages. Whether you're celebrating in a downtown loft, a historic mansion, or a foothills farm with mountain views, I bring the same craft: reading your crowd, honoring every tradition, and creating the kind of reception energy that your guests will talk about for years.",
  regionDescription:
    "Upstate South Carolina offers an incredible variety of wedding settings — from the walkable, vibrant streets of downtown Greenville to vineyard estates, European-inspired conservatories, historic mill buildings, and rolling farm properties in the shadow of the Blue Ridge Mountains. The region blends Southern charm with modern sophistication, and I've built a deep familiarity with the venues, vendors, and rhythms that make weddings here so special.",
  venues: [
    {
      name: "The Westin Poinsett",
      location: "Downtown Greenville",
      description:
        "A landmark 1925 historic hotel in the heart of downtown Greenville, offering grand ballrooms and timeless elegance for ceremonies and receptions.",
    },
    {
      name: "Gassaway Mansion",
      location: "Greenville",
      description:
        "The largest private residence in Upstate SC, listed on the National Register of Historic Places, just one mile from Main Street Greenville.",
    },
    {
      name: "Events at Judson Mill",
      location: "Greenville",
      description:
        "A historic 1912 textile mill five minutes from downtown, with industrial-chic spaces including The Smokestack and The Annex accommodating up to 350 guests.",
    },
    {
      name: "The 405 at Judson Mill",
      location: "Greenville",
      description:
        "A gallery-style event venue with 11,500 square feet of indoor space and a 3,000-square-foot covered patio, ideal for modern, design-forward weddings.",
    },
    {
      name: "Vue 1919",
      location: "Downtown Greenville",
      description:
        "Housed in the historic Harper Building near Falls Park, this contemporary venue blends 1920s charm with modern elegance for up to 400 guests.",
    },
    {
      name: "Huguenot Mill",
      location: "Greenville",
      description:
        "An 1882 historic mill venue with exposed brick walls and vintage architecture offering 8,400 square feet of character-rich event space.",
    },
    {
      name: "Larkin's Cabaret Room",
      location: "Downtown Greenville",
      description:
        "A stunning top-floor event space above Larkin's Restaurant with rustic beam ceilings, brick walls, and views of the Wyche Pavilion and Reedy River.",
    },
    {
      name: "Edinburgh West",
      location: "Greenville",
      description:
        "A European-inspired glass conservatory just 25 minutes from downtown Greenville with enchanting garden grounds and a stunning entrance gate.",
    },
    {
      name: "Hotel Domestique",
      location: "Travelers Rest",
      description:
        "A boutique European-inspired hotel set against the Blue Ridge Mountains in Travelers Rest, offering breathtaking views and elegant event spaces for up to 300 guests.",
    },
    {
      name: "Chateau Amelia",
      location: "Upstate SC",
      description:
        "An intimate historic estate featuring a Victorian mini mansion, modern-rustic event barn, and multiple ceremony sites — perfect for micro and all-inclusive weddings.",
    },
    {
      name: "Aurora Farms Event Venue",
      location: "Taylors",
      description:
        "A romantic farm venue on the outskirts of Greenville with lighted weeping willow trees, a beautiful reception hall, and space for up to 250 guests.",
    },
    {
      name: "The Venue at Rose Springs Farms",
      location: "Travelers Rest",
      description:
        "A foothills farm estate with sweeping mountain views, a groom's cabin with fishing dock, bridal suite, fire pit, and access to breathtaking Blue Ridge scenery.",
    },
    {
      name: "Ballenger Bridge",
      location: "Landrum",
      description:
        "A secluded riverside estate along the Middle Tyger River near Glassy Mountain, featuring a covered bridge, octagon pavilion, and acres of natural private beauty.",
    },
    {
      name: "The Barn at Sitton Hill Farm",
      location: "Easley",
      description:
        "A beautifully restored barn venue in Easley offering rustic charm with modern amenities, a spacious bridal suite, caterer's prep area, and a cozy fire pit.",
    },
    {
      name: "Southern Manors",
      location: "Belton",
      description:
        "A restored 1920s farmhouse surrounded by rolling pastures, old-growth trees, and barns — a beautifully pastoral outdoor wedding setting.",
    },
    {
      name: "Grand Holland Estate",
      location: "Mauldin",
      description:
        "A 10,000-square-foot mansion on six woodland acres in Mauldin offering all-inclusive wedding packages in an estate setting since 2000.",
    },
  ],
  nearbyAreas: [
    "Spartanburg",
    "Travelers Rest",
    "Simpsonville",
    "Mauldin",
    "Easley",
    "Anderson",
    "Greer",
    "Taylors",
    "Landrum",
    "Belton",
    "Fountain Inn",
    "Pelzer",
    "Seneca",
    "Gaffney",
    "Duncan",
  ],
  faq: [
    {
      question: "Do you travel to Greenville, SC from Asheville?",
      answer:
        "Absolutely. Greenville is about 65 miles from my base in Asheville, NC — an easy drive through the foothills. Travel to Greenville and the surrounding Upstate SC area is included in all of my packages, so there are no surprise fees.",
    },
    {
      question: "How far in advance should I book for a Greenville wedding?",
      answer:
        "Greenville's wedding scene has exploded in recent years, and peak weekends — especially May through October — book 12 to 18 months in advance. I'd recommend reaching out as soon as you have your date locked in, even if you're still finalizing your venue.",
    },
    {
      question: "Have you worked at Greenville-area venues before?",
      answer:
        "Yes, I've performed at venues across the Upstate SC region. Even for venues I'm visiting for the first time, I do a detailed site walkthrough before every wedding to map out acoustics, power access, and floor layout — so the day runs seamlessly.",
    },
    {
      question: "What makes you different from other Greenville wedding DJs?",
      answer:
        "I don't just play music — I host your wedding. My background as a tamada (the Eastern European tradition of professional wedding hosting) means I'm trained to be the emotional anchor of your celebration. I connect families, guide transitions, create real moments, and make every single guest feel like they belong.",
    },
    {
      question: "Do you handle both ceremony and reception music?",
      answer:
        "Yes — from the ceremony processional through the last dance. One person, one vision, zero handoff gaps. I coordinate with your venue and vendors so everything flows without you having to manage a single cue.",
    },
  ],
};

export default function GreenvilleSCPage() {
  return <LocationPage data={data} />;
}
