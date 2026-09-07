import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/shared/config/brand";
import { getSiteSettings } from "@/features/settings/settings-api";
import { brandColors } from "@/shared/lib/theme";

/**
 * Social share image for the home page, generated at request time so no design asset is needed.
 * Next serves this as /opengraph-image and wires the og:image/twitter:image tags automatically.
 */
// `alt` has to be a static export, so it is the only thing here still reading the
// fallback config rather than the admin's settings.
export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const settings = await getSiteSettings();
  const colors = brandColors(settings.theme.primary, settings.theme.secondary);

  // The renderer's built-in font has no Persian glyphs. Vazir ships as TTF in public/fonts
  // (the Docker image copies public/), which is the format the image renderer accepts — not woff2.
  const vazirBold = await readFile(
    join(process.cwd(), "public", "fonts", "Vazir-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 80,
          textAlign: "center",
          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.deep} 60%, ${colors.ink} 100%)`,
          color: "#ffffff",
          fontFamily: "Vazir",
        }}
        dir="rtl"
      >
        <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: -2 }}>
          {settings.brand.name}
        </div>
        <div style={{ fontSize: 44, opacity: 0.92 }}>
          {settings.brand.tagline}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 32,
            color: colors.primary,
            letterSpacing: 2,
          }}
        >
          {brand.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Vazir",
          data: vazirBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
