import type { Metadata } from "next";
import { LOCALES, type Locale, localePath, OG_LOCALE } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { siteName } from "@/lib/site";

export const rssAlternate = (locale: Locale) =>
  ({
    "application/rss+xml": localePath(locale, "/feed.xml"),
  }) satisfies NonNullable<Metadata["alternates"]>["types"];

export const openGraphBase = (locale: Locale) =>
  ({ siteName, locale: OG_LOCALE[locale] }) satisfies Metadata["openGraph"];

/** Relative throughout: `metadataBase` on the layout is what makes these absolute. */
export function alternatesFor(
  path: string,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(routing.defaultLocale, path),
    },
    types: rssAlternate(locale),
  };
}
