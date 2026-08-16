import { test as base, expect, type Page } from "@playwright/test";
import type { Locale } from "./routes";

export interface PageProblems {
  console: string[];
  requests: string[];
}

function watch(page: Page): PageProblems {
  const problems: PageProblems = { console: [], requests: [] };

  // Chromium's echo of a failure the listeners below already record with a URL.
  const NETWORK_ECHO = "Failed to load resource:";

  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().startsWith(NETWORK_ECHO)
    ) {
      problems.console.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    problems.console.push(error.message);
  });
  page.on("response", (response) => {
    // Documents excluded: the 404 tests navigate to one on purpose.
    if (
      response.request().resourceType() !== "document" &&
      response.status() >= 400
    ) {
      problems.requests.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "failed";
    problems.requests.push(`${reason} ${request.url()}`);
  });

  return problems;
}

/** Listeners attached inside the body miss what the document logged on its way up. */
export const test = base.extend<{ problems: PageProblems }>({
  problems: [
    async ({ page }, use, testInfo) => {
      const problems = watch(page);

      await use(problems);

      // Otherwise the wait below stacks its timeout behind a real failure.
      if (testInfo.errors.length > 0) return;

      // Next builds this from a `useEffect`: read the console before it arrives
      // and React has not yet had the chance to complain about the markup.
      await expect(page.locator("next-route-announcer")).toBeAttached();
      expect(problems.console, `Console errors on ${page.url()}`).toEqual([]);
      expect(problems.requests, `Failed requests on ${page.url()}`).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function expectStructuredData(page: Page): Promise<void> {
  const blobs = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();

  // A page's entities share one `@graph`: a second tag is a stray emitter.
  expect(blobs, `Structured data tags on ${page.url()}`).toHaveLength(1);

  for (const blob of blobs) {
    const parsed = JSON.parse(blob);
    expect(parsed["@context"]).toBe("https://schema.org");

    // The types sit on the nodes: the top level alone would accept an empty graph.
    const nodes = parsed["@graph"];
    expect(nodes, `Empty graph on ${page.url()}`).not.toHaveLength(0);
    for (const node of nodes) {
      expect(node["@type"]).toBeTruthy();
    }
  }
}

/** Spelt out, for the same reason `routes.ts` spells its titles out. */
const SHELL = {
  en: {
    skip: "Skip to content",
    nav: "Main navigation",
    legal: "Legal information",
  },
  fr: {
    skip: "Aller au contenu",
    nav: "Navigation principale",
    legal: "Informations légales",
  },
} as const;

export async function expectSiteShell(
  page: Page,
  locale: Locale = "fr",
): Promise<void> {
  const copy = SHELL[locale];

  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  // Attached rather than visible: it is `sr-only` until focused.
  await expect(page.getByRole("link", { name: copy.skip })).toBeAttached();
  await expect(page.getByRole("navigation", { name: copy.nav })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: copy.legal }),
  ).toBeVisible();
}
