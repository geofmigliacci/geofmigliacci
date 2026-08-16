import type { Metadata } from "next";
import { AdjacentBlogPostsNav } from "@/app/blog/[slug]/_components/adjacent-blog-posts-nav";
import { BackToTop } from "@/app/blog/[slug]/_components/back-to-top";
import { BlogPostByline } from "@/app/blog/[slug]/_components/blog-post-byline";
import { BlogPostCover } from "@/app/blog/[slug]/_components/blog-post-cover";
import { BlogPostToc } from "@/app/blog/[slug]/_components/blog-post-toc";
import { ReadingProgressBar } from "@/app/blog/[slug]/_components/reading-progress-bar";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts, getPost, listSlugs } from "@/lib/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { openGraphBase, person, rssAlternate } from "@/lib/site";

interface PostParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await listSlugs("fr");
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PostParams): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await getPost("fr", slug);
  return {
    title: metadata.title,
    description: metadata.description,
    authors: [{ name: person.name, url: person.url }],
    alternates: { canonical: `/blog/${slug}`, types: rssAlternate },
    openGraph: {
      ...openGraphBase,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: metadata.date,
      modifiedTime: metadata.updated ?? metadata.date,
      authors: [person.name],
      tags: metadata.tags,
    },
  };
}

export default async function PostPage({ params }: PostParams) {
  const { slug } = await params;
  const [{ default: Post, metadata, toc }, posts] = await Promise.all([
    getPost("fr", slug),
    getBlogPosts("fr"),
  ]);

  const currentIndex = posts.findIndex((post) => post.slug === slug);
  const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const olderPost =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1]
      : undefined;

  const postData = blogPostingJsonLd({
    title: metadata.title,
    description: metadata.description,
    date: metadata.date,
    updated: metadata.updated,
    tags: metadata.tags,
    cover: metadata.cover,
    readingTime: posts[currentIndex]?.readingTime,
    slug,
  });

  const breadcrumbData = breadcrumbJsonLd(`/blog/${slug}`, metadata.title);

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
