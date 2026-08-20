import type { Metadata } from "next";
import { LOCALES, type Locale, localePath, OG_LOCALE } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { siteName } from "@/lib/site";

export const rssAlternate = (locale: Locale) =>
  ({
    "application/rss+xml": localePath(locale, "/feed.xml"),
  }) satisfies NonNullable<Metadata["alternates"]>["types"];

export const openGraphBase = (locale: Locale) =>
  ({
    siteName,
    locale: OG_LOCALE[locale],
    alternateLocale: LOCALES.filter((other) => other !== locale).map(
      (other) => OG_LOCALE[other],
    ),
  }) satisfies Metadata["openGraph"];

export const defaultAmong = (locales: readonly Locale[]): Locale => {
  const [first] = locales;
  // A cluster of nothing would resolve to `/undefined/...` and typecheck.
  if (!first) throw new Error("An alternates cluster needs a locale.");

  return locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : first;
};

/** Relative: `metadataBase` on the layout is what makes these absolute. */
export function alternatesFor(
  path: string,
  locale: Locale,
  locales: readonly Locale[] = LOCALES,
): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(defaultAmong(locales), path),
    },
    types: rssAlternate(locale),
  };
}
