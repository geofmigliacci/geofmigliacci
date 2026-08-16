import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";
import { cn } from "@/lib/utils";

function AdjacentPostCard({
  post,
  direction,
}: {
  post: BlogPostMeta;
  direction: "older" | "newer";
}) {
  const isOlder = direction === "older";
  const Icon = isOlder ? ArrowLeft : ArrowRight;
  const label = isOlder ? "Billet plus ancien" : "Billet plus récent";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-primary/40",
        !isOlder && "items-end text-right sm:col-start-2",
      )}
    >
      <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        {isOlder && <Icon className="size-3.5" />}
        {label}
        {!isOlder && <Icon className="size-3.5" />}
      </span>
      {/* `font-heading` by hand: the base layer only reaches `h1`-`h4`, and this is a span. */}
      <span className="font-heading font-medium transition-colors group-hover:text-primary">
        {post.title}
      </span>
    </Link>
  );
}

export function AdjacentBlogPostsNav({
  olderPost,
  newerPost,
}: {
  olderPost?: BlogPostMeta;
  newerPost?: BlogPostMeta;
}) {
  if (!olderPost && !newerPost) {
    return null;
  }

  return (
    <nav
      aria-label="Navigation entre billets"
      className="mt-12 grid gap-4 sm:grid-cols-2"
    >
      {olderPost ? (
        <AdjacentPostCard post={olderPost} direction="older" />
      ) : (
        // Holds the column open only where there are two: stacked, it would add a bare `gap`.
        <div aria-hidden className="hidden sm:block" />
      )}
      {newerPost ? (
        <AdjacentPostCard post={newerPost} direction="newer" />
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}
    </nav>
  );
}
