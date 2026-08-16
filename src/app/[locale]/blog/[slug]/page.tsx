import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AdjacentBlogPostsNav } from "@/app/[locale]/blog/[slug]/_components/adjacent-blog-posts-nav";
import { BackToTop } from "@/app/[locale]/blog/[slug]/_components/back-to-top";
import { BlogPostByline } from "@/app/[locale]/blog/[slug]/_components/blog-post-byline";
import { BlogPostCover } from "@/app/[locale]/blog/[slug]/_components/blog-post-cover";
import { BlogPostToc } from "@/app/[locale]/blog/[slug]/_components/blog-post-toc";
import { ReadingProgressBar } from "@/app/[locale]/blog/[slug]/_components/reading-progress-bar";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { LOCALES, type Locale, localePath } from "@/i18n/locales";
import { getBlogPosts, getPost, listSlugs } from "@/lib/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { person } from "@/lib/site";

interface PostParams {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await listSlugs(locale);
      return slugs.map((slug) => ({ locale, slug }));
    }),
  );
  return perLocale.flat();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PostParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const { metadata } = await getPost(locale, slug);
  return {
    title: metadata.title,
    description: metadata.description,
    authors: [{ name: person.name, url: localePath(locale, "/about") }],
    alternates: alternatesFor(`/blog/${slug}`, locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "article",
      url: localePath(locale, `/blog/${slug}`),
      publishedTime: metadata.date,
      modifiedTime: metadata.updated ?? metadata.date,
      authors: [person.name],
      tags: metadata.tags,
    },
  };
}

export default async function PostPage({ params }: PostParams) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [{ default: Post, metadata, toc }, posts, ctx] = await Promise.all([
    getPost(locale, slug),
    getBlogPosts(locale),
    jsonLdContext(locale),
  ]);

  const currentIndex = posts.findIndex((post) => post.slug === slug);
  const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const olderPost =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1]
      : undefined;

  const postData = blogPostingJsonLd(ctx, {
    title: metadata.title,
    description: metadata.description,
    date: metadata.date,
    updated: metadata.updated,
    tags: metadata.tags,
    cover: metadata.cover,
    readingTime: posts[currentIndex]?.readingTime,
    slug,
  });

  const breadcrumbData = breadcrumbJsonLd(ctx, {
    path: `/blog/${slug}`,
    leafName: metadata.title,
  });

  return (
    <article className="page-shell">
      <JsonLd data={graph(postData, breadcrumbData)} />
      <ReadingProgressBar />
      <BackToTop />
      <div className="enter-rise">
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {metadata.title}
        </h1>
        <BlogPostByline
          date={metadata.date}
          readingTime={posts[currentIndex]?.readingTime}
          updated={metadata.updated}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        {/* Closes the header and opens the prose. Every post has one: the
            list renders covers at full width, where a missing one would read as
            a broken row. */}
        <BlogPostCover
          cover={metadata.cover}
          alt={metadata.coverAlt}
          caption={metadata.coverCaption}
          position={metadata.coverPosition}
        />
        <div className="post-columns">
          <div className="prose prose-lg prose-zinc max-w-3xl dark:prose-invert prose-code:wrap-break-word prose-headings:scroll-mt-8 prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-pre:text-foreground">
            <Post />
          </div>
          <BlogPostToc items={toc} />
        </div>
      </div>
      <AdjacentBlogPostsNav olderPost={olderPost} newerPost={newerPost} />
    </article>
  );
}
