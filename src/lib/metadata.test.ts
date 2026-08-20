import { describe, expect, it } from "vitest";
import { alternatesFor, defaultAmong, openGraphBase } from "@/lib/metadata";

describe("alternatesFor", () => {
  it("canonicalises to the locale asked for and names both alternates", () => {
    expect(alternatesFor("/blog", "en")).toEqual({
      canonical: "/en/blog",
      languages: {
        en: "/en/blog",
        fr: "/fr/blog",
        "x-default": "/en/blog",
      },
      types: { "application/rss+xml": "/en/feed.xml" },
    });
  });

  it("claims no alternate outside the cluster it is given", () => {
    const alternates = alternatesFor("/blog/ef-core", "fr", ["fr"]);

    expect(alternates?.languages).toEqual({
      fr: "/fr/blog/ef-core",
      "x-default": "/fr/blog/ef-core",
    });
  });

  it("prefixes the home path without leaving a trailing slash", () => {
    expect(alternatesFor("/", "fr")?.canonical).toBe("/fr");
  });
});

describe("defaultAmong", () => {
  it("prefers the default locale when the cluster has it", () => {
    expect(defaultAmong(["fr", "en"])).toBe("en");
  });

  it("falls back to the only locale that wrote the page", () => {
    expect(defaultAmong(["fr"])).toBe("fr");
  });

  it("refuses a cluster of nothing, which would resolve to /undefined", () => {
    expect(() => defaultAmong([])).toThrow();
  });
});

describe("openGraphBase", () => {
  it("declares the regional locale and the other as its alternate", () => {
    expect(openGraphBase("en")).toEqual({
      siteName: "Geoffrey Migliacci",
      locale: "en_US",
      alternateLocale: ["fr_FR"],
    });
  });
});
