import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "../../songs/setlist.css";
import "./admin.css";

const brand = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800", "900"] });

// Dan only: not linked anywhere, never indexed.
export const metadata: Metadata = {
  title: "Set lists — admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0C0B0D" };

export default function AdminSongsLayout({ children }: { children: React.ReactNode }) {
  return <div className={brand.className}>{children}</div>;
}
