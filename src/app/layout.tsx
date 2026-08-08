import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { openGraphBase, siteUrl, tagline } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { cn } from "@/lib/utils";

// `latin-ext` because the copy is French: the accented glyphs sit outside `latin`.
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

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Geoffrey Migliacci",
    template: "%s · Geoffrey Migliacci",
  },
  description: tagline,
  openGraph: { ...openGraphBase, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#4e4ea4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
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
        <a
          href="#content"
          className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          Aller au contenu
        </a>
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
