import { expect, expectStructuredData, test } from "./smoke";

// A client navigation that throws leaves the previous page up, so the URL alone proves nothing.
const NAV_TARGETS = [
  { link: "Blog", path: "/fr/blog", heading: "Blog" },
  { link: "À propos", path: "/fr/about", heading: "Geoffrey Migliacci" },
];

for (const { link, path, heading } of NAV_TARGETS) {
  test(`the header nav reaches ${path}`, async ({ page }) => {
    await page.goto("/fr");

    // `button`, not `link`: Base UI's `Button` stamps the role on the anchor it renders.
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("button", { name: link })
      .click();

    await expect(page).toHaveURL(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
    // The only place the script is mounted by React rather than parsed from a document.
    await expectStructuredData(page);
  });
}

const COLOPHON_TARGETS = [
  { link: "Mentions légales", path: "/fr/legal", heading: "Mentions légales" },
  {
    link: "Confidentialité",
    path: "/fr/privacy-policy",
    heading: "Politique de confidentialité",
  },
];

for (const { link, path, heading } of COLOPHON_TARGETS) {
  test(`the footer reaches ${path}`, async ({ page }) => {
    await page.goto("/fr");

    await page
      .getByRole("navigation", { name: "Informations légales" })
      .getByRole("link", { name: link })
      .click();

    await expect(page).toHaveURL(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  });
}

test("a post opens from the listing", async ({ page }) => {
  await page.goto("/fr/blog");

  const row = page.getByRole("main").getByRole("listitem").first();
  const title = (
    await row.getByRole("heading", { level: 2 }).textContent()
  )?.trim();
  expect(title).toBeTruthy();

  await row.getByRole("link").click();

  await expect(
    page.getByRole("heading", { level: 1, name: title }),
  ).toBeVisible();
});
