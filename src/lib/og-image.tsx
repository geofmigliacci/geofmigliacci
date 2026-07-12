import fs from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  background: "#0f0f0f",
  foreground: "#e5e5e5",
  primary: "#f59e0b",
  mutedForeground: "#a3a3a3",
};

const FONTS_DIR = path.join(process.cwd(), "src", "lib", "og-fonts");

export async function loadOgFonts() {
  const [interRegular, interBold, jetBrainsMonoRegular] = await Promise.all([
    fs.readFile(path.join(FONTS_DIR, "Inter-Regular.ttf")),
    fs.readFile(path.join(FONTS_DIR, "Inter-Bold.ttf")),
    fs.readFile(path.join(FONTS_DIR, "JetBrainsMono-Regular.ttf")),
  ]);

  return [
    {
      name: "Inter",
      data: interRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: interBold,
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

function OgCorner({
  top,
  left,
  right,
  bottom,
}: {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        width: 20,
        height: 20,
        // Satori chokes on style values that are explicitly `undefined`
        // (as opposed to the key being absent), so only defined sides.
        ...(top !== undefined && { top }),
        ...(left !== undefined && { left }),
        ...(right !== undefined && { right }),
        ...(bottom !== undefined && { bottom }),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 9,
          top: 0,
          width: 2,
          height: 20,
          background: OG_COLORS.foreground,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 9,
          left: 0,
          height: 2,
          width: 20,
          background: OG_COLORS.foreground,
          opacity: 0.3,
        }}
      />
    </div>
  );
}

const GRID_LINE = "rgba(229, 229, 229, 0.08)";

export function OgFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background: OG_COLORS.background,
        backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "120px 120px, 120px 120px",
      }}
    >
      <OgCorner top={40} left={40} />
      <OgCorner top={40} right={40} />
      <OgCorner bottom={40} left={40} />
      <OgCorner bottom={40} right={40} />
      {children}
    </div>
  );
}
