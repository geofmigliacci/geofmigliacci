import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { LOCALES } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

const negotiate = createMiddleware(routing);

const isPrefixed = (pathname: string) =>
  LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

export default function proxy(request: NextRequest) {
  const response = negotiate(request);

  // On a prefixed URL this would replace Next's own `Vary`, not merge with it.
  if (!isPrefixed(request.nextUrl.pathname)) {
    response.headers.set("Vary", "Accept-Language, Cookie");
  }

  return response;
}

export const config = {
  // `$`-anchored: a blanket `.*\..*` would also exclude `/blog/foo.draft`.
  matcher: [
    "/((?!_next/|.*\\.(?:avif|ico|jpe?g|png|svg|txt|webp|webmanifest|xml)$).*)",
  ],
};
