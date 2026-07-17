"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/format";

const CARD_STAGGER_MS = 75;
const CARD_STAGGER_CAP = 8;

export function ArticleExplorer({ articles }: { articles: ArticleMeta[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(
    () =>
      Array.from(new Set(articles.flatMap((article) => article.tags))).sort(),
    [articles],
  );

  const filteredArticles =
    selectedTags.length === 0
      ? articles
      : articles.filter((article) =>
          article.tags.some((tag) => selectedTags.includes(tag)),
        );

  return (
    <>
      {allTags.length > 1 && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Filtrer
          </span>
          <ToggleGroup
            multiple
            value={selectedTags}
            onValueChange={setSelectedTags}
            aria-label="Filtrer les articles par tag"
          >
            {allTags.map((tag) => (
              <ToggleGroupItem
                key={tag}
                value={tag}
                variant="outline"
                className="rounded-4xl data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {tag}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Réinitialiser les filtres"
              onClick={() => setSelectedTags([])}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      )}
      {filteredArticles.length === 0 ? (
        <NoMatches onReset={() => setSelectedTags([])} />
      ) : (
        <ArticleGrid articles={filteredArticles} />
      )}
    </>
  );
}

function NoMatches({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative mt-12 animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none">
      <BlueprintCorners />
      <Empty className="border border-foreground/10 py-16">
        <EmptyHeader>
          <EmptyTitle>Aucun article pour ces tags</EmptyTitle>
          <EmptyDescription>
            Essayez d'autres tags, ou réinitialisez le filtre.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={onReset}>
            <X />
            Réinitialiser les filtres
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function ArticleGrid({ articles }: { articles: ArticleMeta[] }) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {articles.map((article, index) => (
        <Link
          key={article.slug}
          href={`/articles/${article.slug}`}
          className="group relative animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards duration-600 ease-blueprint motion-reduce:animate-none"
          style={{
            animationDelay: `${Math.min(index, CARD_STAGGER_CAP) * CARD_STAGGER_MS}ms`,
          }}
        >
          <BlueprintCorners className="transition-colors group-hover:text-primary/70" />
          <Card className="h-full transition-colors group-hover:ring-foreground/25">
            <CardHeader>
              <CardDescription>
                {formatDate(article.date)} · {article.readingTime} min de
                lecture
              </CardDescription>
              <CardTitle className="text-xl">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {article.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
