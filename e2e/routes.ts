import fs from "node:fs";
import path from "node:path";

// Spelt out: importing it from `layout.tsx` leaves every title assertion vacuous.
export const TITLE_SUFFIX = " · Geoffrey Migliacci";

export const LOCALES = ["en", "fr"] as const;
export const DEFAULT_LOCALE = "en";
export type Locale = (typeof LOCALES)[number];

/** Spelt out per locale, for the same reason as the suffix above. */
type PerLocale = Record<Locale, string>;

interface StaticPageCopy {
  path: string;
  /** Accessible name of the `h1`, which on home and about is an `aria-label`. */
  heading: PerLocale;
  title: PerLocale;
}

const HOME_TITLE = {
  en: "Geoffrey Migliacci · Senior software engineer",
  fr: "Geoffrey Migliacci · Ingénieur logiciel senior",
};

const STATIC_PAGE_COPY: StaticPageCopy[] = [
  {
    path: "/",
    heading: { en: "Geoffrey Migliacci", fr: "Geoffrey Migliacci" },
    // No suffix: a template skips the segment defining it, and both are root.
    title: HOME_TITLE,
  },
  {
    path: "/about",
    heading: { en: "Geoffrey Migliacci", fr: "Geoffrey Migliacci" },
    title: {
      en: `About${TITLE_SUFFIX}`,
      fr: `À propos${TITLE_SUFFIX}`,
    },
  },
  {
    path: "/blog",
    heading: { en: "Blog", fr: "Blog" },
    title: { en: `Blog${TITLE_SUFFIX}`, fr: `Blog${TITLE_SUFFIX}` },
  },
  {
    path: "/legal",
    heading: { en: "Legal notice", fr: "Mentions légales" },
    title: {
      en: `Legal notice${TITLE_SUFFIX}`,
      fr: `Mentions légales${TITLE_SUFFIX}`,
    },
  },
  {
    path: "/privacy-policy",
    heading: {
      en: "Privacy policy",
      fr: "Politique de confidentialité",
    },
    title: {
      en: `Privacy policy${TITLE_SUFFIX}`,
      fr: `Politique de confidentialité${TITLE_SUFFIX}`,
    },
  },
];

export interface StaticPage {
  locale: Locale;
  path: string;
  heading: string;
  title: string;
}

export const localePath = (locale: Locale, route: string): string =>
  route === "/" ? `/${locale}` : `/${locale}${route}`;

/** Every page under every locale: the suite is dominated by its build, not its assertions. */
export const STATIC_PAGES: StaticPage[] = LOCALES.flatMap((locale) =>
  STATIC_PAGE_COPY.map(({ path: route, heading, title }) => ({
    locale,
    path: localePath(locale, route),
    heading: heading[locale],
    title: title[locale],
  })),
);

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Mirrors `listSlugs`, which is `server-only` and throws on import here. Drafts
 * are dropped unconditionally: the server under test is always a production build.
 */
export function publishedSlugs(locale: Locale): string[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
    .map((entry) => entry.replace(/\.mdx$/, ""))
    .filter((slug) => !slug.endsWith(".draft"));
}

/** Locale and slug for every post the build actually emits a route for. */
export const publishedPosts = LOCALES.flatMap((locale) =>
  publishedSlugs(locale).map((slug) => ({ locale, slug })),
);
