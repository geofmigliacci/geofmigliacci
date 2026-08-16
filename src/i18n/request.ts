import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Returning `locale` is required since v4: omitting it is the "Unable to
  // find next-intl locale" error, which names neither this file nor the cause.
  // Dates go through `lib/format` rather than `useFormatter`: routing on `en`
  // would format them the US way, and `en-GB` does not belong in a URL.
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
