import { ImageResponse } from "next/og";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";
import { pitch } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Geoffrey Migliacci · Ingénieur logiciel senior";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgCard
      eyebrow="Ingénieur logiciel senior"
      title="Geoffrey Migliacci"
      description={pitch}
      meta={ogHost()}
    />,
    { ...OG_SIZE, fonts },
  );
}
