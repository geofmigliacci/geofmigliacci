import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const negotiate = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = negotiate(request);
  // next-intl sets no `Vary`, and without one a shared cache can pin the
  // language it negotiated for one visitor onto everybody who follows.
  // `append`, not `set`: Next puts its own `Vary` on a rendered page, and this
  // has no business replacing it.
  response.headers.append("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // The extension alternation is `$`-anchored on purpose: a blanket `.*\..*`
  // would also exclude `/blog/foo.draft`, which is how drafts are read locally.
  matcher: [
    "/((?!_next/|feed\\.xml|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|favicon\\.ico|icon\\.svg|apple-icon\\.png|about/|geofmigliacci\\.jpg|.*\\.(?:avif|ico|jpe?g|png|svg|txt|webp|webmanifest|xml)$).*)",
  ],
};
