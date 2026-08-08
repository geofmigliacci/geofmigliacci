// Playwright's `test`, not smoke.ts's: that one builds a browser page to watch.
import { expect, test } from "@playwright/test";
import { publishedSlugs, STATIC_PAGES } from "./routes";

const GENERATED_ROUTES = [
  { path: "/feed.xml", contentType: /application\/rss\+xml/ },
  { path: "/robots.txt", contentType: /text\/plain/ },
  { path: "/sitemap.xml", contentType: /(application|text)\/xml/ },
  {
    path: "/manifest.webmanifest",
    contentType: /manifest\+json|application\/json/,
  },
];

for (const { path, contentType } of GENERATED_ROUTES) {
  test(`${path} is served`, async ({ request }) => {
    const response = await request.get(path);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(contentType);
    expect((await response.text()).trim()).not.toBe("");
  });
}

test("the sitemap lists every page", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  // Pathname only: `<loc>` is absolute against a host that is not this origin.
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );

  const expected = [
    ...STATIC_PAGES.map(({ path }) => path),
    ...publishedSlugs().map((slug) => `/blog/${slug}`),
  ];

  expect(listed.toSorted()).toEqual(expected.toSorted());
});

test("the feed carries every post", async ({ request }) => {
  const feed = await (await request.get("/feed.xml")).text();
  const slugs = publishedSlugs();

  expect(slugs.length).toBeGreaterThan(0);
  for (const slug of slugs) {
    expect(feed).toContain(`/blog/${slug}`);
  }
});
