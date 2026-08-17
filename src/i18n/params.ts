import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import type { Locale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

/**
 * `PageProps` and friends type `[locale]` as `string`, since a folder name says
 * nothing about which values are legal. This is the narrowing the i18n guide
 * prescribes for exactly that: a 404 rather than a runtime error deeper in.
 */
export function toLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}
