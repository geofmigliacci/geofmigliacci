"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { GLYPH_PATH, GLYPH_STROKE_WIDTH, GLYPH_VIEW_BOX } from "@/lib/glyph";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DRAW_DURATION = 1.8;
const PEN_WIDTH = 0.4;
const INK_DELAY = DRAW_DURATION - 0.1;
const INK_DURATION = 0.5;

export function Logo({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const gradientId = useId();

  return (
    <svg
      viewBox={GLYPH_VIEW_BOX}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <linearGradient
        id={gradientId}
        x1="0"
        y1="1"
        x2="1"
        y2="0"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0%" stopColor="var(--brand-gradient-from)" />
        <stop offset="100%" stopColor="var(--brand-gradient-to)" />
      </linearGradient>
      <motion.path
        d={GLYPH_PATH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        initial={
          reducedMotion
            ? false
            : { pathLength: 0, fillOpacity: 0, strokeWidth: PEN_WIDTH }
        }
        animate={{
          pathLength: 1,
          fillOpacity: 1,
          strokeWidth: GLYPH_STROKE_WIDTH,
        }}
        transition={{
          pathLength: { duration: DRAW_DURATION, ease: "easeInOut" },
          fillOpacity: { delay: INK_DELAY, duration: INK_DURATION, ease: EASE },
          strokeWidth: { delay: INK_DELAY, duration: INK_DURATION, ease: EASE },
        }}
      />
    </svg>
  );
}
