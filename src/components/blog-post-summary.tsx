import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

/** Expects a `group` ancestor, or the title and arrow stop reacting to hover together. */
export function BlogPostSummary({
  post,
  titleAs: Title = "h3",
}: {
  post: BlogPostMeta;
  titleAs?: "h2" | "h3";
}) {
  return (
    <>
      <p className="font-mono text-xs text-muted-foreground">
        {formatDate(post.date)} · {post.readingTime} min de lecture
      </p>
      {/* `max-w-2xl` holds the title to the same measure as the description below it. */}
      <Title className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-balance transition-colors group-hover:text-primary md:text-3xl">
        {post.title}
      </Title>
      <p className="mt-3 max-w-2xl text-muted-foreground">{post.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
        Lire le billet
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </p>
    </>
  );
}
