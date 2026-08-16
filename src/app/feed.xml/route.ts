import { Feed } from "feed";
import { getBlogPosts } from "@/lib/blog";
import { person, siteUrl, tagline } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getBlogPosts("fr");

  const feed = new Feed({
    title: person.name,
    description: tagline,
    id: siteUrl.href,
    link: siteUrl.href,
    language: "fr",
    copyright: `© ${person.name}`,
    updated: posts[0] ? new Date(posts[0].date) : undefined,
    feedLinks: { rss: new URL("/feed.xml", siteUrl).href },
    author: { name: person.name, link: person.url },
  });

  for (const post of posts) {
    const url = new URL(`/blog/${post.slug}`, siteUrl).href;
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
