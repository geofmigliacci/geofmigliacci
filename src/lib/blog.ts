import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { StaticImageData } from "next/image";
import { cache } from "react";
import type { TocItem } from "rehype-mdx-toc";
import type { CoverPosition } from "@/components/cover-band";

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

export const listSlugs = cache(async (): Promise<string[]> => {
  const entries = await fs.readdir(BLOG_DIR);
  return entries
    .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
    .map((entry) => entry.replace(/\.mdx$/, ""))
    .filter((slug) => includeDrafts || !isDraft(slug));
});

/** The one interpolation site: the bundler builds its context module from this literal. */
export const getPost = (slug: string): Promise<BlogPostModule> =>
  import(`@/content/blog/${slug}.mdx`);

const readingTime = async (slug: string): Promise<number> => {
  const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const body = raw.replace(METADATA_EXPORT, "");
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export const getBlogPosts = cache(async (): Promise<BlogPostMeta[]> => {
  const slugs = await listSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug): Promise<BlogPostMeta> => {
      const { metadata } = await getPost(slug);
      return { slug, readingTime: await readingTime(slug), ...metadata };
    }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
});
