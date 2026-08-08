"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import {
  LETTER_STAGGER,
  REVEAL_DELAY,
  StaggerText,
} from "@/components/decorative/stagger-text";
import { RecoveryAction } from "@/components/recovery-action";
import { EASE } from "@/lib/motion";

const LINES = ["ERREUR", "INATTENDUE"] as const;
const OUTLINE_LETTER =
  "text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]";

export default function RouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const lettersDone =
    REVEAL_DELAY + (LINES[0].length + LINES[1].length) * LETTER_STAGGER;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-shell">
      <div className="flex w-full flex-col items-center text-center">
        <motion.p
          className="font-mono text-xs tracking-eyebrow text-primary uppercase"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Anomalie détectée
          <span
            aria-hidden
            className="animate-caret-blink motion-reduce:animate-none"
          >
            _
          </span>
        </motion.p>
        <h1
          aria-label="Une erreur inattendue est survenue"
          className="mt-2 font-bold leading-[0.95] tracking-tight"
        >
          <StaggerText
            text={LINES[0]}
            delay={REVEAL_DELAY}
            stagger={LETTER_STAGGER}
            className="text-[clamp(3rem,14vw,10rem)]"
          />
          <StaggerText
            text={LINES[1]}
            delay={REVEAL_DELAY + LINES[0].length * LETTER_STAGGER}
            stagger={LETTER_STAGGER}
            className="text-[clamp(1.5rem,7vw,6rem)]"
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
            Quelque chose s'est cassé de notre côté. Réessayer suffit parfois.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Référence : {error.digest}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <RecoveryAction icon={RotateCcw} onClick={() => unstable_retry()}>
              Réessayer
            </RecoveryAction>
            <RecoveryAction icon={ArrowLeft} href="/">
              Accueil
            </RecoveryAction>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
