import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "./setlist.css";

const serif = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-sl-serif" });

export const metadata: Metadata = {
  title: "Your music — Dan's Events",
  description: "Private music picker for your wedding.",
  // Private per-couple link: never indexed, never followed.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: {},
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#161213" };

export default function SongsLayout({ children }: { children: React.ReactNode }) {
  return <div className={serif.variable}>{children}</div>;
}
