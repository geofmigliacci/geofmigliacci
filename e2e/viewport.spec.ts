import { devices } from "@playwright/test";
import { expect, test } from "./smoke";

// A WebKit descriptor would override the chromium project and fail on a Chromium-only CI.
test.use(devices["Galaxy S9+"]);

// `/legal` carries the longest crumb in `SECTIONS`, which is what `min-w-0` guards.
test("a long crumb does not push the page sideways", async ({ page }) => {
  await page.goto("/fr/legal");

  // The crumb mounts on the client: measuring early sizes a header it is not in yet.
  const crumb = page
    .getByRole("navigation", { name: "Fil d'Ariane" })
    .getByRole("link", { name: "Mentions légales" });
  await expect(crumb).toBeVisible();

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });

  expect(overflow).toBe(0);

  // Visible is not read: `truncate` satisfies it on a crumb clipped to an ellipsis.
  const clipped = await crumb.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );

  expect(clipped).toBe(false);
});

test("the burger reaches a section a phone has no room to list", async ({
  page,
}) => {
  await page.goto("/fr");

  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page.getByRole("menuitem", { name: "À propos" }).click();

  await expect(page).toHaveURL("/fr/about");
  await expect(
    page.getByRole("heading", { level: 1, name: "Geoffrey Migliacci" }),
  ).toBeVisible();
});
