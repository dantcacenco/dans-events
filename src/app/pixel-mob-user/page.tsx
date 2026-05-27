import type { Metadata } from "next";
import GuestScreen from "@/components/pixel-mob/guest-screen";

export const metadata: Metadata = {
  title: "Crowd Pixel — Join the Light Show",
  description: "Your phone becomes part of a synchronized crowd light display",
};

export default function PixelMobUserPage() {
  return <GuestScreen />;
}
