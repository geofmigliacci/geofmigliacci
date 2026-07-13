"use client";

import { Home } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { BlueprintArc } from "@/components/decorative/blueprint-arc";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { EASE, StaggerText } from "@/components/decorative/stagger-text";
import { Button } from "@/components/ui/button";

const LINES = ["404", "INTROUVABLE"] as const;
const LINE_DELAY = 0.15;
const LETTER_STAGGER = 0.04;

export default function NotFound() {
  const reducedMotion = useReducedMotion();
  const lettersDone =
    LINE_DELAY + (LINES[0].length + LINES[1].length) * LETTER_STAGGER;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col justify-center px-6 py-8 md:py-12">
      <BlueprintArc
        corner="bottom-left"
        delay={lettersDone + 0.2}
        className="size-[clamp(18rem,40vw,28rem)]"
      />
      <div className="relative mx-auto flex w-full max-w-[60rem] flex-col items-center p-6 text-center 2xl:max-w-[75rem]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lettersDone + 0.2, duration: 0.6, ease: EASE }}
        >
          <BlueprintCorners />
        </motion.div>
        <motion.p
          className="font-mono text-xs tracking-[0.35em] text-primary uppercase md:text-sm"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lettersDone, duration: 0.5, ease: EASE }}
        >
          Zone non cartographiée
          <span
            aria-hidden
            className="animate-caret-blink motion-reduce:animate-none"
          >
            _
          </span>
        </motion.p>
        <h1
          aria-label="Erreur 404 — page introuvable"
          className="mt-4 font-bold leading-[0.95] tracking-tight"
        >
          <StaggerText
            text={LINES[0]}
            delay={LINE_DELAY}
            stagger={LETTER_STAGGER}
            className="text-[clamp(4rem,18vw,13rem)]"
          />
          <StaggerText
            text={LINES[1]}
            delay={LINE_DELAY + LINES[0].length * LETTER_STAGGER}
            stagger={LETTER_STAGGER}
            className="text-[clamp(1.75rem,9vw,7.5rem)]"
            letterClassName="text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]"
          />
        </h1>
        <motion.div
          className="mt-10 flex flex-col items-center gap-6"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lettersDone + 0.1, duration: 0.6, ease: EASE }}
        >
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Button
            size="icon-lg"
            aria-label="Retour à l'accueil"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <Home />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
