"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, localePath, stripLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Two links rather than a select: at two locales a select needs JS to navigate
 * and is not crawlable, while anchors work without it and reinforce the hreflang
 * pair.
 *
 * Plain anchors, not next-intl's `Link`, because a locale switch has to replace
 * the document. A soft navigation remounts the `[locale]` layout, and React
 * re-applies `<html className>` over the `dark` class the theme boot script set
 * imperatively, dropping the reader into light mode. The proxy writes
 * `NEXT_LOCALE` on the document request, so the cookie survives the change.
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
          <a
            key={locale}
            href={localePath(locale, path)}
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
          </a>
        );
      })}
    </nav>
  );
}
