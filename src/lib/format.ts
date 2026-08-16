import { LANGUAGE_TAG, type Locale } from "@/i18n/locales";

const formatters = new Map<Locale, Intl.DateTimeFormat>();

function formatter(locale: Locale): Intl.DateTimeFormat {
  const cached = formatters.get(locale);
  if (cached) return cached;

  const created = new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
    dateStyle: "long",
    timeZone: "UTC",
  });
  formatters.set(locale, created);
  return created;
}

/** Required, not defaulted: a forgotten argument would date an English page in French. */
export function formatDate(iso: string, locale: Locale): string {
  return formatter(locale).format(new Date(iso));
}
