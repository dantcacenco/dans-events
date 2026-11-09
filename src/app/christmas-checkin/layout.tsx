import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./christmas.css";

// Site brand face (Montserrat) for the interface; an elegant serif for the title. Both carry Cyrillic for RU and UK.
const brand = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--xm-sans" });
const display = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["600", "700", "800"], style: ["normal", "italic"], variable: "--xm-serif" });

export const metadata: Metadata = {
  title: "Christmas check-in",
  description: "Christmas registration.",
  // Private: never indexed or followed (the X-Robots-Tag header in next.config.ts says the same).
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: {},
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0d2b21" };

export default function ChristmasLayout({ children }: { children: React.ReactNode }) {
  return <div className={`xm ${brand.variable} ${display.variable}`}>{children}</div>;
}
