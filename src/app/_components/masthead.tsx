import Image from "next/image";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Button } from "@/components/ui/button";

export function Masthead() {
  return (
    <section className="relative flex flex-col gap-6 rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] animate-in fade-in slide-in-from-bottom-3 duration-600 ease-blueprint motion-reduce:animate-none md:flex-row md:items-center md:justify-between md:p-10">
      <BlueprintCorners />
      <div className="flex items-center gap-5">
        <div className="relative size-20 shrink-0 overflow-hidden md:size-24">
          <BlueprintCorners />
          <Image
            src="/geofmigliacci.jpg"
            alt="Portrait de Geoffrey Migliacci"
            fill
            priority
            sizes="(min-width: 768px) 96px, 80px"
            className="object-cover grayscale contrast-125"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-[0.35em] text-primary uppercase">
            Ingénieur logiciel senior
          </p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Geoffrey Migliacci
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            +7 ans d'expérience · Performance · CQRS · Clean Architecture
          </p>
        </div>
      </div>
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
    </section>
  );
}
