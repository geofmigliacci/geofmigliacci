"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { AboutPhotos } from "@/app/about/_components/about-photos";
import {
  LETTER_STAGGER,
  REVEAL_DELAY,
  StaggerText,
} from "@/components/decorative/stagger-text";
import { SocialLinks } from "@/components/social-links";
import { EASE } from "@/lib/motion";
import { pitch, portraitPath, tagline } from "@/lib/site";

const NAME_LINES = ["GEOFFREY", "MIGLIACCI"] as const;
const NAME_SIZE =
  "text-[clamp(2rem,7vw,4.5rem)] 2xl:text-[clamp(2rem,7vw,5rem)]";
const OUTLINE_LETTER =
  "text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const lettersDone =
    REVEAL_DELAY +
    (NAME_LINES[0].length + NAME_LINES[1].length) * LETTER_STAGGER;

  return (
    <section className="page-shell">
      <div className="w-full">
        <motion.div
          className="flex flex-col items-start gap-6 xl:flex-row xl:gap-8"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="relative size-40 shrink-0 overflow-hidden md:size-52 xl:size-56">
            <Image
              src={portraitPath}
              alt="Portrait de Geoffrey Migliacci"
              fill
              priority
              sizes="(min-width: 1280px) 224px, (min-width: 768px) 208px, 160px"
              className="object-cover grayscale contrast-125"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-eyebrow text-primary uppercase">
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
                letterClassName={OUTLINE_LETTER}
              />
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              +7 ans d'expérience · Performance · CQRS · Clean Architecture
            </p>
          </div>
        </motion.div>
        {/* `36rem` is `max-w-xl`, so the prose keeps exactly the measure it had
            before the photo column existed. Two columns only from `lg`: at `md`
            the leftover width is ~144px, too narrow to put a photograph in. */}
        {/* A plain grid, not a `motion.div`: the photo column animates on scroll,
            and wrapping it in the prose reveal would run that entry inside the
            ~0.9s where the whole cell is still at `opacity: 0`. */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,36rem)_1fr]">
          <motion.div
            className="flex flex-col items-start gap-6"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: lettersDone + 0.1, duration: 0.6, ease: EASE }}
          >
            <p className="max-w-xl text-lg text-foreground md:text-xl">
              {pitch}
            </p>
            <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
              {tagline}
            </p>
            <div className="flex max-w-xl flex-col gap-4 text-muted-foreground">
              <p>
                J'ai appris à coder vers 13 ans sur un serveur SA:MP, puis sur
                des projets FiveM : deux mods multijoueurs pour GTA, où quelques
                centaines de joueurs partagent le même serveur. Mes premiers
                utilisateurs, donc, et la découverte qu'il suffit d'une poignée
                de joueurs en plus pour faire tomber ce qui marchait très bien
                tout seul. Depuis, c'est du .NET, surtout du backend.
              </p>
              <p>
                Si je ne suis pas devant mon écran, vous me trouverez
                probablement en train de randonner quelque part... ou de jouer à
                des jeux quand je n'essaie pas d'en fabriquer.
              </p>
              <p>Si quelque chose ici vous parle, écrivez-moi. Je réponds.</p>
            </div>
            <SocialLinks />
          </motion.div>
          <AboutPhotos />
        </div>
      </div>
    </section>
  );
}
