import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { person } from "@/lib/site";

/**
 * One manifest, in the default locale: it is a single route with no segment to
 * read a locale from. `start_url` stays bare so an installed app still
 * negotiates, and a French visitor lands on `/fr`.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "site",
  });

  return {
    id: "/",
    name: person.name,
    short_name: "Migliacci",
    description: t("tagline"),
    lang: routing.defaultLocale,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcfd",
    theme_color: "#4e4ea4",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
