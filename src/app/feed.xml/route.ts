import { Feed } from "feed";
import { getArticles } from "@/lib/articles";
import { person, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const articles = await getArticles();

  const feed = new Feed({
    title: person.name,
    description:
      "J'écris sur le code, la cuisine, les langues, la philosophie — tout ce qui nourrit ma curiosité et la vie autour.",
    id: siteUrl.href,
    link: siteUrl.href,
    language: "fr",
    copyright: `© ${person.name}`,
    updated: articles[0] ? new Date(articles[0].date) : undefined,
    feedLinks: { rss: new URL("/feed.xml", siteUrl).href },
    author: { name: person.name, link: person.url },
  });

  for (const article of articles) {
    const url = new URL(`/articles/${article.slug}`, siteUrl).href;
    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.description,
      date: new Date(article.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
