import { ImageResponse } from "next/og";
import type { ArticleModule } from "@/lib/articles";
import { listSlugs } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { loadOgFonts, OG_COLORS, OG_SIZE, OgFrame } from "@/lib/og-image";

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  // The image-serving pass calls this with empty params; only the
  // page-metadata pass (which emits og:image:alt) receives the slug.
  const { slug } = await params;
  if (!slug) {
    return [{ id: "og", size: OG_SIZE, contentType: "image/png" }];
  }

  const { metadata }: ArticleModule = await import(
    `@/content/articles/${slug}.mdx`
  );

  return [
    {
      id: "og",
      alt: `${metadata.title} — Geoffrey Migliacci`,
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
    ArticleModule,
    Awaited<ReturnType<typeof loadOgFonts>>,
  ] = await Promise.all([
    import(`@/content/articles/${slug}.mdx`),
    loadOgFonts(),
  ]);

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
          Geoffrey Migliacci
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 1.15,
            letterSpacing: -1,
            textWrap: "balance",
            color: OG_COLORS.foreground,
          }}
        >
          {metadata.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            color: OG_COLORS.mutedForeground,
          }}
        >
          {`${formatDate(metadata.date)} · geofmigliacci.dev/articles/${slug}`}
        </div>
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts },
  );
}
