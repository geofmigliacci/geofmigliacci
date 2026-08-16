"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogPostSummary } from "@/components/blog-post-summary";
import { CoverBand } from "@/components/cover-band";
import { AccentRule } from "@/components/decorative/accent-rule";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";

/** Never the visible empty state verbatim: both sit in the DOM, and a reader hears both. */
function announceCount(count: number): string {
  if (count === 0) {
    return "Aucun billet ne correspond";
  }
  return count > 1 ? `${count} billets affichés` : "1 billet affiché";
}

export function BlogPostExplorer({ posts }: { posts: BlogPostMeta[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  );

  const filteredPosts =
    selectedTags.length === 0
      ? posts
      : posts.filter((post) =>
          post.tags.some((tag) => selectedTags.includes(tag)),
        );

  return (
    <>
      {allTags.length > 1 && (
        <div className="mt-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-eyebrow text-primary uppercase">
              Filtrer
            </span>
            <AccentRule />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <ToggleGroup
              multiple
              value={selectedTags}
              onValueChange={setSelectedTags}
              aria-label="Filtrer les billets par tag"
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
                <X />
              </Button>
            )}
          </div>
        </div>
      )}
      {/* Outside the branch: a live region only announces mutations it is mounted for. */}
      <p aria-live="polite" className="sr-only">
        {announceCount(filteredPosts.length)}
      </p>
      {filteredPosts.length === 0 ? (
        <NoMatches onReset={() => setSelectedTags([])} />
      ) : (
        <PostGrid posts={filteredPosts} />
      )}
    </>
  );
}

function NoMatches({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-12 enter-rise">
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyTitle>Aucun billet pour ces tags</EmptyTitle>
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

function PostGrid({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <ul className="mt-12 divide-y divide-border border-t border-b border-border">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-6 enter-rise py-8"
          >
            {/* `alt=""` on purpose: the band sits inside the link, and would bury the title. */}
            <CoverBand
              cover={post.cover}
              alt=""
              position={post.coverPosition}
              eager={index === 0}
              interactive
            />
            {/* `BlogPostSummary` returns a fragment: without this wrapper each child flexes. */}
            <div>
              <BlogPostSummary post={post} titleAs="h2" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
