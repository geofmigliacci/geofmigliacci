export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * BCP 47, for `Intl` and schema.org `inLanguage`. The URL segment cannot stand
 * in: bare `en` formats a long date the US way, so the byline would read
 * "July 17, 2026" against the French "17 juillet 2026" and lose its rhythm.
 */
export const LANGUAGE_TAG: Record<Locale, string> = {
  en: "en-GB",
  fr: "fr-FR",
};

/** Open Graph wants the underscored form, which is why it cannot reuse the above. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  fr: "fr_FR",
};
