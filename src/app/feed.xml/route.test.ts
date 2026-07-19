import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/feed.xml/route";
import type { ArticleMeta } from "@/lib/articles";
import { getArticles } from "@/lib/articles";

vi.mock("@/lib/articles", () => ({
  getArticles: vi.fn(),
}));

const mockedGetArticles = vi.mocked(getArticles);

const article: ArticleMeta = {
  slug: "article-a",
  title: "Article A & <balises>",
  description: "Description A",
  date: "2026-05-01",
  tags: ["dev"],
  readingTime: 3,
};

describe("GET /feed.xml", () => {
  it("serves an RSS channel with one item per article", async () => {
    mockedGetArticles.mockResolvedValue([article]);

    const response = await GET();
    const xml = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<language>fr</language>");
    expect(xml).toContain(
      "<link>https://www.geofmigliacci.dev/articles/article-a</link>",
    );
    expect(xml).toContain(
      '<guid isPermaLink="false">https://www.geofmigliacci.dev/articles/article-a</guid>',
    );
    expect(xml).toContain("<pubDate>Fri, 01 May 2026 00:00:00 GMT</pubDate>");
  });

  it("advertises itself as the feed self link", async () => {
    mockedGetArticles.mockResolvedValue([article]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(
      '<atom:link href="https://www.geofmigliacci.dev/feed.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("keeps special characters intact inside CDATA sections", async () => {
    mockedGetArticles.mockResolvedValue([article]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain("<title><![CDATA[Article A & <balises>]]></title>");
  });

  it("renders an empty channel when there are no articles", async () => {
    mockedGetArticles.mockResolvedValue([]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});
