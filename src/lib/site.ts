import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.geofmigliacci.dev",
);

export const siteName = "Geoffrey Migliacci";

export const openGraphBase = {
  siteName,
  locale: "fr_FR",
} satisfies Metadata["openGraph"];

/** Schema.org wants BCP 47, so the `fr_FR` above cannot stand in. */
export const siteLanguage = "fr-FR";

export const rssAlternate = {
  "application/rss+xml": "/feed.xml",
} satisfies NonNullable<Metadata["alternates"]>["types"];

/** Bare address, for display. `person.email` needs the `mailto:` schema.org form. */
export const contactEmail = "geoffrey.migliacci@gmail.com";

/** The LCEN requires the host's address, so a stale value is worse than none. */
export const host = {
  name: "Vercel Inc.",
  address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  url: "https://vercel.com",
  privacyUrl: "https://vercel.com/legal/privacy-policy",
};

/** For `next/image`, which rejects `person.image` as a remote host. */
export const portraitPath = "/geofmigliacci.jpg";

export const tagline =
  "J'écris sur le code, les langues, la philosophie : tout ce qui nourrit ma curiosité et la vie autour.";

export const blogDescription =
  "J'écris sur le développement et l'architecture logicielle, mais aussi les langues et la vie autour.";

export const pitch =
  "Je conçois des systèmes .NET capables d'absorber la charge sans broncher : de l'architecture backend jusqu'à l'interface.";

export const repoUrl = "https://github.com/geofmigliacci/geofmigliacci.dev";

export const social = {
  github: "https://github.com/geofmigliacci",
  linkedin: "https://www.linkedin.com/in/geofmigliacci/",
};

export const profileUrl = new URL("/about", siteUrl).href;

export const person = {
  name: "Geoffrey Migliacci",
  alternateName: "geofmigliacci",
  url: profileUrl,
  image: new URL(portraitPath, siteUrl).href,
  jobTitle: "Ingénieur logiciel senior",
  description: pitch,
  email: `mailto:${contactEmail}`,
  knowsAbout: [
    ".NET",
    "ASP.NET Core",
    "Entity Framework Core",
    "SQL",
    "Architecture logicielle",
    "Performance applicative",
  ],
  sameAs: [social.github, social.linkedin],
};
