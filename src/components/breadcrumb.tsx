"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { EASE } from "@/components/decorative/stagger-text";
import { cn } from "@/lib/utils";

const ITEM_STAGGER = 0.06;
const ITEM_DURATION = 0.5;
const ITEM_OFFSET_X = 8;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("font-mono text-xs", className)}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const reveal = {
            initial: reducedMotion ? false : { opacity: 0, x: ITEM_OFFSET_X },
            animate: { opacity: 1, x: 0 },
            transition: {
              duration: ITEM_DURATION,
              ease: EASE,
              delay: index * ITEM_STAGGER,
            },
          };

          return index === lastIndex ? (
            <motion.li
              key={item.path}
              aria-current="page"
              className="text-foreground"
              {...reveal}
            >
              {item.name}
            </motion.li>
          ) : (
            <motion.li
              key={item.path}
              className="flex items-center gap-2"
              {...reveal}
            >
              <Link
                href={item.path}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
              <span aria-hidden className="text-foreground/30">
                /
              </span>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
