import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import type { ArticleMeta } from "@/lib/articles";
import { getArticles } from "@/lib/articles";

vi.mock("@/lib/articles", () => ({
  getArticles: vi.fn(),
}));

const mockedGetArticles = vi.mocked(getArticles);

const articleA: ArticleMeta = {
  slug: "article-a",
  title: "Article A",
  description: "Description A",
  date: "2026-02-01",
  tags: ["dev"],
  readingTime: 3,
};

const articleB: ArticleMeta = {
  slug: "article-b",
  title: "Article B",
  description: "Description B",
  date: "2026-05-01",
  tags: ["cuisine"],
  readingTime: 5,
};

describe("sitemap", () => {
  it("includes the home, about, and articles index, plus one entry per article", async () => {
    mockedGetArticles.mockResolvedValue([articleB, articleA]);

    const result = await sitemap();

    expect(result[0]).toEqual({
      url: "https://www.geofmigliacci.dev/",
      changeFrequency: "monthly",
      priority: 1,
    });
    expect(result[1]).toEqual({
      url: "https://www.geofmigliacci.dev/about",
      changeFrequency: "monthly",
      priority: 0.7,
    });
    expect(result[2]).toEqual({
      url: "https://www.geofmigliacci.dev/articles",
      lastModified: "2026-05-01",
      changeFrequency: "weekly",
      priority: 0.8,
    });
    expect(result.slice(3)).toEqual([
      {
        url: "https://www.geofmigliacci.dev/articles/article-b",
        lastModified: "2026-05-01",
        changeFrequency: "yearly",
        priority: 0.6,
      },
      {
        url: "https://www.geofmigliacci.dev/articles/article-a",
        lastModified: "2026-02-01",
        changeFrequency: "yearly",
        priority: 0.6,
      },
    ]);
  });

  it("omits lastModified on the articles index and adds no article entries when there are none", async () => {
    mockedGetArticles.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toHaveLength(3);
    expect(result[2].lastModified).toBeUndefined();
  });
});
