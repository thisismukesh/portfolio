import { ImageResponse } from "next/og";
import { getPortfolioContent } from "@/sanity/queries";

// Link preview thumbnail shown in iMessage, Slack, Discord, Twitter, etc.
// 1200x630 is the OG spec default — most platforms downscale from this.
export const alt = "Hey, I'm Mukesh!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const { settings } = await getPortfolioContent();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1b2025 0%, #0c0f12 70%)",
          color: "#eeede9",
          padding: "80px 96px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 128, lineHeight: 1 }}>👋</div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          Hey, I&apos;m Mukesh!
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 36,
            fontWeight: 500,
            color: "#e4aa71",
            letterSpacing: "0.005em",
          }}
        >
          {settings.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 28,
            color: "#7c7a75",
            fontFamily: "monospace",
          }}
        >
          <span>{settings.name}</span>
          <span>mukesh.cc</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
