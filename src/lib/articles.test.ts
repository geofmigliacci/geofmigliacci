import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { getArticles, listSlugs } from "@/lib/articles";

vi.mock("server-only", () => ({}));

vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn(),
  },
}));

vi.mock("@/content/articles/article-a.mdx", () => ({
  metadata: {
    title: "Article A",
    description: "Description A",
    date: "2026-02-01",
    tags: ["dev"],
  },
}));

vi.mock("@/content/articles/article-b.mdx", () => ({
  metadata: {
    title: "Article B",
    description: "Description B",
    date: "2026-05-01",
    tags: ["cuisine"],
  },
}));

const mockedReaddir = vi.mocked(fs.readdir);
const mockedReadFile = vi.mocked(fs.readFile);

const wordsOf = (count: number) => Array(count).fill("mot").join(" ");

describe("listSlugs", () => {
  it("keeps only .mdx files and excludes underscore-prefixed ones", async () => {
    mockedReaddir.mockResolvedValue([
      "article-a.mdx",
      "article-b.mdx",
      "_template.mdx",
      "notes.txt",
    ] as never);

    await expect(listSlugs()).resolves.toEqual(["article-a", "article-b"]);
  });
});

describe("getArticles", () => {
  it("merges metadata with slug and reading time, sorted by date descending", async () => {
    mockedReaddir.mockResolvedValue([
      "article-a.mdx",
      "article-b.mdx",
    ] as never);
    mockedReadFile.mockImplementation(async (filePath) => {
      const isArticleA = String(filePath).includes("article-a");
      const body = isArticleA ? wordsOf(600) : wordsOf(10);
      return `export const metadata = {\n  title: "x",\n};\n\n${body}`;
    });

    const articles = await getArticles();

    expect(articles).toEqual([
      {
        slug: "article-b",
        readingTime: 1,
        title: "Article B",
        description: "Description B",
        date: "2026-05-01",
        tags: ["cuisine"],
      },
      {
        slug: "article-a",
        readingTime: 3,
        title: "Article A",
        description: "Description A",
        date: "2026-02-01",
        tags: ["dev"],
      },
    ]);
  });
});
