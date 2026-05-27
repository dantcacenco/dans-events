import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Crowd Pixel",
  description: "Join the light show",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crowd Pixel",
  },
  manifest: "/pixel-mob-manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function PixelMobUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
