import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { LOCALES } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

const negotiate = createMiddleware(routing);

/** A URL that names its locale settles the question before negotiation runs. */
const isPrefixed = (pathname: string) =>
  LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

export default function proxy(request: NextRequest) {
  const response = negotiate(request);

  // Only where something was negotiated, which is the redirect off an
  // unprefixed path: next-intl sets no `Vary`, and without one a shared cache
  // can pin the language it chose for one visitor onto everybody behind them.
  //
  // A prefixed URL is deliberately left alone. Its response varies on neither
  // header, and writing one here does not merge with the `rsc,
  // next-router-state-tree, ...` list Next puts on its own responses, it
  // replaces it: an RSC payload would then cache under a key that cannot tell
  // it apart from the document. `append` does not avoid that, only not writing does.
  if (!isPrefixed(request.nextUrl.pathname)) {
    response.headers.set("Vary", "Accept-Language, Cookie");
  }

  return response;
}

export const config = {
  // The extension alternation is `$`-anchored on purpose: a blanket `.*\..*`
  // would also exclude `/blog/foo.draft`, which is how drafts are read locally.
  matcher: [
    "/((?!_next/|feed\\.xml|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|favicon\\.ico|icon\\.svg|apple-icon\\.png|about/|geofmigliacci\\.jpg|.*\\.(?:avif|ico|jpe?g|png|svg|txt|webp|webmanifest|xml)$).*)",
  ],
};
