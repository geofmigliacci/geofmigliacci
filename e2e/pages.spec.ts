import {
  LOCALES,
  localePath,
  publishedPosts,
  STATIC_PAGES,
  TITLE_SUFFIX,
} from "./routes";
import { expect, expectSiteShell, expectStructuredData, test } from "./smoke";

for (const { locale, path, heading, title } of STATIC_PAGES) {
  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expectSiteShell(page, locale);
    await expectStructuredData(page);
  });
}

for (const { locale, slug } of publishedPosts) {
  const path = localePath(locale, `/blog/${slug}`);

  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);
    const post = page.getByRole("article");

    expect(response?.status()).toBe(200);

    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toHaveCount(1);
    // One MDX `metadata` export feeds both, so this restates no post's title here.
    const headingText = (await title.textContent())?.trim();
    expect(headingText).toBeTruthy();
    await expect(page).toHaveTitle(`${headingText}${TITLE_SUFFIX}`);

    await expect(
      post.getByRole("link", { name: "Geoffrey Migliacci" }),
    ).toBeVisible();
    await expect(post.locator("time").first()).toBeVisible();

    // Visibility alone is met by the blur placeholder next/image paints first.
    const cover = post.locator("figure img").first();
    await expect(cover).toBeVisible();
    await expect
      .poll(() => cover.evaluate((img: HTMLImageElement) => img.naturalWidth), {
        // A cold runner transforms the cover through sharp before it decodes.
        timeout: 15_000,
      })
      .toBeGreaterThan(0);

    await expectSiteShell(page, locale);
    await expectStructuredData(page);
  });
}

// `dynamicParams` is `false` on the post route, so an unknown slug 404s through it.
const NOT_FOUND_ROUTES = ["/not-a-page", "/blog/not-a-post"];

/** Spelt out, for the same reason `routes.ts` spells its titles out. */
const NOT_FOUND = {
  en: { heading: "Error 404 · page not found", home: "Back to home" },
  fr: { heading: "Erreur 404 · page introuvable", home: "Retour à l'accueil" },
} as const;

for (const locale of LOCALES) {
  for (const route of NOT_FOUND_ROUTES) {
    const path = localePath(locale, route);

    test(`${path} renders the 404`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: NOT_FOUND[locale].heading,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: NOT_FOUND[locale].home }),
      ).toBeVisible();
      // `global-not-found.tsx` renders this, and reads its locale from the
      // request rather than a segment, so the shell still matches the URL.
      await expectSiteShell(page, locale);
    });
  }
}

// Deleting the crumb would clear React #418 too: this is what stops that being the fix.
test("the section crumb arrives on a 404 below that section", async ({
  page,
}) => {
  await page.goto("/fr/blog/not-a-post-either");

  await expect(
    page
      .getByRole("navigation", { name: "Fil d'Ariane" })
      .getByRole("link", { name: "Blog" }),
  ).toBeVisible();
});
