import fs from "node:fs";
import path from "node:path";

// Spelt out: importing it from `layout.tsx` leaves every title assertion vacuous.
export const TITLE_SUFFIX = " · Geoffrey Migliacci";

export interface StaticPage {
  path: string;
  /** Accessible name of the `h1`, which on home and about is an `aria-label`. */
  heading: string;
  title: string;
}

export const STATIC_PAGES: StaticPage[] = [
  {
    path: "/",
    heading: "Geoffrey Migliacci",
    // No suffix: a template skips the segment defining it, and both are root.
    title: "Geoffrey Migliacci · Ingénieur logiciel senior",
  },
  {
    path: "/about",
    heading: "Geoffrey Migliacci",
    title: `À propos${TITLE_SUFFIX}`,
  },
  {
    path: "/blog",
    heading: "Blog",
    title: `Blog${TITLE_SUFFIX}`,
  },
  {
    path: "/legal",
    heading: "Mentions légales",
    title: `Mentions légales${TITLE_SUFFIX}`,
  },
  {
    path: "/privacy-policy",
    heading: "Politique de confidentialité",
    title: `Politique de confidentialité${TITLE_SUFFIX}`,
  },
];

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Mirrors `listSlugs`, which is `server-only` and throws on import here. Drafts
 * are dropped unconditionally: the server under test is always a production build.
 */
export function publishedSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
    .map((entry) => entry.replace(/\.mdx$/, ""))
    .filter((slug) => !slug.endsWith(".draft"));
}
