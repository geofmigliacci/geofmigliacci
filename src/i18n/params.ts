import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import type { Locale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

export function toLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}
