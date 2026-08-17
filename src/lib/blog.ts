import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { StaticImageData } from "next/image";
import { cache } from "react";
import type { TocItem } from "rehype-mdx-toc";
import type { CoverPosition } from "@/components/cover-band";
import { LOCALES, type Locale } from "@/i18n/locales";

/** TypeScript cannot see into MDX: `content/blog.test.ts` is what holds posts to this shape. */
export interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  updated?: string;
  cover: StaticImageData;
  coverAlt: string;
  coverCaption?: string;
  /** Which edge survives the band crop. A subject in the upper half needs `center`. */
  coverPosition?: CoverPosition;
}

export interface BlogPostMeta extends BlogPostMetadata {
  slug: string;
  readingTime: number;
  /** The locale the body is written in. A fallback makes it differ from the page's. */
  contentLocale: Locale;
}

export type BlogPostModule = {
  default: React.ComponentType;
  metadata: BlogPostMetadata;
  toc: TocItem[];
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 200;
// `m` because a cover import precedes the block: without it `^` only matches at offset 0.
const METADATA_EXPORT = /^export const metadata = \{[\s\S]*?\};/m;
const DRAFT_SUFFIX = ".draft";

const includeDrafts = process.env.NODE_ENV !== "production";

export const isDraft = (slug: string): boolean => slug.endsWith(DRAFT_SUFFIX);

export const listSlugs = cache(async (locale: Locale): Promise<string[]> => {
  // A locale nobody has written for yet is an empty blog, not a build failure.
  const entries = await fs.readdir(path.join(BLOG_DIR, locale)).catch(() => []);
  return entries
    .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
    .map((entry) => entry.replace(/\.mdx$/, ""))
    .filter((slug) => includeDrafts || !isDraft(slug));
});

/** The one interpolation site: the bundler builds a context module from this literal. */
export const getPost = (
  locale: Locale,
  slug: string,
): Promise<BlogPostModule> => import(`@/content/blog/${locale}/${slug}.mdx`);

const readingTime = async (locale: Locale, slug: string): Promise<number> => {
  const raw = await fs.readFile(
    path.join(BLOG_DIR, locale, `${slug}.mdx`),
    "utf8",
  );
  const body = raw.replace(METADATA_EXPORT, "");
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export const resolveContentLocale = cache(
  async (locale: Locale, slug: string): Promise<Locale | undefined> => {
    if ((await listSlugs(locale)).includes(slug)) return locale;

    for (const candidate of LOCALES) {
      if (candidate === locale) continue;
      if ((await listSlugs(candidate)).includes(slug)) return candidate;
    }

    return undefined;
  },
);

/** The set an `hreflang` cluster may name: a fallback URL canonicalises elsewhere. */
export const postLocales = cache(async (slug: string): Promise<Locale[]> => {
  const wrote = await Promise.all(
    LOCALES.map(async (locale) => (await listSlugs(locale)).includes(slug)),
  );
  return LOCALES.filter((_, index) => wrote[index]);
});

export const getBlogPosts = cache(
  async (locale: Locale): Promise<BlogPostMeta[]> => {
    const own = await listSlugs(locale);
    const source = new Map<string, Locale>(own.map((slug) => [slug, locale]));
    for (const candidate of LOCALES) {
      if (candidate === locale) continue;
      for (const slug of await listSlugs(candidate)) {
        if (source.has(slug)) continue;
        source.set(slug, candidate);
      }
    }

    const posts = await Promise.all(
      [...source].map(async ([slug, contentLocale]): Promise<BlogPostMeta> => {
        const { metadata } = await getPost(contentLocale, slug);
        return {
          slug,
          contentLocale,
          readingTime: await readingTime(contentLocale, slug),
          ...metadata,
        };
      }),
    );

    return posts.sort((a, b) => b.date.localeCompare(a.date));
  },
);
