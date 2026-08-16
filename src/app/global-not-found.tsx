import "./globals.css";
import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import NotFoundArt from "@/app/[locale]/not-found";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { cn } from "@/lib/utils";
import messages from "@/messages/fr.json";

const fontSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
});
const fontHeading = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Erreur 404 · Geoffrey Migliacci",
};

/**
 * An unmatched URL never reaches `[locale]`, so the layout cannot render it and
 * `[locale]/not-found.tsx` is never the boundary: Next serves its own default
 * instead. This file is what the docs prescribe when the root layout sits under
 * a top-level dynamic segment, and it owns the whole document, so the fonts and
 * the theme script are restated here the way `global-error.tsx` restates them.
 */
export default function GlobalNotFound() {
  return (
    <html
      lang={routing.defaultLocale}
      suppressHydrationWarning
      className={cn(
        "scroll-smooth motion-reduce:scroll-auto",
        fontSans.variable,
        fontHeading.variable,
        fontMono.variable,
      )}
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a blocking inline script is the only way to beat first paint
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider
          locale={routing.defaultLocale}
          messages={messages}
        >
          <a
            href="#content"
            className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
          >
            Aller au contenu
          </a>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <main id="content" className="flex-1">
              <NotFoundArt />
            </main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
