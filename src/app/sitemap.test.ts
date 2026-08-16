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

const HOST = "https://www.geofmigliacci.dev";

/** Every entry carries the full set, so one row proves the pair for all of them. */
const languagesFor = (path: string) => ({
  en: `${HOST}/en${path}`,
  fr: `${HOST}/fr${path}`,
});

describe("sitemap", () => {
  it("includes the home, about, legal and posts index, plus one entry per post", async () => {
    mockedGetPosts.mockResolvedValue([postB, postA]);

    const result = await sitemap();

    expect(result[0]).toEqual({
      url: `${HOST}/en`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${HOST}/en`, fr: `${HOST}/fr` } },
    });
    expect(result[1]).toEqual({
      url: `${HOST}/en/about`,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: languagesFor("/about") },
    });
    expect(result[2]).toEqual({
      url: `${HOST}/en/legal`,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: { languages: languagesFor("/legal") },
    });
    expect(result[3]).toEqual({
      url: `${HOST}/en/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: { languages: languagesFor("/privacy-policy") },
    });
    expect(result[4]).toEqual({
      url: `${HOST}/en/blog`,
      lastModified: "2026-05-01",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesFor("/blog") },
    });
    expect(result.slice(5, 7)).toEqual([
      {
        url: `${HOST}/en/blog/post-b`,
        lastModified: "2026-05-01",
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languagesFor("/blog/post-b") },
      },
      {
        url: `${HOST}/en/blog/post-a`,
        lastModified: "2026-02-01",
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languagesFor("/blog/post-a") },
      },
    ]);
  });

  // Two locales, so every route appears twice and nothing may be listed once.
  it("emits the same routes under every locale", async () => {
    mockedGetPosts.mockResolvedValue([postB, postA]);

    const result = await sitemap();

    expect(result).toHaveLength(14);
    expect(
      result.filter(({ url }) => url.startsWith(`${HOST}/fr`)),
    ).toHaveLength(7);
    expect(result[7].url).toBe(`${HOST}/fr`);
  });

  it("omits lastModified on the posts index and adds no post entries when there are none", async () => {
    mockedGetPosts.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toHaveLength(10);
    expect(result[4].lastModified).toBeUndefined();
  });
});
