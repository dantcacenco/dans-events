import type { Metadata } from "next";
import VenueSimulator from "@/components/pixel-mob/venue-simulator";

export const metadata: Metadata = {
  title: "Crowd Pixel — Admin",
  description: "Light show scene designer and live controller",
};

export default function PixelMobAdminPage() {
  return <VenueSimulator />;
}
