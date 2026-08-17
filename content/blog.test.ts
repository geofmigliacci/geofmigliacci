import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "../src/i18n/locales";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const MAX_DESCRIPTION_LENGTH = 160;
const MIN_HEADINGS = 2;

// A locale nobody has written for yet has no directory, and that is not a failure.
const written = await Promise.all(
  LOCALES.map(async (locale) => {
    const dir = path.join(BLOG_DIR, locale);
    const entries = await fs.readdir(dir).catch(() => null);
    const posts = await Promise.all(
      (entries ?? [])
        .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
        .map(async (entry) => ({
          locale,
          slug: entry.replace(/\.mdx$/, ""),
          entry: `${locale}/${entry}`,
          raw: await fs.readFile(path.join(dir, entry), "utf8"),
        })),
    );
    return { locale, posts, exists: entries !== null };
  }),
);

const posts = written.flatMap(({ posts }) => posts);

// Without this, an empty directory generates no cases at all and the file passes.
it("finds posts to check", () => {
  expect(posts).not.toHaveLength(0);
});

// On the directory existing: an absent one falls back, an empty one was abandoned.
it.each(written.filter(({ exists }) => exists))(
  "$locale has posts in the directory it declares",
  ({ posts }) => {
    expect(posts).not.toHaveLength(0);
  },
);

describe.each(posts)("$entry", ({ raw }) => {
  it("has a description within SERP-safe length", () => {
    const description = raw.match(/description:\s*"([^"]+)"/)?.[1] ?? "";

    expect(description).not.toBe("");
    expect(description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
  });

  // `new Date` reads an unpadded date as local time, so "2026-7-17" publishes on the 16th.
  it("dates the post so it resolves to the day it names", () => {
    const dates = [...raw.matchAll(/^\s*(?:date|updated):\s*"([^"]+)"/gm)].map(
      ([, value]) => value,
    );

    expect(dates).not.toHaveLength(0);
    for (const date of dates) {
      expect(new Date(date).toISOString()).toMatch(`${date}T`);
    }
  });

  // `rehype-mdx-toc` sees markdown headings only: a post of `<Chapter>` ships an empty outline.
  it("carries enough markdown headings for an outline", () => {
    const headings = raw.match(/^## .+$/gm) ?? [];

    expect(headings.length).toBeGreaterThanOrEqual(MIN_HEADINGS);
  });

  it("titles an epilogue in the language the post is written in", () => {
    if (!raw.includes("<Epilogue")) return;

    expect(raw).toMatch(/<Epilogue title="[^"]+">/);
  });

  // TypeScript cannot see into MDX, so a coverless post typechecks and breaks the list.
  it("declares, imports and describes a cover", () => {
    expect(raw).toMatch(/^import cover from "\.\.\/covers\/.+\.jpg";$/m);
    expect(raw).toMatch(/^\s*cover,$/m);
    expect(raw.match(/coverAlt:\s*\n?\s*"([^"]+)"/)?.[1] ?? "").not.toBe("");
  });
});

it("keeps one cover per slug across locales", () => {
  const covers = new Map<string, Set<string>>();

  for (const { slug, raw } of posts) {
    const file = raw.match(/^import cover from "\.\.\/covers\/(.+)";$/m)?.[1];
    if (!file) continue;
    covers.set(slug, (covers.get(slug) ?? new Set()).add(file));
  }

  for (const [slug, files] of covers) {
    expect(files, slug).toHaveProperty("size", 1);
  }
});
