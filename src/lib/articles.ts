import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
}

export interface ArticleMeta extends ArticleMetadata {
  slug: string;
  readingTime: number;
}

export type ArticleModule = {
  default: React.ComponentType;
  metadata: ArticleMetadata;
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const WORDS_PER_MINUTE = 200;
const METADATA_EXPORT = /^export const metadata = \{[\s\S]*?\};/;

export const listSlugs = cache(async (): Promise<string[]> => {
  const entries = await fs.readdir(ARTICLES_DIR);
  return entries
    .filter((entry) => entry.endsWith(".mdx") && !entry.startsWith("_"))
    .map((entry) => entry.replace(/\.mdx$/, ""));
});

const readingTime = async (slug: string): Promise<number> => {
  const raw = await fs.readFile(path.join(ARTICLES_DIR, `${slug}.mdx`), "utf8");
  const body = raw.replace(METADATA_EXPORT, "");
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export const getArticles = cache(async (): Promise<ArticleMeta[]> => {
  const slugs = await listSlugs();

  const articles = await Promise.all(
    slugs.map(async (slug): Promise<ArticleMeta> => {
      const { metadata }: ArticleModule = await import(
        `@/content/articles/${slug}.mdx`
      );
      return { slug, readingTime: await readingTime(slug), ...metadata };
    }),
  );

  return articles.sort((a, b) => b.date.localeCompare(a.date));
});
