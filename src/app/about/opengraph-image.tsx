import { ImageResponse } from "next/og";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "À propos · Geoffrey Migliacci";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgCard
      eyebrow="Geoffrey Migliacci"
      title="À propos"
      description="Ingénieur logiciel senior, +7 ans d'expérience en .NET."
      meta={ogHost("/about")}
    />,
    { ...OG_SIZE, fonts },
  );
}
