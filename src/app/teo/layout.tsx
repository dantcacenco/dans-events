import type { Metadata } from "next";
import { Anton, Archivo, Space_Mono } from "next/font/google";
import "./teo.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-teo-display" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-teo-body" });
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teo-mono",
});

export const metadata: Metadata = {
  title: "T.E.O. — The Drop",
  description: "Scan. Listen. Stay close.",
  // The card is meant to be found by scanning, not by searching.
  robots: { index: false, follow: false },
};

export default function TeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`teo ${anton.variable} ${archivo.variable} ${mono.variable}`}
      style={{ fontFamily: "var(--font-teo-body)" }}
    >
      {children}
    </div>
  );
}
