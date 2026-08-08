// `pnpm icons`. Re-run whenever --brand-gradient-from/to or the glyph path changes.

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCE_ICON = path.join(ROOT, "src", "app", "icon.svg");
const GLOBALS_CSS = path.join(ROOT, "src", "app", "globals.css");

// Matches src/app/icon.svg: an 84-unit canvas with the glyph inset to 20..64.
const CANVAS = 84;
const CORNER_RADIUS = 32;

const TARGETS = [
  { file: "public/icon-192.png", size: 192, maskable: false },
  { file: "public/icon-512.png", size: 512, maskable: false },
  { file: "public/icon-512-maskable.png", size: 512, maskable: true },
  { file: "src/app/apple-icon.png", size: 180, maskable: false },
];

const ICO_FILE = "src/app/favicon.ico";
const ICO_SIZES = [16, 32, 48, 180];

const ICO_HEADER_BYTES = 6;
const ICO_ENTRY_BYTES = 16;
// A directory entry stores each dimension in one byte, so 256 wraps to 0.
const ICO_DIMENSION_WRAP = 256;

/** The text between the braces of `selector { ... }`, brace-matched. */
function ruleBody(css, selector) {
  const open = css.indexOf("{", css.indexOf(selector));
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unbalanced braces after ${selector} in globals.css`);
}

async function readBrandStops() {
  const css = await fs.readFile(GLOBALS_CSS, "utf8");
  // The light stops only: `.dark` is the wrong pair for a launcher wallpaper.
  const root = ruleBody(css, ":root");
  const read = (name) => {
    const found = root.match(
      new RegExp(`--brand-gradient-${name}:\\s*(#[0-9a-fA-F]{6})`),
    );
    if (!found) {
      throw new Error(
        `--brand-gradient-${name} not found in :root of globals.css`,
      );
    }
    return found[1];
  };
  return { from: read("from"), to: read("to") };
}

async function readGlyphPath() {
  const svg = await fs.readFile(SOURCE_ICON, "utf8");
  const found = svg.match(/\sd="([^"]+)"/);
  if (!found) {
    throw new Error("no path data found in src/app/icon.svg");
  }
  return found[1];
}

/** Square and full-bleed when maskable: the launcher applies its own shape. */
function buildSvg({ size, maskable, stops, glyph }) {
  const corner = maskable ? 0 : CORNER_RADIUS;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <defs>
    <linearGradient id="brand" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="${stops.from}" />
      <stop offset="100%" stop-color="${stops.to}" />
    </linearGradient>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" rx="${corner}" fill="url(#brand)" />
  <path d="${glyph}" fill="#ffffff" />
</svg>`;
}

/** .ico is the one format sharp cannot write, so the container is assembled here. */
function buildIco(images) {
  const header = Buffer.alloc(ICO_HEADER_BYTES);
  header.writeUInt16LE(1, 2); // 1 = icon, as opposed to 2 = cursor
  header.writeUInt16LE(images.length, 4);

  let offset = ICO_HEADER_BYTES + ICO_ENTRY_BYTES * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(ICO_ENTRY_BYTES);
    entry.writeUInt8(size % ICO_DIMENSION_WRAP, 0);
    entry.writeUInt8(size % ICO_DIMENSION_WRAP, 1);
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const [stops, glyph] = await Promise.all([readBrandStops(), readGlyphPath()]);
console.log(`brand stops: ${stops.from} -> ${stops.to}`);

for (const { file, size, maskable } of TARGETS) {
  const svg = buildSvg({ size, maskable, stops, glyph });
  const out = path.join(ROOT, file);
  // `resize` is the guard: a `density` override would silently multiply the declared size.
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true, colors: 256, dither: 1 })
    .toFile(out);
  const { size: bytes } = await fs.stat(out);
  // Read back off the file, not echoed: the manifest promises these to install prompts.
  const { width, height } = await sharp(out).metadata();
  if (width !== size || height !== size) {
    throw new Error(
      `${file}: wrote ${width}x${height}, expected ${size}x${size}`,
    );
  }
  console.log(
    `${file.padEnd(30)} ${width}x${height}  ${(bytes / 1024).toFixed(1)}KB${maskable ? "  (maskable)" : ""}`,
  );
}

// Full colour, not the palette above: the entries declare 32bpp and are alpha-blended.
const icoImages = await Promise.all(
  ICO_SIZES.map(async (size) => ({
    size,
    data: await sharp(
      Buffer.from(buildSvg({ size, maskable: false, stops, glyph })),
    )
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  })),
);

const icoPath = path.join(ROOT, ICO_FILE);
await fs.writeFile(icoPath, buildIco(icoImages));

for (const { size, data } of icoImages) {
  const { width, height } = await sharp(data).metadata();
  if (width !== size || height !== size) {
    throw new Error(
      `${ICO_FILE}: entry wrote ${width}x${height}, expected ${size}x${size}`,
    );
  }
}
const { size: icoBytes } = await fs.stat(icoPath);
console.log(
  `${ICO_FILE.padEnd(30)} ${ICO_SIZES.join("/")}  ${(icoBytes / 1024).toFixed(1)}KB`,
);

process.exitCode = 0;
