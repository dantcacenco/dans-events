import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#3B3536",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left red accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "10px",
            height: "100%",
            background: "#BC3021",
          }}
        />
        {/* Top-right review badge */}
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "4px",
          }}
        >
          40+ FIVE-STAR GOOGLE REVIEWS
        </div>
        {/* Main title — two separate spans instead of <br /> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 112,
              fontWeight: 900,
              color: "white",
              lineHeight: 0.88,
              letterSpacing: "-4px",
              textTransform: "uppercase",
            }}
          >
            {"DAN'S"}
          </span>
          <span
            style={{
              fontSize: 112,
              fontWeight: 900,
              color: "white",
              lineHeight: 0.88,
              letterSpacing: "-4px",
              textTransform: "uppercase",
            }}
          >
            EVENTS
          </span>
        </div>
        {/* Subtitle row with red dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#BC3021",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "8px",
              textTransform: "uppercase",
            }}
          >
            WEDDING DJ &amp; MC — ASHEVILLE, NC
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
