import { DraftingCompass, Rss } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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
import { getBlogPosts } from "@/lib/blog";
import { blogJsonLd, breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { blogDescription } from "@/lib/site";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog",
    description: blogDescription,
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

  const posts = await getBlogPosts(locale);

  return (
    <div className="page-shell">
      <JsonLd
        data={graph(
          breadcrumbJsonLd({ locale, path: "/blog" }),
          blogJsonLd(locale),
        )}
      />
      <section className="flex flex-col gap-6 enter-rise md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Blog
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            J'écris sur ce qui me passionne : le développement et l'architecture
            logicielle, mais aussi les langues et la vie autour.
          </p>
        </div>
        <Button
          size="icon-lg"
          variant="outline"
          aria-label="S'abonner au flux RSS"
          nativeButton={false}
          render={<a href={localePath(locale, "/feed.xml")} />}
        >
          <Rss aria-hidden />
        </Button>
      </section>
      {posts.length === 0 ? <EmptyState /> : <BlogPostExplorer posts={posts} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 enter-rise">
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DraftingCompass />
          </EmptyMedia>
          <EmptyTitle>Aucun billet pour le moment</EmptyTitle>
          <EmptyDescription>
            Le premier est sur la planche à dessin : revenez bientôt.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
