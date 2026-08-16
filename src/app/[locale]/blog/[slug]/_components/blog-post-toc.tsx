"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TocItem } from "rehype-mdx-toc";
import { AccentRule } from "@/components/decorative/accent-rule";
import { cn } from "@/lib/utils";

// The `-32px` mirrors `scroll-mt-8`, so a clicked heading lands on the line that activates it.
const HEADING_BAND = "-32px 0px -70% 0px";

type LinkableItem = TocItem & { id: string };

/** `rehype-mdx-toc` sees markdown headings only, so JSX titles never reach `items`. */
export function BlogPostToc({ items }: { items: TocItem[] }) {
  const entries = useMemo(
    () => items.filter((item): item is LinkableItem => Boolean(item.id)),
    [items],
  );
  const activeId = useActiveHeading(entries);

  if (entries.length === 0) {
    return null;
  }

  return (
    // `self-start`, or the grid stretches this and the sticky box has nothing to travel in.
    <aside className="sticky top-8 hidden self-start lg:flex lg:flex-col lg:gap-4">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs leading-none tracking-eyebrow text-primary uppercase">
          Sommaire
        </span>
        <AccentRule />
      </div>
      <nav aria-label="Sommaire">
        <ol className="m-0 flex list-none flex-col gap-2 border-l border-border p-0 ps-4">
          {entries.map((entry) => {
            const active = entry.id === activeId;
            return (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "block text-sm leading-snug transition-colors",
                    // Depth, not rhythm between siblings.
                    entry.depth > 2 && "ps-4",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {entry.value}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}

function useActiveHeading(entries: LinkableItem[]): string | undefined {
  const [activeId, setActiveId] = useState<string>();
  const visible = useRef(new Set<string>());

  // A primitive, or a fresh `toc` array rebuilds the observer on every render.
  const ids = entries.map((entry) => entry.id).join(",");

  useEffect(() => {
    const order = ids.split(",").filter(Boolean);
    const seen = visible.current;
    seen.clear();

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const { id } = record.target;
          if (record.isIntersecting) {
            seen.add(id);
          } else {
            seen.delete(id);
          }
        }

        const first = order.find((id) => seen.has(id));
        // Held, not cleared: a section longer than the band has no heading in view.
        if (first) {
          setActiveId(first);
        }
      },
      { rootMargin: HEADING_BAND },
    );

    for (const id of order) {
      const heading = document.getElementById(id);
      if (heading) {
        observer.observe(heading);
      }
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
