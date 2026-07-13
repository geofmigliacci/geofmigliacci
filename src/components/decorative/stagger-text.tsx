"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

interface StaggerTextProps {
  text: string;
  /** Seconds before the first letter starts. */
  delay?: number;
  /** Seconds between consecutive letters. */
  stagger?: number;
  className?: string;
  letterClassName?: string;
}

/**
 * Reveals text letter by letter, each sliding up from behind a clipping
 * mask. Renders as a block-level line; screen readers should get the full
 * text from an aria-label on the parent (letters are aria-hidden).
 */
export function StaggerText({
  text,
  delay = 0,
  stagger = 0.04,
  className,
  letterClassName,
}: StaggerTextProps) {
  const reducedMotion = useReducedMotion();

  return (
    <span className={cn("block overflow-hidden", className)}>
      {text.split("").map((letter, index) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: letters repeat within a static string
          key={index}
          aria-hidden
          className={cn("inline-block will-change-transform", letterClassName)}
          initial={reducedMotion ? false : { y: "115%" }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.8,
            ease: EASE,
            delay: delay + index * stagger,
          }}
        >
          {letter === " " ? " " : letter}
        </motion.span>
      ))}
    </span>
  );
}
