import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.geofmigliacci.dev",
);

export const openGraphBase = {
  siteName: "Geoffrey Migliacci",
  locale: "fr_FR",
} satisfies Metadata["openGraph"];

export const rssAlternate = {
  "application/rss+xml": "/feed.xml",
} satisfies NonNullable<Metadata["alternates"]>["types"];

export const person = {
  name: "Geoffrey Migliacci",
  url: siteUrl.href,
  image: new URL("/geofmigliacci.jpg", siteUrl).href,
  jobTitle: "Ingénieur logiciel senior",
  email: "mailto:geoffrey.migliacci@gmail.com",
  sameAs: [
    "https://github.com/geofmigliacci",
    "https://www.linkedin.com/in/geofmigliacci/",
  ],
};
