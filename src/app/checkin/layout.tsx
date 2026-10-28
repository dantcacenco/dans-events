import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./checkin.css";

// Same brand face as the site, plus Cyrillic for the Russian toggle.
const brand = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800", "900"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Youth Camp check-in",
  description: "Private check-in for the Youth Camp.",
  // Private: never indexed or followed (the X-Robots-Tag header in next.config.ts says the same).
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: {},
  manifest: "/checkin/manifest.webmanifest",
  icons: { apple: "/checkin/apple-touch-icon.png", icon: "/checkin/icon-192.png" },
  appleWebApp: { capable: true, title: "Check-in", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  other: { "mobile-web-app-capable": "yes" },
};

// No pinch zoom or bounce: this is a kiosk. viewportFit "cover" uses the full iPad screen.
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, viewportFit: "cover", themeColor: "#1c3a2b" };

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <div className={`ck ${brand.className}`}>{children}</div>;
}
