import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "../../songs/setlist.css";
import "../songs/admin.css";
import "./thanks.css";

const brand = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800", "900"] });

// Dan only: client and vendor phone numbers. Not linked anywhere, never indexed, never cached, no referrer.
export const metadata: Metadata = {
  title: "Thank-you list",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0C0B0D" };

export default function ThanksLayout({ children }: { children: React.ReactNode }) {
  return <div className={brand.className}>{children}</div>;
}
