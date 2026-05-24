import { ImageResponse } from "next/og";

export const alt = "Subroute Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0d0e12",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(251,126,60,0.18), transparent 45%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              backgroundColor: "#fb7e3c",
            }}
          />
          <div
            style={{
              color: "#f3f1ec",
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Subroute
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#f3f1ec",
            fontSize: "84px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          The Blog
        </div>

        <div
          style={{
            display: "flex",
            color: "#8f939c",
            fontSize: "26px",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "#fb7e3c" }}>subroute.dev/blog</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
