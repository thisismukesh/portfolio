import { ImageResponse } from "next/og";

// iOS home-screen / Safari bookmark icon. 180x180 is Apple's recommended size.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 130,
          paddingBottom: 10,
        }}
      >
        👋
      </div>
    ),
    { ...size },
  );
}
