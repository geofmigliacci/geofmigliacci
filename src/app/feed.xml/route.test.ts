import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/feed.xml/route";
import type { BlogPostMeta } from "@/lib/blog";
import { getBlogPosts } from "@/lib/blog";
import { testCover, testCoverAlt } from "@/lib/blog.fixtures";

vi.mock("@/lib/blog", () => ({
  getBlogPosts: vi.fn(),
}));

const mockedGetPosts = vi.mocked(getBlogPosts);

const post: BlogPostMeta = {
  slug: "post-a",
  title: "Post A & <tags>",
  description: "Description A",
  date: "2026-05-01",
  tags: ["dev"],
  readingTime: 3,
  cover: testCover,
  coverAlt: testCoverAlt,
};

describe("GET /feed.xml", () => {
  it("serves an RSS channel with one item per post", async () => {
    mockedGetPosts.mockResolvedValue([post]);

    const response = await GET();
    const xml = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<language>fr</language>");
    expect(xml).toContain(
      "<link>https://www.geofmigliacci.dev/blog/post-a</link>",
    );
    expect(xml).toContain(
      '<guid isPermaLink="false">https://www.geofmigliacci.dev/blog/post-a</guid>',
    );
    expect(xml).toContain("<pubDate>Fri, 01 May 2026 00:00:00 GMT</pubDate>");
  });

  it("advertises itself as the feed self link", async () => {
    mockedGetPosts.mockResolvedValue([post]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(
      '<atom:link href="https://www.geofmigliacci.dev/feed.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("keeps special characters intact inside CDATA sections", async () => {
    mockedGetPosts.mockResolvedValue([post]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain("<title><![CDATA[Post A & <tags>]]></title>");
  });

  it("renders an empty channel when there are no posts", async () => {
    mockedGetPosts.mockResolvedValue([]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});
