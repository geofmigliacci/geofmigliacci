import Image from "next/image";
import { useTranslations } from "next-intl";
import { SocialLinks } from "@/components/social-links";
import { portraitPath } from "@/lib/site";

export function Masthead() {
  const t = useTranslations("site");

  return (
    <section className="flex flex-col gap-6 enter-rise md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-6">
        <div className="relative size-20 shrink-0 overflow-hidden md:size-24">
          <Image
            src={portraitPath}
            alt={t("portraitAlt")}
            fill
            priority
            sizes="(min-width: 768px) 96px, 80px"
            className="object-cover grayscale contrast-125"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-eyebrow text-primary uppercase">
            {t("jobTitle")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Geoffrey Migliacci
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {t("credentials")}
          </p>
        </div>
      </div>
      <SocialLinks />
    </section>
  );
}
