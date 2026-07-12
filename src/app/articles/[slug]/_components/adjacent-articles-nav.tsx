import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlueprintCorners } from "@/components/blueprint-corners";
import { Card, CardContent } from "@/components/ui/card";
import type { ArticleMeta } from "@/lib/articles";
import { cn } from "@/lib/utils";

function AdjacentArticleCard({
  article,
  direction,
}: {
  article: ArticleMeta;
  direction: "older" | "newer";
}) {
  const isOlder = direction === "older";
  const Icon = isOlder ? ArrowLeft : ArrowRight;
  const label = isOlder ? "Article plus ancien" : "Article plus récent";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn("group relative", !isOlder && "sm:col-start-2")}
    >
      <BlueprintCorners className="transition-colors group-hover:text-primary/70" />
      <Card
        size="sm"
        className={cn(
          "h-full transition-colors group-hover:ring-foreground/25",
          !isOlder && "text-right",
        )}
      >
        <CardContent
          className={cn("flex flex-col gap-1", !isOlder && "items-end")}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isOlder && <Icon className="size-3.5" />}
            {label}
            {!isOlder && <Icon className="size-3.5" />}
          </span>
          <span className="font-medium">{article.title}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function AdjacentArticlesNav({
  olderArticle,
  newerArticle,
}: {
  olderArticle?: ArticleMeta;
  newerArticle?: ArticleMeta;
}) {
  if (!olderArticle && !newerArticle) {
    return null;
  }

  return (
    <nav
      aria-label="Navigation entre articles"
      className="mt-8 grid gap-4 sm:grid-cols-2"
    >
      {olderArticle ? (
        <AdjacentArticleCard article={olderArticle} direction="older" />
      ) : (
        <div aria-hidden />
      )}
      {newerArticle ? (
        <AdjacentArticleCard article={newerArticle} direction="newer" />
      ) : (
        <div aria-hidden />
      )}
    </nav>
  );
}
