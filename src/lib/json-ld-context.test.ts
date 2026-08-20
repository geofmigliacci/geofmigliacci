import { describe, expect, it, vi } from "vitest";
import { jsonLdContext } from "@/lib/json-ld-context";
import { HOME_PATH, SECTION_PATHS } from "@/lib/site";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

vi.mock("next-intl/server", () => import("@/i18n/server.mock"));

describe("jsonLdContext", () => {
  it("names every route a breadcrumb can walk", async () => {
    const { routeNames } = await jsonLdContext("en");

    expect(Object.keys(routeNames)).toEqual([
      HOME_PATH,
      ...Object.values(SECTION_PATHS),
    ]);
    expect(routeNames[SECTION_PATHS.blog]).toBe(en.nav.sections.blog.name);
  });

  it("describes the site in the locale it is asked for", async () => {
    const [english, french] = await Promise.all([
      jsonLdContext("en"),
      jsonLdContext("fr"),
    ]);

    expect(english.tagline).toBe(en.site.tagline);
    expect(french.tagline).toBe(fr.site.tagline);
    expect(english.tagline).not.toBe(french.tagline);
  });

  it("translates the half of knowsAbout that is prose", async () => {
    const { knowsAbout } = await jsonLdContext("fr");

    expect(knowsAbout).toContain(".NET");
    expect(knowsAbout).toContain(fr.site.knowsAbout.architecture);
    expect(knowsAbout).toContain(fr.site.knowsAbout.performance);
  });
});
