import { DraftingCompass, Rss } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogPostExplorer } from "@/app/[locale]/blog/_components/blog-post-explorer";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { type Locale, localePath } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/lib/blog";
import { blogJsonLd, breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("nav.sections.blog.name"),
    description: t("site.blogDescription"),
    alternates: alternatesFor("/blog", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/blog"),
    },
  };
}

export default async function PostsPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, ctx, t] = await Promise.all([
    getBlogPosts(locale),
    jsonLdContext(locale),
    getTranslations("blog.list"),
  ]);

  return (
    <div className="page-shell">
      <JsonLd
        data={graph(breadcrumbJsonLd(ctx, { path: "/blog" }), blogJsonLd(ctx))}
      />
      <section className="flex flex-col gap-6 enter-rise md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {t("heading")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            {t("intro")}
          </p>
        </div>
        <Button
          size="icon-lg"
          variant="outline"
          aria-label={t("rss")}
          nativeButton={false}
          render={<Link href="/feed.xml" />}
        >
          <Rss aria-hidden />
        </Button>
      </section>
      {posts.length === 0 ? <EmptyState /> : <BlogPostExplorer posts={posts} />}
    </div>
  );
}

function EmptyState() {
  const t = useTranslations("blog.list.empty");

  return (
    <div className="mt-12 enter-rise">
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DraftingCompass />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("description")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
