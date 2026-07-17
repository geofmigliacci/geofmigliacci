import { DraftingCompass } from "lucide-react";
import type { Metadata } from "next";
import { ArticleExplorer } from "@/app/articles/_components/article-explorer";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getArticles } from "@/lib/articles";
import { openGraphBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "J'écris sur le développement et l'architecture logicielle, mais aussi la cuisine, les langues et la vie autour.",
  alternates: { canonical: "/articles" },
  openGraph: { ...openGraphBase, type: "website", url: "/articles" },
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-[60rem] px-6 py-16 md:py-24 2xl:max-w-[75rem]">
      <section className="relative flex flex-col items-start gap-4 rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none md:p-10">
        <BlueprintCorners />
        <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Articles
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          J'écris sur ce qui me passionne : le développement et l'architecture
          logicielle, mais aussi la cuisine, les langues et la vie autour.
        </p>
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
      <Empty className="border border-foreground/10 py-16">
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
