import { defineRouting } from "next-intl/routing";
import { LOCALES } from "@/i18n/locales";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  // Both prefixed, so `/` negotiates rather than silently serving English.
  localePrefix: "always",
});
