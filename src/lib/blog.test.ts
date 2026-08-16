import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { getBlogPosts, listSlugs, resolveContentLocale } from "@/lib/blog";

vi.mock("server-only", () => ({}));

vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn(),
  },
}));

vi.mock("@/content/blog/fr/post-a.mdx", () => ({
  metadata: {
    title: "Post A",
    description: "Description A",
    date: "2026-02-01",
    tags: ["dev"],
  },
}));

vi.mock("@/content/blog/fr/post-b.mdx", () => ({
  metadata: {
    title: "Post B",
    description: "Description B",
    date: "2026-05-01",
    tags: ["cuisine"],
  },
}));

const mockedReaddir = vi.mocked(fs.readdir);
const mockedReadFile = vi.mocked(fs.readFile);

const wordsOf = (count: number) => Array(count).fill("mot").join(" ");

const DIR_WITH_DRAFT = [
  "post-a.mdx",
  "post-b.mdx",
  "work-in-progress.draft.mdx",
  "_template.mdx",
  "notes.txt",
] as never;

/** Both are `cache`d for the life of the module, so one test's listing leaks into the next. */
const freshGetPosts = async () => {
  vi.resetModules();
  const { getBlogPosts: fresh } = await import("@/lib/blog");
  return fresh("fr");
};

const listSlugsUnderNodeEnv = async (nodeEnv: string) => {
  const original = process.env.NODE_ENV;
  vi.stubEnv("NODE_ENV", nodeEnv);
  vi.resetModules();
  const { listSlugs: freshListSlugs } = await import("@/lib/blog");
  const slugs = await freshListSlugs("fr");
  vi.stubEnv("NODE_ENV", original ?? "test");
  return slugs;
};

describe("listSlugs", () => {
  it("keeps only .mdx files and excludes underscore-prefixed ones", async () => {
    mockedReaddir.mockResolvedValue(DIR_WITH_DRAFT);

    await expect(listSlugs("fr")).resolves.toEqual([
      "post-a",
      "post-b",
      "work-in-progress.draft",
    ]);
  });

  it("keeps drafts outside production so they stay previewable locally", async () => {
    mockedReaddir.mockResolvedValue(DIR_WITH_DRAFT);

    await expect(listSlugsUnderNodeEnv("development")).resolves.toContain(
      "work-in-progress.draft",
    );
  });

  it("drops drafts in production so they cannot be published", async () => {
    mockedReaddir.mockResolvedValue(DIR_WITH_DRAFT);

    await expect(listSlugsUnderNodeEnv("production")).resolves.toEqual([
      "post-a",
      "post-b",
    ]);
  });

  // A locale nobody has written for yet has no directory, and must not fail the build.
  it("reads a missing locale directory as an empty blog", async () => {
    mockedReaddir.mockRejectedValue(
      Object.assign(new Error("ENOENT"), { code: "ENOENT" }),
    );

    await expect(listSlugs("en")).resolves.toEqual([]);
  });
});

describe("resolveContentLocale", () => {
  it("prefers the locale asked for when it has the post", async () => {
    mockedReaddir.mockResolvedValue(["post-a.mdx"] as never);

    await expect(resolveContentLocale("fr", "post-a")).resolves.toBe("fr");
  });

  // The whole point of the fallback: an untranslated post is still reachable.
  it("falls back to another locale that wrote the post", async () => {
    vi.resetModules();
    const { resolveContentLocale: fresh } = await import("@/lib/blog");
    mockedReaddir.mockImplementation((async (dir: string) =>
      String(dir).includes("fr") ? ["post-a.mdx"] : []) as never);

    await expect(fresh("en", "post-a")).resolves.toBe("fr");
  });

  it("resolves nothing for a slug no locale wrote", async () => {
    vi.resetModules();
    const { resolveContentLocale: fresh } = await import("@/lib/blog");
    mockedReaddir.mockResolvedValue([] as never);

    await expect(fresh("en", "ghost")).resolves.toBeUndefined();
  });
});

describe("getBlogPosts", () => {
  it("merges metadata with slug and reading time, sorted by date descending", async () => {
    mockedReaddir.mockResolvedValue(["post-a.mdx", "post-b.mdx"] as never);
    mockedReadFile.mockImplementation(async (filePath) => {
      const isPostA = String(filePath).includes("post-a");
      const body = isPostA ? wordsOf(600) : wordsOf(10);
      return `export const metadata = {\n  title: "x",\n};\n\n${body}`;
    });

    const posts = await getBlogPosts("fr");

    expect(posts).toEqual([
      {
        slug: "post-b",
        contentLocale: "fr",
        readingTime: 1,
        title: "Post B",
        description: "Description B",
        date: "2026-05-01",
        tags: ["cuisine"],
      },
      {
        slug: "post-a",
        contentLocale: "fr",
        readingTime: 3,
        title: "Post A",
        description: "Description A",
        date: "2026-02-01",
        tags: ["dev"],
      },
    ]);
  });

  // The case `METADATA_EXPORT`'s `m` flag exists for: a cover import precedes the block.
  it("keeps frontmatter out of the reading time when a cover import precedes it", async () => {
    mockedReaddir.mockResolvedValue(["post-a.mdx"] as never);
    mockedReadFile.mockResolvedValue(
      [
        'import cover from "../covers/post-a.jpg";',
        "",
        "export const metadata = {",
        '  title: "x",',
        `  description: "${wordsOf(100)}",`,
        "  cover,",
        "};",
        "",
        wordsOf(200),
      ].join("\n"),
    );

    const [post] = await freshGetPosts();

    expect(post.readingTime).toBe(1);
  });
});
