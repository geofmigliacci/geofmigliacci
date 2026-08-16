import { describe, expect, it } from "vitest";
import { testCover } from "@/lib/blog.fixtures";
import {
  blogJsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  graph,
  type JsonLdContext,
  personJsonLd,
  profilePageJsonLd,
  websiteJsonLd,
} from "@/lib/json-ld";

/** The translated half, spelt out: the builders take it rather than reading it. */
const ctx = (locale: JsonLdContext["locale"] = "fr"): JsonLdContext => ({
  locale,
  tagline: "Une tagline.",
  blogDescription: "Une description de blog.",
  pitch: "Un pitch.",
  jobTitle: "Ingénieur logiciel senior",
  knowsAbout: [".NET", "Architecture logicielle"],
  blogName: "Blog",
  routeNames: {
    "/": "Accueil",
    "/blog": "Blog",
    "/about": "À propos",
    "/legal": "Mentions légales",
    "/privacy-policy": "Politique de confidentialité",
  },
});

type BlogPostInput = Parameters<typeof blogPostingJsonLd>[1];

const post = (overrides: Partial<BlogPostInput> = {}) =>
  blogPostingJsonLd(ctx(), {
    title: "Mon post",
    description: "Une description.",
    date: "2026-01-01",
    tags: [],
    cover: testCover,
    slug: "mon-post",
    ...overrides,
  });

describe("graph", () => {
  it("wraps nodes in a single contexted document", () => {
    const data = graph(personJsonLd(ctx()), websiteJsonLd(ctx()));

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"]).toHaveLength(2);
  });
});

describe("personJsonLd", () => {
  it("builds a schema.org Person matching the site's identity", () => {
    const data = personJsonLd(ctx());

    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Geoffrey Migliacci");
    expect(data.image).toBe("https://www.geofmigliacci.dev/geofmigliacci.jpg");
  });

  it("carries the expertise the posts demonstrate", () => {
    const data = personJsonLd(ctx());

    expect(data.knowsAbout).toContain(".NET");
    expect(data.description).toBeTruthy();
    expect(data.alternateName).toBe("geofmigliacci");
  });

  // Emitted standalone here and nested in the ProfilePage on /about.
  it("uses the same identifier as the profile page's main entity", () => {
    expect(personJsonLd(ctx())["@id"]).toBe(
      profilePageJsonLd(ctx()).mainEntity["@id"],
    );
  });

  // The same URL the post pages hand to `authors`, so one page names one author.
  it("points at the page that identifies the person", () => {
    expect(personJsonLd(ctx()).url).toBe(
      "https://www.geofmigliacci.dev/fr/about",
    );
  });

  // Two nodes under one `@id` do not pick a winner: they merge, holding both.
  it("agrees with the reference a post carries as its author", () => {
    const { author } = post();

    expect(author["@id"]).toBe(personJsonLd(ctx())["@id"]);
    expect(author.url).toBe(personJsonLd(ctx()).url);
  });
});

describe("profilePageJsonLd", () => {
  it("wraps the person as the page's main entity", () => {
    const data = profilePageJsonLd(ctx());

    expect(data["@type"]).toBe("ProfilePage");
    expect(data.url).toBe("https://www.geofmigliacci.dev/fr/about");
    expect(data.inLanguage).toBe("fr-FR");
    expect(data.mainEntity).toMatchObject({
      "@type": "Person",
      name: "Geoffrey Migliacci",
    });
  });
});

describe("blogPostingJsonLd", () => {
  it("builds a schema.org BlogPosting with a resolved post URL", () => {
    const data = post({ tags: ["dotnet", "performance"] });

    expect(data["@type"]).toBe("BlogPosting");
    expect(data["@id"]).toBe(
      "https://www.geofmigliacci.dev/fr/blog/mon-post#post",
    );
    expect(data.inLanguage).toBe("fr-FR");
    expect(data.keywords).toEqual(["dotnet", "performance"]);
    expect(data.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": "https://www.geofmigliacci.dev/fr/blog/mon-post",
    });
    expect(data.headline).toBe("Mon post");
    expect(data.description).toBe("Une description.");
    expect(data.datePublished).toBe("2026-01-01T00:00:00.000Z");
    expect(data.dateModified).toBe("2026-01-01T00:00:00.000Z");
    expect(data.author).toEqual({
      "@type": "Person",
      "@id": "https://www.geofmigliacci.dev/#person",
      name: "Geoffrey Migliacci",
      url: "https://www.geofmigliacci.dev/fr/about",
    });
    expect(data.isPartOf).toMatchObject({
      "@id": "https://www.geofmigliacci.dev/fr/blog#blog",
    });
  });

  it("resolves the image from the cover rather than the OG card", () => {
    const data = post();

    expect(data.image).toBe(`https://www.geofmigliacci.dev${testCover.src}`);
    expect(data.image).not.toContain("opengraph-image");
  });

  // Google reads neither for a post, and `mainEntityOfPage` names the page.
  it("carries neither a redundant url nor a publisher", () => {
    const data = post();

    expect(data).not.toHaveProperty("url");
    expect(data).not.toHaveProperty("publisher");
  });

  it("uses the updated date for dateModified when the post declares one", () => {
    const data = post({ updated: "2026-03-15" });

    expect(data.datePublished).toBe("2026-01-01T00:00:00.000Z");
    expect(data.dateModified).toBe("2026-03-15T00:00:00.000Z");
  });

  it("states the reading time as an ISO 8601 duration", () => {
    expect(post({ readingTime: 7 })).toHaveProperty("timeRequired", "PT7M");
  });

  // It lives on `BlogPostMeta`, so a caller holding only `metadata` has none.
  it("omits the reading time rather than inventing one", () => {
    expect(post()).not.toHaveProperty("timeRequired");
  });
});

describe("blogJsonLd", () => {
  it("identifies the blog the posts declare themselves part of", () => {
    const data = blogJsonLd(ctx());

    expect(data["@type"]).toBe("Blog");
    expect(data["@id"]).toBe(post().isPartOf["@id"]);
    expect(data.inLanguage).toBe("fr-FR");
  });

  // Google runs no list feature on Article, and each post describes itself.
  it("lists no posts", () => {
    expect(blogJsonLd(ctx())).not.toHaveProperty("blogPost");
  });
});

describe("websiteJsonLd", () => {
  // `name` and `url` are the two Google reads to decide the site name it prints.
  it("names the site and its canonical home page", () => {
    const data = websiteJsonLd(ctx());

    expect(data["@type"]).toBe("WebSite");
    expect(data["@id"]).toBe("https://www.geofmigliacci.dev/#website");
    expect(data.name).toBe("Geoffrey Migliacci");
    expect(data.url).toBe("https://www.geofmigliacci.dev/fr");
  });

  // The only thing tying the site to its author on a page carrying no standalone Person.
  it("reaches the person through its publisher", () => {
    expect(websiteJsonLd(ctx()).publisher["@id"]).toBe(
      personJsonLd(ctx())["@id"],
    );
  });

  // The sitelinks search box it fed was removed from Search in November 2024.
  it("offers no search action", () => {
    expect(websiteJsonLd(ctx())).not.toHaveProperty("potentialAction");
  });
});

describe("breadcrumbJsonLd", () => {
  it("derives the trail from a static path's own segments", () => {
    const data = breadcrumbJsonLd(ctx(), { path: "/about" });

    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.geofmigliacci.dev/fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "À propos",
        item: "https://www.geofmigliacci.dev/fr/about",
      },
    ]);
  });

  // The lookup key is the locale-less path: prefixing it would throw on "/en".
  it("prefixes every URL with the locale without consulting it", () => {
    const data = breadcrumbJsonLd(ctx("en"), { path: "/legal" });

    expect(data.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.geofmigliacci.dev/en",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mentions légales",
        item: "https://www.geofmigliacci.dev/en/legal",
      },
    ]);
  });

  it("names a dynamic leaf from the caller and its ancestors from the table", () => {
    const data = breadcrumbJsonLd(ctx(), {
      path: "/blog/mon-post",
      leafName: "Mon post",
    });

    expect(data.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.geofmigliacci.dev/fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.geofmigliacci.dev/fr/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Mon post",
        item: "https://www.geofmigliacci.dev/fr/blog/mon-post",
      },
    ]);
  });

  it("refuses a path whose ancestor is not in the table", () => {
    expect(() =>
      breadcrumbJsonLd(ctx(), {
        path: "/notes/mon-note",
        leafName: "Ma note",
      }),
    ).toThrow(/\/notes/);
  });
});
