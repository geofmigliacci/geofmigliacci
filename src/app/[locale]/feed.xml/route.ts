import { Feed } from "feed";
import { hasLocale } from "next-intl";
import { LANGUAGE_TAG, localePath } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog";
import { person, siteUrl, tagline } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 });
  }

  const absolute = (path: string) =>
    new URL(localePath(locale, path), siteUrl).href;
  // Own posts only, or a French post reaches an English subscriber twice.
  const all = await getBlogPosts(locale);
  const posts = all.filter((post) => post.contentLocale === locale);

  const feed = new Feed({
    title: person.name,
    description: tagline,
    id: absolute("/"),
    link: absolute("/"),
    language: LANGUAGE_TAG[locale],
    copyright: `© ${person.name}`,
    updated: posts[0] ? new Date(posts[0].date) : undefined,
    feedLinks: { rss: absolute("/feed.xml") },
    author: { name: person.name, link: absolute("/about") },
  });

  for (const post of posts) {
    const url = absolute(`/blog/${post.slug}`);
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      date: new Date(post.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
