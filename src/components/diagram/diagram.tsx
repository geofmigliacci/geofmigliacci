"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { EASE } from "@/components/decorative/stagger-text";
import {
  center,
  type Point,
  progressAlong,
  type Rect,
  withoutRepeats,
} from "@/components/diagram/geometry";
import { cn } from "@/lib/utils";

export type DiagramTone = "default" | "active" | "muted" | "alert";
export type FlowTone = "active" | "ghost";

export type { Point, Rect };

const NODE_SUBLABEL_DY = 8;
const NODE_LABEL_SHIFT = 4;

const NODE_STROKE: Record<DiagramTone, string> = {
  default: "stroke-foreground/20",
  active: "stroke-primary/50",
  muted: "stroke-foreground/12",
  alert: "stroke-destructive/60",
};

const NODE_TEXT: Record<DiagramTone, string> = {
  default: "fill-foreground",
  active: "fill-primary",
  muted: "fill-foreground/40",
  alert: "fill-destructive",
};

const FLOW_FILL: Record<FlowTone, string> = {
  active: "fill-primary",
  ghost: "fill-foreground/30",
};

export function DiagramFrame({
  controls,
  caption,
  children,
}: {
  controls?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="relative bg-card/50 p-5 ring-1 ring-foreground/10 backdrop-blur-[2px] sm:p-7">
        <BlueprintCorners />
        {controls ? (
          <div className="mb-7 flex justify-center sm:justify-end">
            {controls}
          </div>
        ) : null}
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function ModeToggle<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (next: T) => void;
  options: readonly { value: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <fieldset className="inline-flex ring-1 ring-foreground/15">
      <legend className="sr-only">{ariaLabel}</legend>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}

export function Meter({
  label,
  value,
  tone = "active",
}: {
  label: string;
  value: number;
  tone?: FlowTone;
}) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const fill = tone === "active" ? "bg-primary" : "bg-foreground/30";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground tabular-nums">{clamped}%</span>
      </div>
      <div className="h-1.5 w-full bg-foreground/10">
        <motion.div
          className={cn("h-full", fill)}
          initial={reducedMotion ? false : { width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>
    </div>
  );
}

export function Readout({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-3xl text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function SvgNode({
  rect,
  label,
  sublabel,
  tone = "default",
  badge,
}: {
  rect: Rect;
  label: string;
  sublabel?: string;
  tone?: DiagramTone;
  badge?: string;
}) {
  const { x, y, width } = rect;
  const c = center(rect);

  return (
    <g>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        strokeWidth={1}
        className={cn(
          "fill-card transition-colors duration-500",
          NODE_STROKE[tone],
        )}
      />
      <text
        x={c.x}
        y={sublabel ? c.y - NODE_LABEL_SHIFT : c.y}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          "font-mono text-[9px] uppercase tracking-widest transition-colors duration-500",
          NODE_TEXT[tone],
        )}
      >
        {label}
      </text>
      {sublabel ? (
        <text
          x={c.x}
          y={c.y + NODE_SUBLABEL_DY}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted-foreground font-mono text-[7px]"
        >
          {sublabel}
        </text>
      ) : null}
      {badge ? (
        <>
          <rect
            x={x + width - 6}
            y={y - 6}
            width={12}
            height={12}
            className="fill-destructive"
          />
          <text
            x={x + width}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-destructive-foreground font-mono text-[9px]"
          >
            {badge}
          </text>
        </>
      ) : null}
    </g>
  );
}

export function SvgEdge({
  points,
  cut = false,
}: {
  points: readonly Point[];
  cut?: boolean;
}) {
  return (
    <polyline
      points={points.map((point) => `${point.x},${point.y}`).join(" ")}
      fill="none"
      strokeWidth={1}
      strokeLinejoin="miter"
      strokeDasharray={cut ? "3 3" : undefined}
      className={cn(
        "transition-colors duration-500",
        cut ? "stroke-foreground/15" : "stroke-primary/40",
      )}
    />
  );
}

export function SvgPacket({
  points,
  travelMs,
  onArrive,
  tone = "active",
  size = 6,
}: {
  points: readonly Point[];
  travelMs: number;
  onArrive: () => void;
  tone?: FlowTone;
  size?: number;
}) {
  const path = withoutRepeats(points);
  const xs = path.map((point) => point.x - size / 2);
  const ys = path.map((point) => point.y - size / 2);
  const times = progressAlong(path);

  return (
    <motion.rect
      aria-hidden
      width={size}
      height={size}
      className={FLOW_FILL[tone]}
      initial={{ x: xs[0], y: ys[0] }}
      animate={{ x: xs, y: ys }}
      transition={{ duration: travelMs / 1000, ease: "linear", times }}
      onAnimationComplete={onArrive}
    />
  );
}

export interface StackBar {
  key: number | string;
  tone?: FlowTone;
}

export function SvgStack({
  items,
  x,
  top,
  width,
  barHeight = 7,
  gap = 3,
}: {
  items: readonly StackBar[];
  x: number;
  top: number;
  width: number;
  barHeight?: number;
  gap?: number;
}) {
  const reducedMotion = useReducedMotion();
  const barY = (index: number) => top + index * (barHeight + gap);

  if (reducedMotion) {
    return (
      <>
        {items.map((item, index) => (
          <rect
            key={item.key}
            x={x}
            y={barY(index)}
            width={width}
            height={barHeight}
            className={FLOW_FILL[item.tone ?? "active"]}
          />
        ))}
      </>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {items.map((item, index) => (
        <motion.rect
          key={item.key}
          x={x}
          width={width}
          height={barHeight}
          className={cn(
            "transition-colors duration-500",
            FLOW_FILL[item.tone ?? "active"],
          )}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
          initial={{ y: barY(index), opacity: 0, scaleX: 0.15 }}
          animate={{ y: barY(index), opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.15 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      ))}
    </AnimatePresence>
  );
}
