import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const MAX_DESCRIPTION_LENGTH = 160;

describe("article descriptions", () => {
  it("stay within SERP-safe length", async () => {
    const entries = await fs.readdir(ARTICLES_DIR);
    const articles = entries.filter(
      (entry) => entry.endsWith(".mdx") && !entry.startsWith("_"),
    );
    expect(articles.length).toBeGreaterThan(0);

    for (const entry of articles) {
      const raw = await fs.readFile(path.join(ARTICLES_DIR, entry), "utf8");
      const description = raw.match(/description:\s*"([^"]+)"/)?.[1] ?? "";

      expect(description, `${entry} : description manquante`).not.toBe("");
      expect(
        description.length,
        `${entry} : ${description.length} caractères (max ${MAX_DESCRIPTION_LENGTH})`,
      ).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    }
  });
});
