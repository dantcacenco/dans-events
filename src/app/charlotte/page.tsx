import type { Metadata } from "next";
import LocationPage, { type LocationData } from "@/components/location-page";

export const metadata: Metadata = {
  title: "Wedding DJ & MC in Charlotte, NC — Dan's Events",
  description:
    "Charlotte's premier wedding DJ and MC from Asheville. Serving the Duke Mansion, The Ballantyne Hotel, Pleasant Grove Farm, The Fillmore, and venues across the Queen City.",
  keywords: [
    "wedding DJ Charlotte NC",
    "Charlotte wedding MC",
    "Charlotte wedding entertainment",
    "Queen City wedding DJ",
    "Charlotte NC wedding DJ",
    "wedding DJ near Charlotte",
  ],
  alternates: {
    canonical: "https://dans-events.com/charlotte",
  },
  openGraph: {
    title: "Wedding DJ & MC in Charlotte, NC — Dan's Events",
    description:
      "Charlotte's premier wedding DJ and MC from Asheville. Serving the Duke Mansion, The Ballantyne Hotel, Pleasant Grove Farm, The Fillmore, and venues across the Queen City.",
    url: "https://dans-events.com/charlotte",
    siteName: "Dan's Events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dan's Events — Wedding DJ & MC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding DJ & MC in Charlotte, NC — Dan's Events",
    description:
      "Charlotte's premier wedding DJ and MC from Asheville. Serving the Duke Mansion, The Ballantyne Hotel, Pleasant Grove Farm, The Fillmore, and venues across the Queen City.",
    images: ["/opengraph-image"],
  },
};

const data: LocationData = {
  city: "Charlotte",
  state: "North Carolina",
  stateAbbr: "NC",
  slug: "charlotte",
  heroTagline:
    "From grand ballrooms in Uptown to rolling farm estates on the edge of the Queen City — bringing unforgettable wedding energy to Charlotte and the greater metro.",
  introParagraph:
    "Charlotte is one of the fastest-growing wedding markets in the Southeast, and it deserves a DJ and MC who can match its energy — whether you are celebrating in a sleek hotel ballroom with city skyline views or on a 180-acre farm just minutes from Uptown. I travel from my Asheville base roughly 130 miles to serve Charlotte-area couples, with travel included in all packages. I make the drive because Charlotte's wedding scene is exceptional, and I love being part of it.",
  regionDescription:
    "The greater Charlotte metro blends Southern tradition with a modern, cosmopolitan energy, giving couples a remarkable range of settings — from Victorian estates in Myers Park and lakeside properties along Lake Norman to industrial-chic lofts in NoDa and luxury ballrooms in the heart of Uptown. It is a region that takes weddings seriously, and the venues reflect that ambition.",
  venues: [
    { name: "The Duke Mansion", location: "Myers Park", description: "A stately 1915 estate on 4.5 acres of manicured gardens in Charlotte's most prestigious historic neighborhood, offering exclusive private use for intimate celebrations." },
    { name: "The Ballantyne Hotel", location: "Ballantyne", description: "Iconic luxury hotel featuring a grand ballroom, sweeping rose garden ceremony lawn, and impeccable service for up to 400 guests." },
    { name: "The Ritz-Carlton Charlotte", location: "Uptown Charlotte", description: "Flagship luxury hotel with a 6,844 sq ft ballroom boasting 18-foot ceilings and glittering chandeliers, plus an urban garden perfect for cocktail hours." },
    { name: "Kimpton Tryon Park Hotel", location: "Uptown Charlotte", description: "Boutique hotel with 13,000 sq ft of event space including a 19th-floor rooftop lawn with city views and a 4,000 sq ft ballroom for up to 200 guests." },
    { name: "The 1932 Barn", location: "Charlotte", description: "A rustic and elegant historic barn set on a stunning 180-acre working farm just minutes from Uptown Charlotte, offering sweeping pasture views." },
    { name: "Pleasant Grove Farm", location: "Northwest Charlotte", description: "A 20-acre family property featuring a 4,500 sq ft post-and-beam barn with crystal chandeliers and a colonial-style estate home for bridal party preparation." },
    { name: "Alexander Homestead", location: "Charlotte", description: "A beautifully preserved 1903 Queen Anne Victorian estate surrounded by five acres of botanical gardens, accommodating up to 215 guests." },
    { name: "Historic Rosedale", location: "Charlotte", description: "A 200-year-old Federal-style house near Uptown with magnificent grounds, gardens, and a uniquely atmospheric stone-walled English Basement." },
    { name: "McGill Rose Garden", location: "NoDa Arts District", description: "A professionally landscaped 2-acre garden on the edge of Charlotte's vibrant arts district, offering exclusive use with a manicured lawn and covered reception space." },
    { name: "The Fillmore Charlotte", location: "Uptown Charlotte", description: "A 19,400 sq ft landmark event space inside a historic textile mill with red oak hardwood floors, magnificent chandeliers, and state-of-the-art sound and lighting." },
    { name: "Charlotte City Club", location: "Uptown Charlotte", description: "An exclusive private club 31 floors above the city featuring two ballrooms, crystal chandeliers, a grand spiral staircase, and unmatched panoramic skyline views." },
    { name: "Carolina Country Weddings", location: "North Charlotte", description: "A 427-acre private property 30 minutes north of Charlotte featuring wildflowers, native grasses, and towering trees across multiple indoor and outdoor event sites." },
    { name: "The NoDa Wedding Chapel", location: "NoDa Arts District", description: "A historic chapel steeped in charm and set in the heart of Charlotte's eclectic Mill District, ideal for couples who want an intimate ceremony with artistic flair." },
    { name: "Renaissance Charlotte SouthPark Hotel", location: "SouthPark", description: "A polished full-service hotel in Charlotte's upscale SouthPark district, offering refined ballrooms and comprehensive catering in a sophisticated setting." },
  ],
  nearbyAreas: [
    "Concord", "Huntersville", "Mooresville", "Gastonia", "Waxhaw",
    "Matthews", "Mint Hill", "Kannapolis", "Belmont", "Pineville",
    "Rock Hill", "Indian Trail", "Cornelius", "Davidson", "Monroe",
  ],
  faq: [
    {
      question: "Do you travel from Asheville to Charlotte for weddings?",
      answer: "Yes — Charlotte is one of my most-traveled destinations. It is about 130 miles from my Asheville base, and travel is included in all packages. I arrive the day before or early the day of to ensure everything is set up perfectly. The Queen City's wedding scene is exceptional, and I am proud to serve couples here.",
    },
    {
      question: "How far in advance should I book for a Charlotte wedding?",
      answer: "Charlotte is a competitive wedding market. Prime Saturday dates at popular venues like The Ballantyne, The Duke Mansion, and The 1932 Barn often book 12–18 months out. As soon as you have your date and venue confirmed, reach out — I typically hold only one wedding per day.",
    },
    {
      question: "Have you worked at Charlotte venues before?",
      answer: "I have performed at venues across the Charlotte metro and make it a point to do a thorough site review before every wedding. Every venue has its own acoustic character, layout, and logistics — knowing those details in advance is part of how I deliver a seamless experience.",
    },
    {
      question: "What sets you apart from other Charlotte wedding DJs and MCs?",
      answer: "I do not just play music — I host your wedding. My background as a tamada (the Eastern European tradition of wedding hosting) means I am trained to be the emotional anchor of the entire celebration. I connect families, guide moments, and create the kind of energy where every guest feels part of something special. That dual DJ-plus-MC role is rare, and it makes a real difference.",
    },
    {
      question: "Can you handle the ceremony, cocktail hour, and reception?",
      answer: "Absolutely. I cover every moment from the processional to the last dance — one consistent person managing the music, the microphone, and the flow of your day. No hand-offs, no confusion about who is in charge. Charlotte couples especially appreciate having everything seamlessly coordinated, whether the ceremony is outside in a rose garden or inside a grand ballroom.",
    },
  ],
};

export default function CharlottePage() {
  return <LocationPage data={data} />;
}
