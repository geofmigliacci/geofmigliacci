import { ImageResponse } from "next/og";
import { getPost, listSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { loadOgFonts, OG_SIZE, OgCard, ogHost } from "@/lib/og-image";

export async function generateStaticParams() {
  const slugs = await listSlugs("fr");
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

  const { metadata } = await getPost("fr", slug);

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
  const [{ metadata }, fonts] = await Promise.all([
    getPost("fr", slug),
    loadOgFonts(),
  ]);

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
