import fs from "node:fs/promises";
import path from "node:path";
import { GLYPH_PATH, GLYPH_STROKE_WIDTH, GLYPH_VIEW_BOX } from "@/lib/glyph";
import { siteUrl } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

// Hex copies of the light-theme tokens in globals.css, which satori cannot read.
const OG_COLORS = {
  background: "#fbfcfd",
  foreground: "#1a1a1f",
  primary: "#4e4ea4",
  mutedForeground: "#54545e",
};

const FONTS_DIR = path.join(process.cwd(), "src", "lib", "og-fonts");

/** Static instances, not variable files: satori cannot select a named instance out of one. */
export async function loadOgFonts() {
  const [geistRegular, spaceGroteskBold, jetBrainsMonoRegular] =
    await Promise.all([
      fs.readFile(path.join(FONTS_DIR, "Geist-Regular.ttf")),
      fs.readFile(path.join(FONTS_DIR, "SpaceGrotesk-Bold.ttf")),
      fs.readFile(path.join(FONTS_DIR, "JetBrainsMono-Regular.ttf")),
    ]);

  return [
    {
      name: "Geist",
      data: geistRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Space Grotesk",
      data: spaceGroteskBold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "JetBrains Mono",
      data: jetBrainsMonoRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

// The light `--brand-gradient-from/to` of globals.css, which satori cannot read.
const BRAND_FROM = "#333987";
const BRAND_TO = "#a8539f";

const BRAND_GRADIENT = `linear-gradient(45deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`;
const BRAND_RULE_HEIGHT = 10;

const CONTENT_PADDING = 96;

const MARK_SIZE = 420;
const MARK_BLEED = 90;
const MARK_OPACITY = 0.18;

const GLYPH_MARK = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_SIZE}" height="${MARK_SIZE}" viewBox="${GLYPH_VIEW_BOX}">
    <linearGradient id="brand" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="${BRAND_FROM}" />
      <stop offset="100%" stop-color="${BRAND_TO}" />
    </linearGradient>
    <path d="${GLYPH_PATH}" fill="url(#brand)" stroke="url(#brand)" stroke-width="${GLYPH_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
).toString("base64")}`;

function OgFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background: OG_COLORS.background,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: BRAND_RULE_HEIGHT,
          display: "flex",
          background: BRAND_GRADIENT,
        }}
      />
      {/* Opacity on the element, not on `fill`/`stroke`: those overlap and would double it. */}
      {/* biome-ignore lint/performance/noImgElement: satori resolves `src` itself, and the frame is already a static PNG */}
      <img
        src={GLYPH_MARK}
        alt=""
        width={MARK_SIZE}
        height={MARK_SIZE}
        style={{
          position: "absolute",
          right: -MARK_BLEED,
          bottom: -MARK_BLEED,
          opacity: MARK_OPACITY,
        }}
      />
      {children}
    </div>
  );
}

const DISPLAY_HOST = siteUrl.host.replace(/^www\./, "");

export function ogHost(pathname = "") {
  return `${DISPLAY_HOST}${pathname}`;
}

const TITLE_SCALE = {
  display: { fontSize: 108, lineHeight: 1, letterSpacing: -2 },
  headline: {
    fontSize: 64,
    lineHeight: 1.15,
    letterSpacing: -1,
    textWrap: "balance",
  },
} satisfies Record<string, React.CSSProperties>;

interface OgCardProps {
  eyebrow: string;
  title: string;
  /** `display` for a page name; `headline` for a post title, which runs longer. */
  scale?: keyof typeof TITLE_SCALE;
  description?: string;
  /** The closing line. Build it with `ogHost` so the domain stays in one place. */
  meta: string;
}

export function OgCard({
  eyebrow,
  title,
  scale = "display",
  description,
  meta,
}: OgCardProps) {
  return (
    <OgFrame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: `0 ${CONTENT_PADDING}px`,
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
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            color: OG_COLORS.foreground,
            ...TITLE_SCALE[scale],
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 860,
              fontFamily: "Geist",
              fontWeight: 400,
              fontSize: 30,
              lineHeight: 1.35,
              textWrap: "balance",
              color: OG_COLORS.mutedForeground,
            }}
          >
            {description}
          </div>
        )}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            whiteSpace: "nowrap",
            color: OG_COLORS.mutedForeground,
          }}
        >
          {meta}
        </div>
      </div>
    </OgFrame>
  );
}
