export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

/** next-intl writes this itself; named here so the privacy policy can cite it. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Regional, unlike the URL segment and every `hreflang`. */
export const LANGUAGE_TAG: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export const stripLocale = (pathname: string): string => {
  const [, first, ...rest] = pathname.split("/");
  return LOCALES.includes(first as Locale) ? `/${rest.join("/")}` : pathname;
};

/** Prefixes a locale-less path. `/` would otherwise give `/en/`, which redirects. */
export const localePath = (locale: Locale, path: string): string =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
};
