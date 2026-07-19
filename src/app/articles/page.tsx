import { DraftingCompass } from "lucide-react";
import type { Metadata } from "next";
import { FaRss } from "react-icons/fa6";
import { ArticleExplorer } from "@/app/articles/_components/article-explorer";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getArticles } from "@/lib/articles";
import { openGraphBase, rssAlternate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "J'écris sur le développement et l'architecture logicielle, mais aussi la cuisine, les langues et la vie autour.",
  alternates: { canonical: "/articles", types: rssAlternate },
  openGraph: { ...openGraphBase, type: "website", url: "/articles" },
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-240 px-6 py-16 md:py-24 2xl:max-w-300">
      <section className="relative flex flex-col gap-6 rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none md:flex-row md:items-center md:justify-between md:p-10">
        <BlueprintCorners />
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Articles
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            J'écris sur ce qui me passionne : le développement et
            l'architecture logicielle, mais aussi la cuisine, les langues et la
            vie autour.
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
          <FaRss aria-hidden />
        </Button>
      </section>
      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <ArticleExplorer articles={articles} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative mt-12 animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none">
      <BlueprintCorners />
      <Empty className="py-16 ring-1 ring-foreground/10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DraftingCompass />
          </EmptyMedia>
          <EmptyTitle>Aucun article pour le moment</EmptyTitle>
          <EmptyDescription>
            Le premier est sur la planche à dessin — revenez bientôt.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
