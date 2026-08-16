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
  contentLocale: "fr",
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
  contentLocale: "fr",
  cover: testCover,
  coverAlt: testCoverAlt,
};

const HOST = "https://www.geofmigliacci.dev";

/** Static routes exist in both locales, so their alternates carry the pair. */
const languagesFor = (path: string) => ({
  en: `${HOST}/en${path}`,
  fr: `${HOST}/fr${path}`,
});

/** A post's alternates name only the locales that wrote it. */
const frenchOnlyLanguages = (path: string) => ({ fr: `${HOST}/fr${path}` });

/** Both posts are written in French, so `/en` may list neither. */
const frenchOnly = () => {
  mockedGetPosts.mockResolvedValue([postB, postA]);
};

describe("sitemap", () => {
  it("lists every static route under every locale", async () => {
    frenchOnly();

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
    expect(result[4]).toEqual({
      url: `${HOST}/en/blog`,
      lastModified: "2026-05-01",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesFor("/blog") },
    });
    expect(result.map(({ url }) => url)).toContain(`${HOST}/fr`);
  });

  it("lists a post under the locale that wrote it, and only that one", async () => {
    frenchOnly();

    const result = await sitemap();
    const posts = result.filter(({ url }) => url.includes("/blog/"));

    expect(posts).toEqual([
      {
        url: `${HOST}/fr/blog/post-b`,
        lastModified: "2026-05-01",
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: frenchOnlyLanguages("/blog/post-b") },
      },
      {
        url: `${HOST}/fr/blog/post-a`,
        lastModified: "2026-02-01",
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: frenchOnlyLanguages("/blog/post-a") },
      },
    ]);
  });

  // A fallback page canonicalises elsewhere, so listing it would contradict that.
  it("omits the locale a post only falls back into", async () => {
    frenchOnly();

    const result = await sitemap();

    expect(result.map(({ url }) => url)).not.toContain(
      `${HOST}/en/blog/post-a`,
    );
  });

  it("omits lastModified on the posts index and adds no post entries when there are none", async () => {
    mockedGetPosts.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toHaveLength(10);
    expect(result[4].lastModified).toBeUndefined();
  });
});
