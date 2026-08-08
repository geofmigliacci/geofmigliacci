import { ImageResponse } from "next/og";
import type { BlogPostModule } from "@/lib/blog";
import { listSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  // The image-serving pass calls this with empty params; only the metadata pass has the slug.
  const { slug } = await params;
  if (!slug) {
    return [{ id: "og", size: OG_SIZE, contentType: "image/png" }];
  }

  const { metadata }: BlogPostModule = await import(
    `@/content/blog/${slug}.mdx`
  );

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ metadata }, fonts]: [
    BlogPostModule,
    Awaited<ReturnType<typeof loadOgFonts>>,
  ] = await Promise.all([import(`@/content/blog/${slug}.mdx`), loadOgFonts()]);

  return new ImageResponse(
    <OgCard
      eyebrow="Geoffrey Migliacci"
      title={metadata.title}
      scale="headline"
      meta={`${formatDate(metadata.date)} · ${ogHost()}`}
    />,
    { ...OG_SIZE, fonts },
  );
}
