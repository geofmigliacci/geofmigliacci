import { describe, expect, it } from "vitest";
import { articleJsonLd, breadcrumbJsonLd, personJsonLd } from "@/lib/json-ld";

describe("personJsonLd", () => {
  it("builds a schema.org Person matching the site's identity", () => {
    const data = personJsonLd();

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Geoffrey Migliacci");
    expect(data.url).toBe("https://www.geofmigliacci.dev/");
    expect(data.image).toBe("https://www.geofmigliacci.dev/geofmigliacci.jpg");
  });
});

describe("articleJsonLd", () => {
  it("builds a schema.org Article with a resolved article URL", () => {
    const data = articleJsonLd({
      title: "Mon article",
      description: "Une description.",
      date: "2026-01-01",
      slug: "mon-article",
    });

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Article");
    expect(data.headline).toBe("Mon article");
    expect(data.description).toBe("Une description.");
    expect(data.datePublished).toBe("2026-01-01");
    expect(data.dateModified).toBe("2026-01-01");
    expect(data.image).toBe(
      "https://www.geofmigliacci.dev/articles/mon-article/opengraph-image/og",
    );
    expect(data.url).toBe("https://www.geofmigliacci.dev/articles/mon-article");
    expect(data.author).toEqual({
      "@type": "Person",
      name: "Geoffrey Migliacci",
      url: "https://www.geofmigliacci.dev/",
    });
  });
});

describe("breadcrumbJsonLd", () => {
  it("builds an ordered ListItem trail with resolved URLs", () => {
    const data = breadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: "Articles", path: "/articles" },
      { name: "Mon article", path: "/articles/mon-article" },
    ]);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.geofmigliacci.dev/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://www.geofmigliacci.dev/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Mon article",
        item: "https://www.geofmigliacci.dev/articles/mon-article",
      },
    ]);
  });
});
