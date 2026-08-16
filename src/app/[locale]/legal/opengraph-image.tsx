import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";

// Without this the route falls out of the static table: it sits under [locale]
// and has no params of its own to enumerate.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
