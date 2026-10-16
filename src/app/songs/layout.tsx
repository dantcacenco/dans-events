import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./setlist.css";

// Same brand face as the site, plus Cyrillic for the Russian toggle.
const brand = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Your music — Dan's Events",
  description: "Private music picker for your wedding.",
  // Private per-couple link: never indexed, never followed.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: {},
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0C0B0D" };

export default function SongsLayout({ children }: { children: React.ReactNode }) {
  return <div className={brand.className}>{children}</div>;
}
