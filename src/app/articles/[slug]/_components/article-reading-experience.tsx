"use client";

import { motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/utils";

/**
 * Must be mounted outside any ancestor with `filter`/`backdrop-filter`/
 * `transform` (e.g. the article card's `backdrop-blur`) — those properties
 * create a new containing block for `position: fixed`, which would make
 * this track the ancestor instead of the viewport.
 */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[4.5rem] z-40 px-6"
    >
      <div className="mx-auto h-0.5 max-w-240 overflow-hidden bg-foreground/10 2xl:max-w-300">
        <motion.div
          className="h-full origin-left bg-primary"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </div>
  );
}

interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export function ArticleTableOfContents({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) {
      return;
    }

    const elements = container.querySelectorAll<HTMLHeadingElement>("h2, h3");
    const seen = new Set<string>();
    const found: Heading[] = Array.from(elements).map((el) => {
      if (!el.id) {
        let id = slugify(el.textContent ?? "");
        while (seen.has(id) || !id) {
          id = `${id || "section"}-${seen.size}`;
        }
        el.id = id;
      }
      seen.add(el.id);
      return {
        id: el.id,
        text: el.textContent ?? "",
        depth: el.tagName === "H2" ? 2 : 3,
      };
    });
    setHeadings(found);
  }, []);

  return (
    <>
      {headings.length > 1 && (
        <nav
          aria-label="Sommaire"
          className="mb-8 animate-in fade-in slide-in-from-bottom-3 rounded-xl p-4 ring-1 ring-foreground/10 duration-600 ease-blueprint motion-reduce:animate-none"
        >
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Sommaire
          </p>
          <ul className="flex flex-col gap-1.5 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.depth === 3 ? "ml-4" : undefined}
              >
                <a
                  href={`#${heading.id}`}
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
