import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { openGraphBase, siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Geoffrey Migliacci",
    template: "Geoffrey Migliacci — %s",
  },
  description:
    "J'écris sur le code, la cuisine, les langues, la philosophie — tout ce qui nourrit ma curiosité et la vie autour.",
  openGraph: { ...openGraphBase, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("dark", fontSans.variable, fontMono.variable)}
    >
      <body className="blueprint-grid antialiased">
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
