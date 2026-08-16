export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

/** next-intl writes this itself; named here so the privacy policy can cite it. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * BCP 47, for `Intl` and schema.org `inLanguage`, which both reject the bare
 * subtag the URL carries. Regional here only: `hreflang` stays `en`, so the
 * English pages are offered to every English speaker rather than to the US.
 */
export const LANGUAGE_TAG: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

/** Drops any locale prefix, whichever locale it names. */
export const stripLocale = (pathname: string): string => {
  const [, first, ...rest] = pathname.split("/");
  return LOCALES.includes(first as Locale) ? `/${rest.join("/")}` : pathname;
};

/** Prefixes a locale-less path. `/` would otherwise give `/en/`, which redirects. */
export const localePath = (locale: Locale, path: string): string =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

/** Open Graph wants the underscored form, which is why it cannot reuse the above. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
};
