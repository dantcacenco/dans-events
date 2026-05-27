import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Crowd Pixel — Device Test Grid",
  description: "Simulates 50 real phones for camera registration testing",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function PixelMobTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
