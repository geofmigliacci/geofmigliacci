"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { BlueprintArc } from "@/components/decorative/blueprint-arc";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import {
  EASE,
  LETTER_STAGGER,
  REVEAL_DELAY,
  StaggerText,
} from "@/components/decorative/stagger-text";
import { Button } from "@/components/ui/button";

const NAME_LINES = ["GEOFFREY", "MIGLIACCI"] as const;
const NAME_SIZE =
  "text-[clamp(2rem,7vw,4.5rem)] 2xl:text-[clamp(2rem,7vw,5rem)]";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const lettersDone =
    REVEAL_DELAY +
    (NAME_LINES[0].length + NAME_LINES[1].length) * LETTER_STAGGER;

  return (
    <section className="relative isolate mx-auto w-full max-w-240 px-6 pt-16 pb-8 md:pt-24 2xl:max-w-300">
      <BlueprintArc
        corner="bottom-right"
        delay={lettersDone + 0.2}
        className="fixed size-[clamp(20rem,45vw,34rem)]"
      />
      <div className="relative w-full p-6">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lettersDone + 0.2, duration: 0.6, ease: EASE }}
        >
          <BlueprintCorners />
        </motion.div>
        <motion.div
          className="flex flex-col items-start gap-6 xl:flex-row xl:gap-8"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="relative size-40 shrink-0 overflow-hidden md:size-52 xl:size-56">
            <BlueprintCorners />
            <Image
              src="/geofmigliacci.jpg"
              alt="Portrait de Geoffrey Migliacci"
              fill
              priority
              sizes="(min-width: 1280px) 224px, (min-width: 768px) 208px, 160px"
              className="object-cover grayscale contrast-125"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-[0.35em] text-primary uppercase md:text-sm">
              Ingénieur logiciel senior
            </p>
            <h1
              aria-label="Geoffrey Migliacci"
              className="font-bold leading-[0.95] tracking-tight"
            >
              <StaggerText
                text={NAME_LINES[0]}
                delay={REVEAL_DELAY}
                stagger={LETTER_STAGGER}
                className={NAME_SIZE}
              />
              <StaggerText
                text={NAME_LINES[1]}
                delay={REVEAL_DELAY + NAME_LINES[0].length * LETTER_STAGGER}
                stagger={LETTER_STAGGER}
                className={NAME_SIZE}
                letterClassName="text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]"
              />
            </h1>
            <p className="font-mono text-xs text-muted-foreground md:text-sm">
              +7 ans d'expérience · Performance · CQRS · Clean Architecture
            </p>
          </div>
        </motion.div>
        <motion.div
          className="mt-10 flex flex-col items-start gap-6"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lettersDone + 0.1, duration: 0.6, ease: EASE }}
        >
          <p className="max-w-xl text-lg text-foreground md:text-xl">
            Je conçois des systèmes .NET capables d'absorber la charge sans
            broncher — de l'architecture backend jusqu'à l'interface.
          </p>
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            J'écris sur le code, la cuisine, les langues, la philosophie — tout
            ce qui nourrit ma curiosité et la vie autour.
          </p>
          <div className="flex gap-2">
            <Button
              size="icon-lg"
              variant="outline"
              aria-label="Me contacter par email"
              nativeButton={false}
              render={
                // biome-ignore lint/a11y/useAnchorContent: Base UI merges the Button children into the rendered anchor
                <a href="mailto:geoffrey.migliacci@gmail.com" />
              }
            >
              <FaEnvelope aria-hidden />
            </Button>
            <Button
              size="icon-lg"
              variant="outline"
              aria-label="GitHub"
              nativeButton={false}
              render={
                // biome-ignore lint/a11y/useAnchorContent: Base UI merges the Button children into the rendered anchor
                <a
                  href="https://github.com/geofmigliacci"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <FaGithub aria-hidden />
            </Button>
            <Button
              size="icon-lg"
              variant="outline"
              aria-label="LinkedIn"
              nativeButton={false}
              render={
                // biome-ignore lint/a11y/useAnchorContent: Base UI merges the Button children into the rendered anchor
                <a
                  href="https://www.linkedin.com/in/geofmigliacci/"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <FaLinkedinIn aria-hidden />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
