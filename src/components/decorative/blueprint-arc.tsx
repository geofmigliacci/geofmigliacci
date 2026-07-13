"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { EASE } from "@/components/decorative/stagger-text";
import { cn } from "@/lib/utils";

type Corner = "top-left" | "top-right" | "bottom-right" | "bottom-left";

// Each path is a quarter-circle (cubic-bezier approximation) centered on
// the named corner of a 0-100 viewBox, sweeping 90° into the interior.
const ARC_PATHS: Record<Corner, string> = {
  "top-left": "M100,0 C100,55.228 55.228,100 0,100",
  "top-right": "M0,0 C0,55.228 44.772,100 100,100",
  "bottom-right": "M0,100 C0,44.772 44.772,0 100,0",
  "bottom-left": "M100,100 C100,44.772 55.228,0 0,0",
};

const CORNER_POSITION: Record<Corner, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
};

/**
 * A dotted quarter-circle "compass swing" centered on one corner of the
 * nearest positioned ancestor, curving into the interior — like a radius
 * mark drawn on a drafting sheet. The ancestor must be `relative`; size
 * comes from className (equal width/height, e.g. `size-[32rem]`).
 *
 * The dash pattern lives on a static path; a masked, animated path (using
 * Motion's `pathLength`) reveals it progressively, since applying
 * `pathLength` directly to a path with a custom `strokeDasharray` would
 * fight over the dash units.
 */
export function BlueprintArc({
  corner,
  delay = 0,
  className,
}: {
  corner: Corner;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const maskId = useId();
  const d = ARC_PATHS[corner];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn(
        "-z-10 pointer-events-none absolute text-foreground/15",
        CORNER_POSITION[corner],
        className,
      )}
    >
      <mask id={maskId}>
        <motion.path
          d={d}
          fill="none"
          stroke="white"
          strokeWidth={8}
          initial={reducedMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay }}
        />
      </mask>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="1 10"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
