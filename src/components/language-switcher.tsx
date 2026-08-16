"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, stripLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Two links rather than a select: at two locales a select needs JS to navigate
 * and is not crawlable, while anchors work without it and reinforce the hreflang
 * pair. next-intl writes `NEXT_LOCALE` itself on a locale-switching navigation,
 * so nothing here touches the cookie.
 *
 * The hash is deliberately dropped: `rehype-slug` derives heading ids from their
 * text, so a translated post's fragments differ and a kept one lands nowhere.
 */
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
          <Link
            key={locale}
            href={path}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            // Still a link when current: clicking it re-asserts the preference.
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
          </Link>
        );
      })}
    </nav>
  );
}
