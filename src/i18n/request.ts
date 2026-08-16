import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale, locale: explicit }) => {
  // `explicit` first: `requestLocale` reads headers, and a caller that named the
  // locale may be running where there is no request, as `generateStaticParams` is.
  const requested = explicit ?? (await requestLocale);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Returning `locale` is required since v4: omitting it is the "Unable to
  // find next-intl locale" error, which names neither this file nor the cause.
  // Dates go through `lib/format` rather than `useFormatter`, which pins the
  // time zone to UTC: a viewer west of it would otherwise read the day before.
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
