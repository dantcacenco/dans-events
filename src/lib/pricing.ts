// One place for the prices shown on /pricing, /2027 and in the site's structured data.

export type ServicePrice = {
  name: string;
  price: number;
  from?: boolean;
  href: string;
  linkLabel: string;
  desc: string;
  note?: string;
};

export const SERVICE_PRICES: ServicePrice[] = [
  {
    name: "Hosting & MC",
    price: 2000,
    href: "/mc",
    linkLabel: "More about hosting",
    desc: "Your host for the whole night, in English and Russian. I run the introductions, toasts, games and the flow of the evening, from the grand entrance to the send-off.",
  },
  {
    name: "DJ & Ceremony Sound",
    price: 1500,
    href: "/dj",
    linkLabel: "More about the DJ",
    desc: "Sound for your ceremony, then the DJ for your reception and dance party. A set built around your crowd and mixed live.",
  },
  {
    name: "Lighting",
    price: 1500,
    from: true,
    href: "/lighting",
    linkLabel: "More about lighting",
    desc: "Lighting starts with the stage and dance floor. Every room is different, so we plan it together for your venue.",
    note: "A full lighting package is closer to $3,000.",
  },
];

export const BUNDLE = {
  name: "The 2027 Full Experience",
  price: 3900,
  // What the same scope costs booked one by one: hosting + DJ & ceremony sound + lighting package.
  separately: 2000 + 1500 + 1500,
  spots: 10,
  path: "/2027",
};

export function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
