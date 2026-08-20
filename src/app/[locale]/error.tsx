"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import {
  LETTER_STAGGER,
  REVEAL_DELAY,
  StaggerText,
} from "@/components/decorative/stagger-text";
import { RecoveryAction } from "@/components/recovery-action";
import { EASE } from "@/lib/motion";

const OUTLINE_LETTER =
  "text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]";

export default function RouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("errors.runtime");
  const reducedMotion = useReducedMotion();
  // `overflow-hidden` clips line two rather than wrapping it: keep it under 11 characters.
  const lines = [t("lineOne"), t("lineTwo")] as const;
  const lettersDone =
    REVEAL_DELAY + (lines[0].length + lines[1].length) * LETTER_STAGGER;

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
          {t("eyebrow")}
          <span
            aria-hidden
            className="animate-caret-blink motion-reduce:animate-none"
          >
            _
          </span>
        </motion.p>
        <h1
          aria-label={t("heading")}
          className="mt-2 font-bold leading-[0.95] tracking-tight"
        >
          <StaggerText
            text={lines[0]}
            delay={REVEAL_DELAY}
            stagger={LETTER_STAGGER}
            className="text-[clamp(3rem,14vw,10rem)]"
          />
          <StaggerText
            text={lines[1]}
            delay={REVEAL_DELAY + lines[0].length * LETTER_STAGGER}
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
            {t("body")}
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              {t("reference")} {error.digest}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <RecoveryAction icon={RotateCcw} onClick={() => unstable_retry()}>
              {t("retry")}
            </RecoveryAction>
            <RecoveryAction icon={ArrowLeft} href="/">
              {t("home")}
            </RecoveryAction>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
