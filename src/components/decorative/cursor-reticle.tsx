"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 380, damping: 32, mass: 0.5 };
const IDLE_HIDE_MS = 900;
const OFFSCREEN = -100;
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, select, textarea, label, summary";

export function CursorReticle() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const x = useMotionValue(OFFSCREEN);
  const y = useMotionValue(OFFSCREEN);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const coordsRef = useRef<HTMLSpanElement>(null);

  const updateCoords = () => {
    if (coordsRef.current) {
      coordsRef.current.textContent = `X ${Math.round(springX.get())} · Y ${Math.round(springY.get())}`;
    }
  };
  useMotionValueEvent(springX, "change", updateCoords);
  useMotionValueEvent(springY, "change", updateCoords);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const onInteractive =
        event.target instanceof Element &&
        event.target.closest(INTERACTIVE_SELECTOR) !== null;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setLocked(onInteractive);
      clearTimeout(idleTimer.current);
      if (!onInteractive) {
        idleTimer.current = setTimeout(() => setVisible(false), IDLE_HIDE_MS);
      }
    };
    const handleLeave = () => {
      clearTimeout(idleTimer.current);
      setVisible(false);
      setLocked(false);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      clearTimeout(idleTimer.current);
    };
  }, [reducedMotion, x, y]);

  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className={cn(
        "-mt-5 -ml-5 pointer-events-none fixed top-0 left-0 z-60 size-10 transition-opacity duration-300",
        !visible && "opacity-0",
      )}
      style={{ x: springX, y: springY }}
    >
      <span
        className={cn(
          "blueprint-target transition-all duration-200 ease-blueprint",
          locked ? "scale-75 text-primary" : "text-primary/50",
        )}
      />
      <span
        ref={coordsRef}
        className={cn(
          "-translate-y-1/2 absolute top-1/2 left-full ml-2.5 whitespace-nowrap font-mono text-[10px] text-foreground/30 tracking-[0.2em] transition-opacity duration-200",
          locked && "opacity-0",
        )}
      />
      <span
        className={cn(
          "-translate-y-1/2 absolute top-1/2 left-full ml-2.5 whitespace-nowrap font-mono text-[10px] text-primary tracking-[0.2em] transition-opacity duration-200",
          !locked && "opacity-0",
        )}
      >
        LOCK
      </span>
    </motion.div>
  );
}
