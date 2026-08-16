import { BlogPostSummary } from "@/components/blog-post-summary";
import { AccentRule } from "@/components/decorative/accent-rule";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

const PREVIOUS_POST_COUNT = 4;

export function LatestBlogPosts({ posts }: { posts: BlogPostMeta[] }) {
  const [featured, ...older] = posts;
  const previous = older.slice(0, PREVIOUS_POST_COUNT);

  return (
    <section className="mt-12">
      <div className="flex items-center gap-4 enter-rise">
        <h2 className="font-mono text-xs tracking-eyebrow text-primary uppercase">
          Derniers billets
        </h2>
        <AccentRule />
        <Link
          href="/blog"
          className="py-1 font-mono text-xs tracking-eyebrow text-muted-foreground uppercase underline-offset-4 hover:text-foreground hover:underline"
        >
          Tous les billets
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-border enter-rise border-t border-b border-border">
        <li>
          <Link href={`/blog/${featured.slug}`} className="group block py-8">
            <BlogPostSummary post={featured} />
          </Link>
        </li>
        {previous.map((post) => (
          <li key={post.slug}>
            <PreviousPost post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PreviousPost({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
    >
      <p className="font-mono text-xs text-muted-foreground sm:w-40 sm:shrink-0">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="sm:hidden">
          {" · "}
          {post.readingTime} min de lecture
        </span>
      </p>
      <h3 className="flex-1 font-medium text-balance transition-colors group-hover:text-primary">
        {post.title}
      </h3>
      <p className="hidden font-mono text-xs text-muted-foreground sm:block">
        {post.readingTime} min
      </p>
    </Link>
  );
}
