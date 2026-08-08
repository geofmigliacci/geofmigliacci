"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

const SPRING = { stiffness: 100, damping: 30, restDelta: 0.001 };

/** Mount outside any ancestor with `filter`/`transform`, or this tracks that instead of the viewport. */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const smoothed = useSpring(scrollYProgress, SPRING);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-0.75 overflow-hidden bg-foreground/10"
    >
      <motion.div
        className="h-full origin-left bg-primary"
        style={{ scaleX: reducedMotion ? scrollYProgress : smoothed }}
      />
    </div>
  );
}
