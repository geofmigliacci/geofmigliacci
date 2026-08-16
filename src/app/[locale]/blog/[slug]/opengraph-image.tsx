import { ImageResponse } from "next/og";
import { LOCALES, type Locale } from "@/i18n/locales";
import { getPost, listSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await listSlugs(locale);
      return slugs.map((slug) => ({ locale, slug }));
    }),
  );
  return perLocale.flat();
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug?: string }>;
}) {
  // The image-serving pass calls this with empty params; only the metadata pass has the slug.
  const { locale, slug } = await params;
  if (!slug) {
    return [{ id: "og", size: OG_SIZE, contentType: "image/png" }];
  }

  const { metadata } = await getPost(locale, slug);

  return [
    {
      id: "og",
      alt: `${metadata.title} · Geoffrey Migliacci`,
      size: OG_SIZE,
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [{ metadata }, fonts] = await Promise.all([
    getPost(locale, slug),
    loadOgFonts(),
  ]);

  return new ImageResponse(
    <OgCard
      eyebrow="Geoffrey Migliacci"
      title={metadata.title}
      scale="headline"
      meta={`${formatDate(metadata.date, locale)} · ${ogHost()}`}
    />,
    { ...OG_SIZE, fonts },
  );
}
