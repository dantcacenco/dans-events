import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dan's Events — Wedding DJ & MC | Asheville, NC",
  description:
    "Asheville's premier wedding DJ and MC. 40+ five-star reviews. Hosting your always & forever — from ceremony to last dance.",
  keywords: [
    "wedding DJ Asheville",
    "wedding MC Asheville NC",
    "Asheville wedding entertainment",
    "wedding DJ near me",
    "Dan's Events",
  ],
  openGraph: {
    title: "Dan's Events — Wedding DJ & MC | Asheville, NC",
    description:
      "Asheville's premier wedding DJ and MC. 40+ five-star reviews. Hosting your always & forever.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
