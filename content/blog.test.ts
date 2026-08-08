import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const MAX_DESCRIPTION_LENGTH = 160;
const MIN_HEADINGS = 2;

const entries = await fs.readdir(BLOG_DIR);
const posts = await Promise.all(
  entries
    .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
    .map(async (entry) => ({
      entry,
      raw: await fs.readFile(path.join(BLOG_DIR, entry), "utf8"),
    })),
);

// Without this, an empty directory generates no cases at all and the file passes.
it("finds posts to check", () => {
  expect(posts).not.toHaveLength(0);
});

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

  // TypeScript cannot see into MDX, so a coverless post typechecks and breaks the list.
  it("declares, imports and describes a cover", () => {
    expect(raw).toMatch(/^import cover from "\.\/.+\.jpg";$/m);
    expect(raw).toMatch(/^\s*cover,$/m);
    expect(raw.match(/coverAlt:\s*\n?\s*"([^"]+)"/)?.[1] ?? "").not.toBe("");
  });
});
