"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const LETTER_STAGGER = 0.04;
export const REVEAL_DELAY = 0.15;

interface StaggerTextProps {
  text: string;
  /** Seconds before the first letter starts. */
  delay?: number;
  /** Seconds between consecutive letters. */
  stagger?: number;
  className?: string;
  letterClassName?: string;
}

/** The letters are `aria-hidden`, so the parent has to carry an `aria-label`. */
export function StaggerText({
  text,
  delay = 0,
  stagger = LETTER_STAGGER,
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
