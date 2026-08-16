import type { MetadataRoute } from "next";
import { LOCALES, type Locale, localePath } from "@/i18n/locales";
import { getBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

const absolute = (locale: Locale, path: string) =>
  new URL(localePath(locale, path), siteUrl).href;

/** `MetadataRoute.Sitemap` has no `metadataBase`, so these have to be absolute. */
const languagesFor = (path: string) =>
  Object.fromEntries(LOCALES.map((locale) => [locale, absolute(locale, path)]));

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const posts = await getBlogPosts(locale);

    for (const route of STATIC_ROUTES) {
      entries.push({
        url: absolute(locale, route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: languagesFor(route.path) },
      });
    }

    entries.push({
      // Posts are sorted by date desc, so the newest one dates the index.
      url: absolute(locale, "/blog"),
      lastModified: posts[0]?.date,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesFor("/blog") },
    });

    for (const post of posts) {
      entries.push({
        url: absolute(locale, `/blog/${post.slug}`),
        lastModified: post.date,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languagesFor(`/blog/${post.slug}`) },
      });
    }
  }

  return entries;
}
