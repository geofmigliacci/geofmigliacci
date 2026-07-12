import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  return [
    {
      url: new URL("/", siteUrl).href,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      // Articles are sorted by date desc, so the newest one dates the index.
      url: new URL("/articles", siteUrl).href,
      lastModified: articles[0]?.date,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: new URL(`/articles/${article.slug}`, siteUrl).href,
      lastModified: article.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
