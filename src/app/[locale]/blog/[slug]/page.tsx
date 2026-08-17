import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AdjacentBlogPostsNav } from "@/app/[locale]/blog/[slug]/_components/adjacent-blog-posts-nav";
import { BackToTop } from "@/app/[locale]/blog/[slug]/_components/back-to-top";
import { BlogPostByline } from "@/app/[locale]/blog/[slug]/_components/blog-post-byline";
import { BlogPostCover } from "@/app/[locale]/blog/[slug]/_components/blog-post-cover";
import { BlogPostToc } from "@/app/[locale]/blog/[slug]/_components/blog-post-toc";
import { ReadingProgressBar } from "@/app/[locale]/blog/[slug]/_components/reading-progress-bar";
import { UntranslatedNotice } from "@/app/[locale]/blog/[slug]/_components/untranslated-notice";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { LOCALES, localePath } from "@/i18n/locales";
import { toLocale } from "@/i18n/params";
import {
  getBlogPosts,
  getPost,
  postLocales,
  resolveContentLocale,
} from "@/lib/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase, rssAlternate } from "@/lib/metadata";
import { person } from "@/lib/site";

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getBlogPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
    }),
  );
  return perLocale.flat();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const contentLocale = await resolveContentLocale(locale, slug);
  if (!contentLocale) notFound();

  const [{ metadata }, authors] = await Promise.all([
    getPost(contentLocale, slug),
    postLocales(slug),
  ]);
  const translated = contentLocale === locale;

  return {
    title: metadata.title,
    description: metadata.description,
    authors: [{ name: person.name, url: localePath(locale, "/about") }],
    // No alternates on a fallback: `hreflang` is read off canonical URLs only.
    alternates: translated
      ? alternatesFor(`/blog/${slug}`, locale, authors)
      : {
          canonical: localePath(contentLocale, `/blog/${slug}`),
          types: rssAlternate(locale),
        },
    openGraph: {
      ...openGraphBase(contentLocale),
      type: "article",
      // The canonical, which a fallback puts in another locale: `og:url` keys the
      // shared object, and two of them would split one article's engagement.
      url: localePath(contentLocale, `/blog/${slug}`),
      publishedTime: metadata.date,
      modifiedTime: metadata.updated ?? metadata.date,
      authors: [person.name],
      tags: metadata.tags,
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  setRequestLocale(locale);

  const contentLocale = await resolveContentLocale(locale, slug);
  if (!contentLocale) notFound();

  const [{ default: Post, metadata, toc }, posts, ctx] = await Promise.all([
    getPost(contentLocale, slug),
    getBlogPosts(locale),
    jsonLdContext(locale),
  ]);
  const translated = contentLocale === locale;

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
    contentLocale,
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
        <h1
          lang={translated ? undefined : contentLocale}
          className="text-3xl font-bold tracking-tight text-balance md:text-4xl"
        >
          {metadata.title}
        </h1>
        <BlogPostByline
          date={metadata.date}
          readingTime={posts[currentIndex]?.readingTime}
          updated={metadata.updated}
        />
        <div
          lang={translated ? undefined : contentLocale}
          className="mt-4 flex flex-wrap gap-2"
        >
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
          lang={translated ? undefined : contentLocale}
        />
        {!translated && (
          <UntranslatedNotice contentLocale={contentLocale} slug={slug} />
        )}
        <div className="post-columns">
          <div
            lang={translated ? undefined : contentLocale}
            className="prose prose-lg prose-zinc max-w-3xl dark:prose-invert prose-code:wrap-break-word prose-headings:scroll-mt-8 prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-pre:text-foreground"
          >
            <Post />
          </div>
          <BlogPostToc
            items={toc}
            lang={translated ? undefined : contentLocale}
          />
        </div>
      </div>
      <AdjacentBlogPostsNav olderPost={olderPost} newerPost={newerPost} />
    </article>
  );
}
