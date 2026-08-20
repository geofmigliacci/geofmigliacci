import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale, locale: explicit }) => {
  // `explicit` first: `requestLocale` reads headers, and `generateStaticParams` has none.
  const requested = explicit ?? (await requestLocale);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Required since v4: omitting it is the "Unable to find next-intl locale" error.
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
