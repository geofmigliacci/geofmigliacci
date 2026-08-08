"use client";

import "./globals.css";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { useEffect } from "react";

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

/** Replaces the root layout, so nothing the layout provides is available here. */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="fr"
      className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`}
    >
      <body className="antialiased">
        <title>Erreur · Geoffrey Migliacci</title>
        <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
          <p className="font-mono text-xs tracking-eyebrow text-primary uppercase">
            Panne complète
          </p>
          <h1 className="font-bold leading-[0.95] tracking-tight">
            <span className="block text-[clamp(3rem,14vw,10rem)]">ERREUR</span>
            <span className="block text-[clamp(1.5rem,7vw,6rem)] text-transparent [-webkit-text-stroke:2px_var(--color-foreground)]">
              CRITIQUE
            </span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            Le site n'a pas pu s'afficher. Réessayer suffit parfois.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Référence : {error.digest}
            </p>
          )}
          <div className="flex gap-3 font-mono text-sm">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="rounded-md px-4 py-2 ring-1 ring-input transition-colors hover:text-primary"
            >
              Accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
