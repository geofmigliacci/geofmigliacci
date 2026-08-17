import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import type { BlogPostMeta } from "@/lib/blog";
import { getBlogPosts, postLocales } from "@/lib/blog";
import { testCover, testCoverAlt } from "@/lib/blog.fixtures";

vi.mock("@/lib/blog", () => ({
  getBlogPosts: vi.fn(),
  postLocales: vi.fn(),
}));

const mockedGetPosts = vi.mocked(getBlogPosts);
const mockedPostLocales = vi.mocked(postLocales);

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

const languagesFor = (path: string) => ({
  en: `${HOST}/en${path}`,
  fr: `${HOST}/fr${path}`,
  "x-default": `${HOST}/en${path}`,
});

const frenchOnlyLanguages = (path: string) => ({
  fr: `${HOST}/fr${path}`,
  "x-default": `${HOST}/fr${path}`,
});

const frenchOnly = () => {
  mockedGetPosts.mockResolvedValue([postB, postA]);
  mockedPostLocales.mockResolvedValue(["fr"]);
};

describe("sitemap", () => {
  it("lists every static route under every locale", async () => {
    frenchOnly();

    const result = await sitemap();

    expect(result[0]).toEqual({
      url: `${HOST}/en`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${HOST}/en`,
          fr: `${HOST}/fr`,
          "x-default": `${HOST}/en`,
        },
      },
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

  it("omits the locale a post only falls back into", async () => {
    frenchOnly();

    const result = await sitemap();

    expect(result.map(({ url }) => url)).not.toContain(
      `${HOST}/en/blog/post-a`,
    );
  });

  it("sends x-default to the locale that wrote a post, not to the default one", async () => {
    frenchOnly();

    const result = await sitemap();
    const post = result.find(({ url }) => url.endsWith("/blog/post-a"));

    expect(post?.alternates?.languages?.["x-default"]).toBe(
      `${HOST}/fr/blog/post-a`,
    );
  });

  it("dates an edited post by its edit, which is what lastmod means", async () => {
    mockedGetPosts.mockResolvedValue([{ ...postA, updated: "2026-08-01" }]);
    mockedPostLocales.mockResolvedValue(["fr"]);

    const result = await sitemap();
    const post = result.find(({ url }) => url.endsWith("/blog/post-a"));

    expect(post?.lastModified).toBe("2026-08-01");
  });

  it("omits lastModified on the posts index and adds no post entries when there are none", async () => {
    mockedGetPosts.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toHaveLength(10);
    expect(result[4].lastModified).toBeUndefined();
  });
});
