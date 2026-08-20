// Playwright's `test`, not smoke.ts's: that one builds a browser page and waits on it.
import { expect, test } from "@playwright/test";
import { publishedSlugs } from "./routes";

/** `redirects()` in next.config is the only thing holding these open. */
const MOVED = [
  "/articles",
  ...publishedSlugs("fr").map((s) => `/articles/${s}`),
];

for (const from of MOVED) {
  const to = from.replace("/articles", "/blog");

  test(`${from} redirects to ${to}`, async ({ request }) => {
    // Unfollowed, or this reads the destination: 308 carries ranking across, 302 does not.
    const response = await request.get(from, { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(to);
  });
}
