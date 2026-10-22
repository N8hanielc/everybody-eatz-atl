import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Placeholder social-sharing image, generated at build time.
 * To use official event artwork instead: delete this file and add
 * app/opengraph-image.png (1200×630) — Next.js picks it up automatically.
 */
export const alt = "Everybody Eatz ATL — Thanksgiving Food Drive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LEAF =
  "M32 3c1.6 4.4 3.4 7.6 5.6 9.3l3.8-2.7.6 6.4c2.8 1 5.8.7 9.2-.8l-1.7 6.8c2.6 1.4 5.4 1.9 8.5 1.6-2.4 4.4-5.6 7.4-9.6 9l3.4 4c-4.4 1.2-8.6 1.1-12.6-.5l.2 5.5c-2.2-.8-4.2-2.1-5.9-3.8V61h-3V44.8c-1.7 1.7-3.7 3-5.9 3.8l.2-5.5c-4 1.6-8.2 1.7-12.6.5l3.4-4c-4-1.6-7.2-4.6-9.6-9 3.1.3 5.9-.2 8.5-1.6l-1.7-6.8c3.4 1.5 6.4 1.8 9.2.8l.6-6.4 3.8 2.7C28.6 10.6 30.4 7.4 32 3Z";

export default function OpengraphImage() {
  const { event } = siteConfig;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F8F3EA",
          color: "#2C1A12",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <svg width="220" height="220" viewBox="0 0 64 64" style={{ position: "absolute", right: 80, top: 70, opacity: 0.9 }}>
          <path d={LEAF} fill="#C86B32" />
        </svg>
        <div style={{ fontSize: 26, letterSpacing: 6, color: "#A4521F", fontFamily: "sans-serif", fontWeight: 700 }}>
          THANKSGIVING FOOD DRIVE
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>
          <span>Everybody</span>
          <span style={{ display: "flex" }}>
            Eatz&nbsp;<span style={{ color: "#C86B32" }}>ATL</span>
          </span>
        </div>
        <div style={{ fontSize: 34, marginTop: 36, color: "#3A2115", fontFamily: "sans-serif" }}>
          {`${event.dateLabel} · ${event.locationName}`}
        </div>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: 60, height: 6, background: "#E5D7C5", display: "flex" }} />
      </div>
    ),
    size,
  );
}
