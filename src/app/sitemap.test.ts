import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import type { BlogPostMeta } from "@/lib/blog";
import { getBlogPosts } from "@/lib/blog";
import { testCover, testCoverAlt } from "@/lib/blog.fixtures";

vi.mock("@/lib/blog", () => ({
  getBlogPosts: vi.fn(),
}));

const mockedGetPosts = vi.mocked(getBlogPosts);

const postA: BlogPostMeta = {
  slug: "post-a",
  title: "Post A",
  description: "Description A",
  date: "2026-02-01",
  tags: ["dev"],
  readingTime: 3,
  cover: testCover,
  coverAlt: testCoverAlt,
};

const postB: BlogPostMeta = {
  slug: "post-b",
  title: "Post B",
  description: "Description B",
  date: "2026-05-01",
  tags: ["cuisine"],
  readingTime: 5,
  cover: testCover,
  coverAlt: testCoverAlt,
};

describe("sitemap", () => {
  it("includes the home, about, legal and posts index, plus one entry per post", async () => {
    mockedGetPosts.mockResolvedValue([postB, postA]);

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
      url: "https://www.geofmigliacci.dev/legal",
      changeFrequency: "yearly",
      priority: 0.2,
    });
    expect(result[3]).toEqual({
      url: "https://www.geofmigliacci.dev/privacy-policy",
      changeFrequency: "yearly",
      priority: 0.2,
    });
    expect(result[4]).toEqual({
      url: "https://www.geofmigliacci.dev/blog",
      lastModified: "2026-05-01",
      changeFrequency: "weekly",
      priority: 0.8,
    });
    expect(result.slice(5)).toEqual([
      {
        url: "https://www.geofmigliacci.dev/blog/post-b",
        lastModified: "2026-05-01",
        changeFrequency: "yearly",
        priority: 0.6,
      },
      {
        url: "https://www.geofmigliacci.dev/blog/post-a",
        lastModified: "2026-02-01",
        changeFrequency: "yearly",
        priority: 0.6,
      },
    ]);
  });

  it("omits lastModified on the posts index and adds no post entries when there are none", async () => {
    mockedGetPosts.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toHaveLength(5);
    expect(result[4].lastModified).toBeUndefined();
  });
});
