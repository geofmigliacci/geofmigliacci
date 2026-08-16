// Playwright's `test`, not smoke.ts's: most of these never build a browser page.
import { expect, test } from "@playwright/test";

/**
 * `extraHTTPHeaders`, not the `locale` context option: `locale` applies to browser
 * pages only, and the `request` fixture would negotiate from no header at all.
 */
test.describe("a French browser", () => {
  test.use({ extraHTTPHeaders: { "accept-language": "fr-FR,fr;q=0.9" } });

  test("lands on the French site from a bare path", async ({ request }) => {
    const response = await request.get("/", { maxRedirects: 0 });

    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.headers().location).toBe("/fr");
  });

  test("keeps the path it asked for across the redirect", async ({
    request,
  }) => {
    const response = await request.get("/blog", { maxRedirects: 0 });

    expect(response.headers().location).toBe("/fr/blog");
  });
});

test.describe("an English browser", () => {
  test.use({ extraHTTPHeaders: { "accept-language": "en-US,en;q=0.9" } });

  test("lands on the English site from a bare path", async ({ request }) => {
    const response = await request.get("/", { maxRedirects: 0 });

    expect(response.headers().location).toBe("/en");
  });
});

// The cookie is an explicit choice; the header is a guess, so the cookie wins.
test.describe("a stored preference", () => {
  test.use({
    extraHTTPHeaders: {
      "accept-language": "fr-FR,fr;q=0.9",
      cookie: "NEXT_LOCALE=en",
    },
  });

  test("beats the Accept-Language header", async ({ request }) => {
    const response = await request.get("/", { maxRedirects: 0 });

    expect(response.headers().location).toBe("/en");
  });
});

// A shared cache that ignores this serves one visitor's language to the next.
test("the negotiated redirect varies on what decided it", async ({
  request,
}) => {
  const response = await request.get("/", { maxRedirects: 0 });
  const vary = response.headers().vary ?? "";

  expect(vary.toLowerCase()).toContain("accept-language");
});

test("every locale is reachable directly", async ({ request }) => {
  for (const path of ["/en", "/fr"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test("each locale declares the other as its alternate", async ({ page }) => {
  await page.goto("/en");

  await expect(
    page.locator('link[rel="alternate"][hreflang="fr"]'),
  ).toHaveAttribute("href", /\/fr$/);
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveAttribute("href", /\/en$/);
});
