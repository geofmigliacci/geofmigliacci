import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export function LatestArticle({ article }: { article: ArticleMeta }) {
  return (
    <section className="mt-12">
      <div>
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none">
          <h2 className="font-mono text-xs tracking-[0.25em] text-primary uppercase">
            Dernier article
          </h2>
          <span aria-hidden className="h-px min-w-6 flex-1 bg-primary/20" />
          <Link
            href="/articles"
            className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase underline-offset-4 hover:text-foreground hover:underline"
          >
            Tous les articles
          </Link>
        </div>
        <Link
          href={`/articles/${article.slug}`}
          className="group relative mt-6 block animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none"
        >
          <BlueprintCorners className="transition-colors group-hover:text-primary/70" />
          <Card className="transition-colors group-hover:ring-foreground/25">
            <CardHeader>
              <CardDescription>
                {formatDate(article.date)} · {article.readingTime} min de
                lecture
              </CardDescription>
              <CardTitle className="text-2xl text-balance md:text-3xl">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="max-w-2xl text-muted-foreground">
                {article.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
                Lire l'article
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
