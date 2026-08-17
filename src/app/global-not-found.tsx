import "./globals.css";
import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import NotFoundArt from "@/app/[locale]/not-found";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { clientMessages } from "@/i18n/client-messages";
import { siteName } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { cn } from "@/lib/utils";

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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("errors.notFound");
  return { title: `${t("title")} · ${siteName}` };
}

/** Owns the whole document: this file is never composed with the `[locale]` layout. */
export default async function GlobalNotFound() {
  const [locale, messages, t] = await Promise.all([
    getLocale(),
    getMessages(),
    getTranslations("nav"),
  ]);

  return (
    <html
      lang={locale}
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
          locale={locale}
          messages={clientMessages(messages)}
        >
          <a
            href="#content"
            className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
          >
            {t("skipToContent")}
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
