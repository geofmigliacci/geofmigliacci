import type { MetadataRoute } from "next";
import { LOCALES, type Locale, localePath } from "@/i18n/locales";
import { getBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

const absolute = (locale: Locale, path: string) =>
  new URL(localePath(locale, path), siteUrl).href;

/** `MetadataRoute.Sitemap` has no `metadataBase`, so these have to be absolute. */
const languagesFor = (path: string, locales: readonly Locale[]) =>
  Object.fromEntries(locales.map((locale) => [locale, absolute(locale, path)]));

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const byLocale = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      posts: await getBlogPosts(locale),
    })),
  );

  /** Which locales actually wrote a given slug, rather than falling back to it. */
  const authors = new Map<string, Locale[]>();
  for (const { locale, posts } of byLocale) {
    for (const post of posts) {
      if (post.contentLocale !== locale) continue;
      authors.set(post.slug, [...(authors.get(post.slug) ?? []), locale]);
    }
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const { locale, posts } of byLocale) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: absolute(locale, route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: languagesFor(route.path, LOCALES) },
      });
    }

    entries.push({
      // Posts are sorted by date desc, so the newest one dates the index.
      url: absolute(locale, "/blog"),
      lastModified: posts[0]?.date,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesFor("/blog", LOCALES) },
    });

    // Own posts only: a fallback URL canonicalises to another locale, and
    // listing it, or advertising it as an alternate, contradicts that.
    for (const post of posts.filter((p) => p.contentLocale === locale)) {
      const path = `/blog/${post.slug}`;
      entries.push({
        url: absolute(locale, path),
        lastModified: post.date,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: {
          languages: languagesFor(path, authors.get(post.slug) ?? [locale]),
        },
      });
    }
  }

  return entries;
}
