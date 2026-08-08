import { DraftingCompass, Rss } from "lucide-react";
import type { Metadata } from "next";
import { BlogPostExplorer } from "@/app/blog/_components/blog-post-explorer";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getBlogPosts } from "@/lib/blog";
import { blogJsonLd, breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { blogDescription, openGraphBase, rssAlternate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: blogDescription,
  alternates: { canonical: "/blog", types: rssAlternate },
  openGraph: { ...openGraphBase, type: "website", url: "/blog" },
};

export default async function PostsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="page-shell">
      <JsonLd data={graph(breadcrumbJsonLd("/blog"), blogJsonLd())} />
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
          render={
            // biome-ignore lint/a11y/useAnchorContent: Base UI merges the Button children into the rendered anchor
            <a href="/feed.xml" />
          }
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
