"use client";

import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  LETTER_STAGGER,
  REVEAL_DELAY,
  StaggerText,
} from "@/components/decorative/stagger-text";
import { RecoveryAction } from "@/components/recovery-action";
import { EASE } from "@/lib/motion";

const LINES = ["404", "INTROUVABLE"] as const;
const OUTLINE_LETTER =
  "text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]";

export default function NotFound() {
  const reducedMotion = useReducedMotion();
  const lettersDone =
    REVEAL_DELAY + (LINES[0].length + LINES[1].length) * LETTER_STAGGER;

  return (
    <section className="page-shell">
      <div className="flex w-full flex-col items-center text-center">
        <motion.p
          className="font-mono text-xs tracking-eyebrow text-primary uppercase"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
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
          aria-label="Erreur 404 · page introuvable"
          className="mt-2 font-bold leading-[0.95] tracking-tight"
        >
          <StaggerText
            text={LINES[0]}
            delay={REVEAL_DELAY}
            stagger={LETTER_STAGGER}
            className="text-[clamp(4rem,18vw,13rem)]"
          />
          <StaggerText
            text={LINES[1]}
            delay={REVEAL_DELAY + LINES[0].length * LETTER_STAGGER}
            stagger={LETTER_STAGGER}
            className="text-[clamp(1.75rem,9vw,7.5rem)]"
            letterClassName={OUTLINE_LETTER}
          />
        </h1>
        <motion.div
          className="mt-12 flex flex-col items-center gap-6"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lettersDone + 0.1, duration: 0.6, ease: EASE }}
        >
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <RecoveryAction icon={ArrowLeft} href="/">
            Retour à l'accueil
          </RecoveryAction>
        </motion.div>
      </div>
    </section>
  );
}
