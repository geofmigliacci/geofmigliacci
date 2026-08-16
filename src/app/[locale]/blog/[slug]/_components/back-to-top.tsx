"use client";

import { ArrowUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RISE = 12;

const beyondFirstScreen = (y: number) => y > window.innerHeight;

/** Mount outside any ancestor with `filter`/`transform`, or `position: fixed` scrolls away. */
export function BackToTop() {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const [passed, setPassed] = useState(false);

  // `useMotionValueEvent` fires on change only: a page opened at a fragment shows nothing.
  useEffect(() => {
    setPassed(beyondFirstScreen(scrollY.get()));
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setPassed(beyondFirstScreen(y));
  });

  return (
    <AnimatePresence>
      {passed && (
        <motion.div
          className="fixed right-6 bottom-6 z-40"
          initial={{ opacity: 0, y: reducedMotion ? 0 : RISE }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : RISE }}
        >
          <a
            href="#content"
            aria-label="Retour en haut de la page"
            // The base variant carries `border-transparent`: only tailwind-merge lets it lose.
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-lg" }),
            )}
          >
            <ArrowUp />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
