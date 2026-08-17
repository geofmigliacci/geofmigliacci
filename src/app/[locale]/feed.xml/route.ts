import { Feed } from "feed";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LANGUAGE_TAG, localePath } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog";
import { person, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/[locale]/feed.xml">,
) {
  const { locale } = await params;
  // Its own check rather than `toLocale`: `notFound()` has no meaning in a route
  // handler, which owes the client a response.
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 });
  }

  const absolute = (path: string) =>
    new URL(localePath(locale, path), siteUrl).href;
  // Own posts only, or a French post reaches an English subscriber twice.
  const [all, t] = await Promise.all([
    getBlogPosts(locale),
    getTranslations({ locale, namespace: "site" }),
  ]);
  const posts = all.filter((post) => post.contentLocale === locale);

  const feed = new Feed({
    // The name is the one thing that does not translate; the description does.
    title: person.name,
    description: t("tagline"),
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
