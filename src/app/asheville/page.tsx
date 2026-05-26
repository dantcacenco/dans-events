import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Asheville, NC — Dan's Events",
  description:
    "Asheville's premier wedding DJ and MC. 40+ five-star reviews. Serving the Blue Ridge Mountains, Biltmore Estate, Omni Grove Park Inn, and all WNC venues.",
  keywords: [
    "wedding DJ Asheville NC",
    "Asheville wedding MC",
    "Asheville wedding entertainment",
    "Blue Ridge wedding DJ",
    "WNC wedding DJ",
    "Biltmore wedding DJ",
  ],
};

const data: LocationData = {
  city: "Asheville",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "asheville",
  heroTagline:
    "From the Blue Ridge Mountains to downtown rooftops — creating unforgettable wedding experiences across Western North Carolina.",
  introParagraph:
    "Asheville isn't just where I'm based — it's where I've spent years learning every venue, every sunset angle, every acoustic quirk that makes each space unique. Whether you're planning a grand celebration at Biltmore Estate or an intimate gathering in the mountains, I bring the same craft: reading your crowd, connecting your families, and creating the kind of energy that turns a reception into the night everyone talks about for years.",
  regionDescription:
    "Western North Carolina offers some of the most stunning wedding settings in the country — mountain overlooks, historic estates, vineyards, and riverside farms. I've performed at venues across the region, from Lake Lure to Waynesville, and I know how to match the energy of the room to the magic of the setting.",
  venues: [
    { name: "Biltmore Estate — Antler Hill Barn", location: "Asheville", description: "A restored 1900-era agricultural barn on the Biltmore grounds overlooking the French Broad River. Rustic grandeur meets America's largest home." },
    { name: "Omni Grove Park Inn", location: "Asheville", description: "Iconic historic resort built into the Blue Ridge Mountains with sweeping terraces, grand ballrooms, and 86,000 sq ft of event space." },
    { name: "The Crest Center & Pavilion", location: "Asheville", description: "Hilltop venue minutes from downtown with rustic-elegant indoor and outdoor spaces and sweeping mountain views." },
    { name: "Highland Brewing Events Center", location: "East Asheville", description: "Asheville's first craft brewery offering three distinct private event spaces on an expansive mountain campus." },
    { name: "Honeysuckle Hill Events", location: "Asheville", description: "A 9-acre private estate with a century-old red barn, hayloft chapel with antique pews, and a lily pad pond. Award-winning venue." },
    { name: "Chestnut Ridge", location: "Asheville", description: "Modern mountain-meets-farm estate with wide-open views and multiple curated outdoor event spaces." },
    { name: "Hidden River Events", location: "Asheville", description: "20-acre working horse farm and flower farm with a barn venue, rolling pastures, and mountain views." },
    { name: "The Horse Shoe Farm", location: "Hendersonville", description: "85-acre boutique resort along the French Broad River with a stunning Sunset Barn and luxury on-site accommodations." },
    { name: "Lake Lure Inn & Spa", location: "Lake Lure", description: "Historic 1927 lakefront inn with mountain and lake views. Featured in Dirty Dancing — a timeless romantic setting." },
    { name: "Rumbling Bald on Lake Lure", location: "Lake Lure", description: "Full-service lakeside resort with a beachside ceremony gazebo and panoramic mountain views over Lake Lure." },
    { name: "Point Lookout Vineyards", location: "Tryon", description: "Elevated vineyard with panoramic mountain views stretching across the foothills — one of the most breathtaking ceremony backdrops in NC." },
    { name: "Jeter Mountain Farm", location: "Hendersonville", description: "411-acre working farm with 11,000 sq ft of dedicated venue space, massive barns, and rolling mountain pastures." },
    { name: "Hawk & Hawthorne", location: "Asheville", description: "50-acre private estate with a restored 150-year-old tobacco barn, 360° mountain views, and wildflower meadows." },
    { name: "Oak Hill Farm", location: "Marion", description: "267-acre historic working farm with a Round Top Barn, Grand Carriage Hall, and 1916 Farmhouse. Operating since 1844." },
    { name: "The Farm at Old Edwards", location: "Highlands", description: "Upscale resort farm with a restored early-1900s barn featuring antique player piano, stone fireplace, and soaring beam ceiling." },
    { name: "Seven Maples", location: "Brevard", description: "Rolling farm property bordered by a babbling creek with a barn, open ceremony field, bridal suite, and tree-lined pond." },
    { name: "Ella Asheville", location: "Downtown Asheville", description: "6,000 sq ft blank-canvas event loft in the historic 1928 Broadway Arts Building. Urban-chic industrial style." },
    { name: "Laurel Ridge Country Club", location: "Waynesville", description: "Private country club surrounded by mountain golf course scenery in the Great Smoky Mountains foothills." },
  ],
  nearbyAreas: [
    "Hendersonville", "Black Mountain", "Waynesville", "Brevard", "Lake Lure",
    "Weaverville", "Flat Rock", "Highlands", "Tryon", "Marion",
    "Chimney Rock", "Mills River", "Canton", "Saluda", "Horse Shoe",
  ],
  faq: [
    {
      question: "Do you travel to venues outside Asheville?",
      answer: "Absolutely. I serve all of Western North Carolina — from Lake Lure and Chimney Rock to Waynesville, Highlands, and everything in between. Travel within 60 miles of Asheville is included in all packages.",
    },
    {
      question: "How far in advance should I book for an Asheville wedding?",
      answer: "Peak season in Asheville (May through October) books fast. Most Saturday dates are reserved 12–18 months in advance. I'd recommend reaching out as soon as you have your date, even if you're still finalizing your venue.",
    },
    {
      question: "Have you worked at my venue before?",
      answer: "I've performed at most major Asheville-area venues, from Biltmore Estate to intimate mountain retreats. Even if your venue isn't listed here, I do a site visit before every wedding to understand the space, acoustics, and logistics.",
    },
    {
      question: "What makes you different from other Asheville wedding DJs?",
      answer: "I don't just play music — I host your wedding. My background as a tamada (the Slavic tradition of wedding hosting) means I'm trained to be the emotional anchor of the celebration. I connect families, create moments, and make every guest feel like they belong.",
    },
    {
      question: "Do you provide ceremony music and cocktail hour?",
      answer: "Yes. I handle everything from the ceremony processional to the last dance. One person, one vision, zero gaps between moments. No wondering who's in charge or when the next thing is supposed to happen.",
    },
  ],
};

export default function AshevillePage() {
  return <LocationPage data={data} />;
}
