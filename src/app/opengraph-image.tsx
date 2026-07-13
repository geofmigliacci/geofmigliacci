import { ImageResponse } from "next/og";
import { loadOgFonts, OG_COLORS, OG_SIZE, OgFrame } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Geoffrey Migliacci — Ingénieur logiciel";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgFrame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: OG_COLORS.primary,
          }}
        >
          Ingénieur logiciel
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 1,
            letterSpacing: -2,
            color: OG_COLORS.foreground,
          }}
        >
          Geoffrey Migliacci
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 860,
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 30,
            lineHeight: 1.35,
            color: OG_COLORS.mutedForeground,
          }}
        >
          Je conçois des systèmes .NET capables d'absorber la charge sans
          broncher — de l'architecture backend jusqu'à l'interface.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            color: OG_COLORS.mutedForeground,
          }}
        >
          migliacci.fr
        </div>
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts },
  );
}
