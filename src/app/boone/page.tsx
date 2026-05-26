import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Boone & the NC High Country — Dan's Events",
  description:
    "Boone's premier wedding DJ and MC. Serving Blowing Rock, Banner Elk, Valle Crucis, and all of NC's High Country. Unforgettable mountain weddings ~95 miles from Asheville.",
  keywords: [
    "wedding DJ Boone NC",
    "Blowing Rock wedding DJ",
    "Banner Elk wedding DJ",
    "High Country wedding DJ",
    "NC mountain wedding DJ",
    "Valle Crucis wedding DJ",
    "Blue Ridge Parkway wedding DJ",
    "Grandfather Mountain wedding",
    "Boone NC wedding MC",
  ],
};

const data: LocationData = {
  city: "Boone",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "boone",
  heroTagline:
    "Where the Blue Ridge Parkway meets the High Country — crafting unforgettable weddings above 3,000 feet.",
  introParagraph:
    "The NC High Country is one of the most breathtaking wedding destinations on the East Coast, and I make the drive from Asheville — about 95 miles — for every couple who chooses it. Boone, Blowing Rock, Banner Elk, and Valle Crucis sit in a world of their own: mile-high meadows, fog-laced ridgelines, and venues that feel like they were built specifically to make your guests gasp. I bring the same craft I've honed across Western North Carolina to every High Country wedding — reading your crowd, connecting your families, and building the kind of energy that turns a mountain reception into the night no one forgets.",
  regionDescription:
    "The High Country spans Watauga and Avery Counties and sits along the iconic Blue Ridge Parkway, just below Grandfather Mountain — the highest peak on the Blue Ridge. Boone is home to Appalachian State University and a thriving arts and food scene, while Blowing Rock offers refined resort elegance and Banner Elk draws couples for its ski-resort backdrop and sweeping ridgeline views. Valle Crucis, tucked into a peaceful valley where three streams meet, is home to the original Mast General Store and some of the most intimate farm venues in the state.",
  venues: [
    {
      name: "Overlook Barn",
      location: "Beech Mountain / Banner Elk",
      description:
        "A chic, beautifully renovated barn perched atop Beech Mountain with breathtaking long-range views of the Blue Ridge Mountains. Accommodates up to 250 guests with an elegant rustic aesthetic — the owners renovated it for their own wedding in 2015.",
    },
    {
      name: "The White Crow Wedding and Event Venue",
      location: "Banner Elk",
      description:
        "37 acres of pristine mountain land with sweeping views in every direction. This 6,400 sq ft venue opened in 2020 and offers modern mountain elegance, multiple ceremony sites, and all-inclusive packages.",
    },
    {
      name: "Twisted Oak Estate",
      location: "Banner Elk",
      description:
        "Downtown Banner Elk's premier wedding venue, set within walking distance of lodging, dining, and shopping. A refined estate setting with mountain backdrops ideal for couples wanting convenience and beauty in one.",
    },
    {
      name: "The Mast Farm Inn",
      location: "Valle Crucis",
      description:
        "An award-winning historic boutique hotel and country inn set on over 20 pristine acres in Valle Crucis. One of the most romantic and authentic High Country venues — rich in Appalachian history and natural charm.",
    },
    {
      name: "Twickenham House",
      location: "Jefferson, NC",
      description:
        "A European-inspired private sanctuary on 400 acres in the heart of the Blue Ridge Mountains. One of the most stunning destination wedding venues in the Carolina High Country — intimate, exclusive, and jaw-dropping.",
    },
    {
      name: "Chetola Resort",
      location: "Blowing Rock",
      description:
        "75 acres of curated mountain resort grounds in the heart of Blowing Rock, featuring lakeside ceremonies, refined in-house catering, and full resort access for a complete wedding weekend experience.",
    },
    {
      name: "Meadowbrook Inn",
      location: "Blowing Rock",
      description:
        "Located in the heart of Blowing Rock, Meadowbrook Inn offers 10,000 square feet of upscale banquet rooms and a stunning outdoor stone terrace with mountain views framed by the surrounding Blue Ridge.",
    },
    {
      name: "The Inn at Ragged Gardens",
      location: "Blowing Rock",
      description:
        "A charming boutique inn right in downtown Blowing Rock with lush gardens and a private dining space perfect for intimate receptions and rehearsal dinners. Beloved for its storybook setting.",
    },
    {
      name: "Wildwind Boone",
      location: "Boone",
      description:
        "An inviting mountain wedding venue set in the heart of the Blue Ridge Mountains in Boone, blending modern comfort with rustic elegance. Surrounded by mature trees and open skies above the High Country.",
    },
    {
      name: "Barn at Fraser Hill",
      location: "Boone",
      description:
        "A quaint fifth-generation family farm just four miles from downtown Boone. This beautifully restored barn venue offers authentic Appalachian character, rolling pastures, and an intimate family-owned atmosphere.",
    },
    {
      name: "The Mill at Rock Creek",
      location: "Boone",
      description:
        "A charming countryside wedding and event venue located just 5 miles from downtown Boone. Nestled along Rock Creek with a warm, pastoral setting that pairs beautifully with the surrounding High Country scenery.",
    },
    {
      name: "Templeton Meadows",
      location: "Boone",
      description:
        "Thirty-four stunning acres surrounded by the Appalachian Mountains near Boone. Open meadows, mountain backdrops, and a serene natural setting make this a favorite for couples seeking wide-open High Country beauty.",
    },
    {
      name: "The Horton Hotel",
      location: "Downtown Boone",
      description:
        "Boone's premier boutique hotel offers a sophisticated rooftop lounge with panoramic views of the town and surrounding mountains. A sleek urban option for couples who want city energy with a High Country backdrop.",
    },
    {
      name: "Appalachian View",
      location: "Sugar Mountain / Newland",
      description:
        "Perched at the top of Sugar Mountain, this secluded venue offers a fabulous high-elevation property for a wedding weekend experience. With on-site cabins and room for up to 200 guests, it's built for full weekend celebrations.",
    },
    {
      name: "The Barn at Cornerstone",
      location: "Banner Elk",
      description:
        "A rustic-elegant venue on an 8-acre property in rural Banner Elk. Natural beauty, a variety of ceremony and reception spaces, and the distinctive character of Avery County's mountain landscape.",
    },
  ],
  nearbyAreas: [
    "Blowing Rock",
    "Banner Elk",
    "Valle Crucis",
    "Sugar Mountain",
    "Beech Mountain",
    "Jefferson",
    "West Jefferson",
    "Newland",
    "Linville",
    "Grandfather Mountain",
    "Elk Park",
    "Seven Devils",
    "Deep Gap",
    "Vilas",
    "Zionville",
  ],
  faq: [
    {
      question: "Do you travel to Boone and the NC High Country from Asheville?",
      answer:
        "Yes — the High Country is about 95 miles from my base in Asheville, and it's a trip I make gladly. Travel fees apply for distances beyond 60 miles, but they're straightforward and included in your quote. Many couples book me specifically because they want a DJ who treats their High Country wedding with the same focus and craft as any Asheville event.",
    },
    {
      question: "How far in advance should I book for a High Country wedding?",
      answer:
        "The High Country peaks in May–October, with fall foliage weekends (mid-October) booking out 14–18 months in advance. Summer Saturdays at popular venues like Overlook Barn, The White Crow, and Chetola fill up fast. Reach out as soon as you have a date in mind — don't wait until you've signed the venue contract.",
    },
    {
      question: "Have you worked at High Country venues before?",
      answer:
        "I've performed across the region and do thorough advance work for every new venue — visiting the space, checking acoustics, and coordinating with your venue coordinator before the big day. Whether you're at a hilltop barn with mountain echoes or an indoor resort ballroom, the audio and energy are dialed in.",
    },
    {
      question: "What is a tamada, and how does it make my wedding different?",
      answer:
        "A tamada is the traditional Slavic wedding host — the person responsible for guiding the celebration, uniting families, toasting the couple, and making sure the emotional arc of the night builds toward something unforgettable. It's not just playing music. I'm the emotional anchor of your reception: creating moments, bridging families who may not know each other, and turning a schedule of events into a real celebration. Most DJs hand you a playlist; I give you a night.",
    },
    {
      question: "Do you handle ceremony music and cocktail hour for mountain venues?",
      answer:
        "Absolutely. Ceremony, cocktail hour, dinner, and the full reception — one person running everything from the processional to the last dance. No vendor handoffs, no miscommunication between a separate ceremony musician and the DJ. One vision, executed start to finish.",
    },
  ],
};

export default function BoonePage() {
  return <LocationPage data={data} />;
}
