import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";
import { siteName } from "@/lib/site";

// Without this the route falls out of the static table: it sits under [locale]
// and has no params of its own to enumerate.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export const size = OG_SIZE;
export const contentType = "image/png";

// `alt` cannot be a static export here: it is copy, and copy is per locale.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale?: Locale }>;
}) {
  // The image-serving pass calls this with empty params; only the metadata pass
  // names the locale, and without one there is no request to read it from.
  const { locale } = await params;
  if (!locale) return [{ id: "og", size: OG_SIZE, contentType }];

  const t = await getTranslations({ locale, namespace: "meta.privacyPolicy" });

  return [{ id: "og", alt: t("ogAlt"), size: OG_SIZE, contentType }];
}

export default async function Image({ params }: LocaleParams) {
  const { locale } = await params;
  const [t, fonts] = await Promise.all([
    getTranslations({ locale }),
    loadOgFonts(),
  ]);

  return new ImageResponse(
    <OgCard
      eyebrow={siteName}
      title={t("meta.privacyPolicy.title")}
      meta={ogHost("/privacy-policy")}
    />,
    { ...OG_SIZE, fonts },
  );
}
