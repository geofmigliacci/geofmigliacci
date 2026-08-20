"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, localePath, stripLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/** Plain anchors, not `Link`: a soft locale switch remounts the layout over the theme class. */
export function LanguageSwitcher() {
  const t = useTranslations("nav.language");
  const active = useLocale();
  const pathname = usePathname();
  const path = stripLocale(pathname);

  return (
    <nav aria-label={t("label")} className="flex items-center gap-0.5">
      {LOCALES.map((locale) => {
        const current = locale === active;

        return (
          <a
            key={locale}
            href={localePath(locale, path)}
            hrefLang={locale}
            lang={locale}
            aria-current={current ? "true" : undefined}
            aria-label={t(locale)}
            className={cn(
              "rounded-md px-1.5 py-1 font-mono text-xs uppercase transition-colors",
              current
                ? "text-foreground"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            {locale}
          </a>
        );
      })}
    </nav>
  );
}
