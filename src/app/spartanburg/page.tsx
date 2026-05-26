import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Spartanburg, SC — Dan's Events",
  description:
    "Premier wedding DJ and MC serving Spartanburg, SC and the greater Upstate. 40+ five-star reviews. Based ~70 miles from Asheville, serving all Spartanburg-area venues.",
  keywords: [
    "wedding DJ Spartanburg SC",
    "Spartanburg SC wedding MC",
    "Spartanburg wedding entertainment",
    "Upstate SC wedding DJ",
    "Spartanburg wedding DJ",
    "South Carolina wedding DJ",
    "wedding DJ near Spartanburg",
  ],
};

const data: LocationData = {
  city: "Spartanburg",
  state: "South Carolina",
  stateAbbr: "SC",
  slug: "spartanburg",
  heroTagline:
    "From the Duncan Estate to the Carolina foothills — bringing world-class wedding energy to Spartanburg and the Upstate.",
  introParagraph:
    "Spartanburg is a city with deep roots and a vibrant, growing wedding scene — and it's one I love serving. Based in Asheville, NC, just ~70 miles away, I travel to Spartanburg regularly and travel is included in my packages. Whether you're celebrating in a downtown historic ballroom, a restored estate garden, a lakeside chapel, or a sprawling country farm, I bring the same craft: reading your crowd, honoring every tradition, and creating the kind of reception energy your guests will talk about for years.",
  regionDescription:
    "Spartanburg and the surrounding Upstate South Carolina region offer a remarkable mix of wedding settings — from grand historic mansions and renovated industrial halls in the Cultural District to scenic lakeside retreats, countryside barns, and estate gardens nestled in the rolling Piedmont foothills. The area blends genuine Southern hospitality with a lively modern culture, and I've built a real familiarity with the venues, vendors, and rhythms that make Spartanburg weddings so memorable.",
  venues: [
    {
      name: "Duncan Estate",
      location: "Spartanburg",
      description:
        "A beautifully restored historic estate one mile from downtown Spartanburg, featuring a three-tiered formal garden, wrought iron gazebo, and a 1,800 sq ft brick patio with a party tent — accommodating up to 250 guests.",
    },
    {
      name: "Clevedale Historic Inn and Gardens",
      location: "Spartanburg",
      description:
        "Built in 1913, this four-acre estate offers seven unique indoor and outdoor settings — including Conrad's English Knot Garden, a Roman Bath, and a jasmine-covered arbor — as the only historic inn in the area with overnight accommodations for up to 100 guests.",
    },
    {
      name: "The Dogwood Manor",
      location: "Downtown Spartanburg",
      description:
        "A French Quarter-inspired event space dating to 1898 in the heart of Spartanburg's Cultural District, featuring a grand staircase, cathedral ceilings with original Prohibition Era brick and wooden beams, and a capacity of up to 300 guests.",
    },
    {
      name: "Indigo Hall",
      location: "Downtown Spartanburg",
      description:
        "A beautifully restored historic building on Ezell Street in downtown Spartanburg, housing two separate event halls, a state-of-the-art caterer's kitchen, and a newly designed veranda and garden space — each side seating up to 250 guests.",
    },
    {
      name: "1881 Event Hall",
      location: "Spartanburg",
      description:
        "A luxurious event complex on Spartan Boulevard with over 19,000 square feet of flexible space, including the 4,500 sq ft Organza Ballroom and 3,200 sq ft Oxford Ballroom, with in-house beverage and catering services.",
    },
    {
      name: "Lions Gate Manor",
      location: "Spartanburg",
      description:
        "An eight-acre estate 20 minutes south of downtown Spartanburg featuring a 65-foot waterfall, covered pavilion, poolside gazebo, and multiple handcrafted ceremony and reception spaces with breathtaking views.",
    },
    {
      name: "The Barn at Poplar Springs Farm",
      location: "Moore, SC",
      description:
        "Located just outside Spartanburg in Moore, SC, this climate-controlled all-season venue offers a refined barn hall, cocktail pavilion, and outdoor courtyard ceremony space — with all-inclusive wedding packages for up to 200 guests.",
    },
    {
      name: "Lakeside Venue at Pioneer",
      location: "Spartanburg",
      description:
        "A family-owned five-acre lakeside retreat in Spartanburg featuring an indoor chapel, lakeside gazebo, outdoor wooden arch, main dining hall, and bridal and groom suites — a peaceful, stress-free setting for up to 120 guests.",
    },
    {
      name: "Spartanburg Marriott",
      location: "Downtown Spartanburg",
      description:
        "An elegant full-service hotel at 299 N Church St in the heart of downtown Spartanburg, offering over 25,000 square feet of indoor and outdoor event space with experienced on-site event planners and flexible food and beverage options.",
    },
    {
      name: "The Music Camp",
      location: "Spartanburg",
      description:
        "A charming countryside destination tucked into the pastoral outskirts of Spartanburg, featuring a 4,800 square foot covered pavilion, on-site lodging, day-of coordination, and the capacity to host celebrations of up to 2,000 guests.",
    },
    {
      name: "Carolina Country Club",
      location: "Spartanburg",
      description:
        "A storied private club with 30,000 square feet of indoor event space, multiple ballrooms, and an intimate terrace room overlooking the golf course — a classic and polished backdrop for elegant Spartanburg receptions.",
    },
  ],
  nearbyAreas: [
    "Greenville",
    "Gaffney",
    "Greer",
    "Duncan",
    "Moore",
    "Inman",
    "Boiling Springs",
    "Chesnee",
    "Landrum",
    "Cowpens",
    "Woodruff",
    "Union",
    "Cherokee Falls",
    "Lyman",
    "Campobello",
  ],
  faq: [
    {
      question: "Do you travel to Spartanburg, SC from Asheville?",
      answer:
        "Absolutely. Spartanburg is about 70 miles from my base in Asheville, NC — a straightforward drive through the Upstate foothills. Travel to Spartanburg and the surrounding area is included in all of my packages, so there are no surprise fees or surcharges.",
    },
    {
      question: "How far in advance should I book for a Spartanburg wedding?",
      answer:
        "Spartanburg's wedding season is busy, and popular venues like Duncan Estate and The Dogwood Manor fill up quickly. Peak weekends — especially May through October — tend to book 12 to 18 months out. I'd recommend reaching out as soon as you have your date, even if other details are still coming together.",
    },
    {
      question: "Have you worked at Spartanburg-area venues before?",
      answer:
        "Yes, I've performed at venues across the Upstate SC region, including the Spartanburg area. For every wedding — even at venues I'm visiting for the first time — I do a detailed site walkthrough in advance to map out acoustics, power access, and floor layout, so nothing is left to chance on your day.",
    },
    {
      question: "What makes you different from other Spartanburg wedding DJs?",
      answer:
        "I don't just play music — I host your wedding. My background as a tamada (the Eastern European tradition of a dedicated professional wedding host) means I'm trained to be the emotional anchor of your celebration. I connect families, guide transitions, create real moments, and make every guest feel like they belong — from the first dance to the last song.",
    },
    {
      question: "Do you cover both the ceremony and reception?",
      answer:
        "Yes — from the processional through the last dance, it's one person and one seamless vision. I coordinate with your venue and vendors so every cue, every transition, and every announcement lands exactly when it should. You won't need to manage a single detail on your wedding day.",
    },
  ],
};

export default function SpartanburgPage() {
  return <LocationPage data={data} />;
}
