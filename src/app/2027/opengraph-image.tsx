import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "The 2027 Full Experience — hosting, DJ and lighting from Dan's Events for $3,500";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const bg = await readFile(join(process.cwd(), "src/app/2027/_assets/og-bg.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#3B3536" }}>
        <img src={bgSrc} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, background: "linear-gradient(90deg, rgba(20,16,17,0.92) 0%, rgba(20,16,17,0.75) 55%, rgba(20,16,17,0.35) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 10, height: 630, background: "#BC3021" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 80, width: "100%", height: "100%" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "6px", textTransform: "uppercase", marginBottom: 24 }}>
            {"DAN'S EVENTS — FIRST 10 COUPLES OF 2027"}
          </span>
          <span style={{ fontSize: 96, fontWeight: 900, color: "white", lineHeight: 0.9, letterSpacing: "-3px", textTransform: "uppercase" }}>
            The 2027 Full
          </span>
          <span style={{ fontSize: 96, fontWeight: 900, color: "#BC3021", lineHeight: 0.9, letterSpacing: "-3px", textTransform: "uppercase", marginBottom: 32 }}>
            Experience
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: "white" }}>$3,500</span>
            <span style={{ fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.75)", letterSpacing: "2px" }}>
              Hosting · DJ &amp; ceremony sound · Lights &amp; fog
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
