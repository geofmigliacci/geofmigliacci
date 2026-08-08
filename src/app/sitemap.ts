import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();

  return [
    {
      url: new URL("/", siteUrl).href,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/about", siteUrl).href,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: new URL("/legal", siteUrl).href,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: new URL("/privacy-policy", siteUrl).href,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      // Posts are sorted by date desc, so the newest one dates the index.
      url: new URL("/blog", siteUrl).href,
      lastModified: posts[0]?.date,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: new URL(`/blog/${post.slug}`, siteUrl).href,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
