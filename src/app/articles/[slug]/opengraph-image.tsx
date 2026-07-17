import { ImageResponse } from "next/og";
import type { ArticleModule } from "@/lib/articles";
import { listSlugs } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { loadOgFonts, OG_COLORS, OG_SIZE, OgFrame } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
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
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: OG_COLORS.primary,
          }}
        >
          Geoffrey Migliacci
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
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
            alignItems: "center",
            gap: 16,
            marginTop: 40,
            fontFamily: "JetBrains Mono",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", color: OG_COLORS.mutedForeground }}>
            {formatDate(metadata.date)}
          </div>
        </div>
      </div>
    </OgFrame>,
    { ...OG_SIZE, fonts },
  );
}
