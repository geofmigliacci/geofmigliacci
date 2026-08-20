// Playwright's `test`, not smoke.ts's: that one builds a browser page to watch.
import { expect, test } from "@playwright/test";
import { localePath, publishedPosts, STATIC_PAGES } from "./routes";

const GENERATED_ROUTES = [
  // Unprefixed, so this also proves the permanent redirect to the French feed.
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
    ...publishedPosts.map(({ locale, slug }) =>
      localePath(locale, `/blog/${slug}`),
    ),
  ];

  expect(listed.toSorted()).toEqual(expected.toSorted());
});

test("each locale's feed carries that locale's posts", async ({ request }) => {
  expect(publishedPosts.length).toBeGreaterThan(0);

  for (const { locale, slug } of publishedPosts) {
    const feed = await (
      await request.get(localePath(locale, "/feed.xml"))
    ).text();

    expect(feed).toContain(localePath(locale, `/blog/${slug}`));
  }
});
