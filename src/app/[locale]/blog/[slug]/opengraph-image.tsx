import { ImageResponse } from "next/og";
import { LOCALES, type Locale } from "@/i18n/locales";
import { getBlogPosts, getPost, resolveContentLocale } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";
import { siteName } from "@/lib/site";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    // The union, matching the page: a fallback post has an OG card too.
    LOCALES.map(async (locale) => {
      const posts = await getBlogPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
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

  const contentLocale = (await resolveContentLocale(locale, slug)) ?? locale;
  const { metadata } = await getPost(contentLocale, slug);

  return [
    {
      id: "og",
      alt: `${metadata.title} · ${siteName}`,
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
  const contentLocale = (await resolveContentLocale(locale, slug)) ?? locale;
  const [{ metadata }, fonts] = await Promise.all([
    getPost(contentLocale, slug),
    loadOgFonts(),
  ]);

  return new ImageResponse(
    <OgCard
      eyebrow={siteName}
      title={metadata.title}
      scale="headline"
      meta={`${formatDate(metadata.date, locale)} · ${ogHost()}`}
    />,
    { ...OG_SIZE, fonts },
  );
}
