import { ImageResponse } from "next/og";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Mentions légales · Geoffrey Migliacci";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgCard
      eyebrow="Geoffrey Migliacci"
      title="Mentions légales"
      meta={ogHost("/legal")}
    />,
    { ...OG_SIZE, fonts },
  );
}
