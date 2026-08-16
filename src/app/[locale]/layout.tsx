import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { clientMessages } from "@/i18n/client-messages";
import type { Locale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { openGraphBase } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { cn } from "@/lib/utils";

// `latin-ext` because the French copy's accented glyphs sit outside `latin`.
const fontSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
});
// No `weight` key: the face is variable across 300-700 and the whole axis ships.
const fontHeading = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    metadataBase: siteUrl,
    title: {
      default: "Geoffrey Migliacci",
      template: "%s · Geoffrey Migliacci",
    },
    description: t("tagline"),
    openGraph: { ...openGraphBase(locale), type: "website" },
    twitter: { card: "summary_large_image" },
    // Every post opens on a full-width cover, and `max-image-preview` is what
    // lets a result carry it rather than a thumbnail.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#4e4ea4",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Omitting this is silent: the page still renders, it just stops being static.
  setRequestLocale(locale);

  const [t, messages] = await Promise.all([
    getTranslations("nav"),
    getMessages(),
  ]);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
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
        <NextIntlClientProvider messages={clientMessages(messages)}>
          <a
            href="#content"
            className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
          >
            {t("skipToContent")}
          </a>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <main id="content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
