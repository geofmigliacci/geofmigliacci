import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdjacentArticlesNav } from "@/app/articles/[slug]/_components/adjacent-articles-nav";
import {
  ArticleTableOfContents,
  ReadingProgressBar,
} from "@/app/articles/[slug]/_components/article-reading-experience";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  type ArticleMeta,
  type ArticleModule,
  getArticles,
  listSlugs,
} from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { openGraphBase, person } from "@/lib/site";

interface ArticleParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ArticleParams): Promise<Metadata> {
  const { slug } = await params;
  const { metadata }: ArticleModule = await import(
    `@/content/articles/${slug}.mdx`
  );
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      ...openGraphBase,
      type: "article",
      url: `/articles/${slug}`,
      publishedTime: metadata.date,
      authors: [person.name],
      tags: metadata.tags,
    },
  };
}

export default async function ArticlePage({ params }: ArticleParams) {
  const { slug } = await params;
  const [{ default: Post, metadata }, articles]: [
    ArticleModule,
    ArticleMeta[],
  ] = await Promise.all([
    import(`@/content/articles/${slug}.mdx`),
    getArticles(),
  ]);

  const currentIndex = articles.findIndex((article) => article.slug === slug);
  const newerArticle =
    currentIndex > 0 ? articles[currentIndex - 1] : undefined;
  const olderArticle =
    currentIndex >= 0 && currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : undefined;

  const articleData = articleJsonLd({
    title: metadata.title,
    description: metadata.description,
    date: metadata.date,
    slug,
  });

  const breadcrumbData = breadcrumbJsonLd([
    { name: "Accueil", path: "/" },
    { name: "Articles", path: "/articles" },
    { name: metadata.title, path: `/articles/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-[60rem] px-6 py-16 md:py-24 2xl:max-w-[75rem]">
      <JsonLd data={articleData} />
      <JsonLd data={breadcrumbData} />
      <ReadingProgressBar />
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        nativeButton={false}
        render={<Link href="/articles" />}
      >
        <ArrowLeft />
        Retour aux articles
      </Button>
      <div className="relative rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] md:p-10">
        <BlueprintCorners />
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {metadata.title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {formatDate(metadata.date)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator className="my-8" />
        <ArticleTableOfContents>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <Post />
          </div>
        </ArticleTableOfContents>
      </div>
      <AdjacentArticlesNav
        olderArticle={olderArticle}
        newerArticle={newerArticle}
      />
    </article>
  );
}
