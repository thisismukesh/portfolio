import { ImageResponse } from "next/og";

// Browser-tab favicon. 32x32 PNG generated at build time.
// Uses the wave emoji on the site's charcoal background.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0c0f12",
          fontSize: 24,
          // small offset so the emoji visually centers
          paddingBottom: 2,
        }}
      >
        👋
      </div>
    ),
    { ...size },
  );
}
