export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.geofmigliacci.dev",
);

export const siteName = "Geoffrey Migliacci";

export const HOME_PATH = "/";

/** Paths only: the names are translated, under `nav.sections`. */
export const SECTION_PATHS = {
  blog: "/blog",
  about: "/about",
  legal: "/legal",
  privacyPolicy: "/privacy-policy",
} as const;

export type SectionKey = keyof typeof SECTION_PATHS;

export const SECTION_KEYS = Object.keys(SECTION_PATHS) as SectionKey[];

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

export const repoUrl = "https://github.com/geofmigliacci/geofmigliacci.dev";

export const social = {
  github: "https://github.com/geofmigliacci",
  linkedin: "https://www.linkedin.com/in/geofmigliacci/",
};

/** Identity only. Anything a reader sees in their own language is in `messages`. */
export const person = {
  name: "Geoffrey Migliacci",
  alternateName: "geofmigliacci",
  image: new URL(portraitPath, siteUrl).href,
  email: `mailto:${contactEmail}`,
  sameAs: [social.github, social.linkedin],
};
