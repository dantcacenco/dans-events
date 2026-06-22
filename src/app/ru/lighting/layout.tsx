import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Свадебное освещение — Dan's Events | Эшвилл NC",
  description:
    "Атмосферное свадебное освещение в Эшвилле и Западной Северной Каролине. Тёплый белый свет, концертное оборудование стоимостью $20K+.",
  alternates: { canonical: "https://dans-events.com/ru/lighting" },
};

export default function RuLightingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
