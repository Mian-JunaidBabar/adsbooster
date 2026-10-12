import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { content } from "../lib/content";

// Stand-in link preview (logo plus headline, blue theme) until the client
// sends the final og:image design. Replace this file with a static
// opengraph-image.png of 1200 x 630 at that point.
export const alt = "AdsBoosters.pk: more leads and sales from ads that pay back";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0a1e36 0%, #0f2b4c 55%, #246c9c 100%)",
          color: "#ffffff",
        }}
      >
        <img src={logoSrc} width={450} height={96} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          {content.hero.headline}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 120,
              height: 6,
              borderRadius: 999,
              background: "#5bb8e0",
            }}
          />
          <div style={{ fontSize: 30, color: "#d3e8f7" }}>
            Google and Meta ads for businesses in Pakistan
          </div>
        </div>
      </div>
    ),
    size,
  );
}
