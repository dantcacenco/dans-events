import type { Metadata } from "next";
import PhoneGrid from "@/components/pixel-mob/phone-grid-test";

export const metadata: Metadata = {
  title: "Crowd Pixel — Device Test Grid",
  description: "Simulates 50 real phones for camera registration testing",
};

export default function PixelMobTestPage() {
  return <PhoneGrid />;
}
