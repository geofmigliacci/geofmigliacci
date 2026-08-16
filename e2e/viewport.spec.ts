import { devices } from "@playwright/test";
import { expect, test } from "./smoke";

// A WebKit descriptor would override the chromium project and fail on a Chromium-only CI.
test.use(devices["Galaxy S9+"]);

// `/legal` carries the longest crumb in `SECTIONS`, which is what `min-w-0` guards.
test("a long crumb does not push the page sideways", async ({ page }) => {
  await page.goto("/fr/legal");

  // The crumb mounts on the client: measuring early sizes a header it is not in yet.
  await expect(
    page
      .getByRole("navigation", { name: "Fil d'Ariane" })
      .getByRole("link", { name: "Mentions légales" }),
  ).toBeVisible();

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });

  expect(overflow).toBe(0);
});
