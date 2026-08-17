import type { MetadataRoute } from "next";
import { LOCALES, type Locale, localePath } from "@/i18n/locales";
import { getBlogPosts, postLocales } from "@/lib/blog";
import { defaultAmong } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

const absolute = (locale: Locale, path: string) =>
  new URL(localePath(locale, path), siteUrl).href;

/** `MetadataRoute.Sitemap` has no `metadataBase`, so these have to be absolute. */
const languagesFor = (path: string, locales: readonly Locale[]) => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, absolute(locale, path)]),
  ),
  "x-default": absolute(defaultAmong(locales), path),
});

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const byLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getBlogPosts(locale);
      // Own posts only: a fallback URL canonicalises to another locale, and
      // listing it, or advertising it as an alternate, contradicts that.
      const own = posts.filter((post) => post.contentLocale === locale);
      return {
        locale,
        posts,
        own: await Promise.all(
          own.map(async (post) => ({
            post,
            authors: await postLocales(post.slug),
          })),
        ),
      };
    }),
  );

  /** Locale-invariant, so they are built once rather than once per locale. */
  const staticLanguages = new Map(
    [...STATIC_ROUTES.map(({ path }) => path), "/blog"].map((path) => [
      path,
      languagesFor(path, LOCALES),
    ]),
  );

  const entries: MetadataRoute.Sitemap = [];

  for (const { locale, posts, own } of byLocale) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: absolute(locale, route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: staticLanguages.get(route.path) },
      });
    }

    entries.push({
      // Posts are sorted by date desc, so the newest one dates the index.
      url: absolute(locale, "/blog"),
      lastModified: posts[0]?.date,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: staticLanguages.get("/blog") },
    });

    for (const { post, authors } of own) {
      const path = `/blog/${post.slug}`;
      entries.push({
        url: absolute(locale, path),
        lastModified: post.date,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languagesFor(path, authors) },
      });
    }
  }

  return entries;
}
