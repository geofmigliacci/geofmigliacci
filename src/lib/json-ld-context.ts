import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/locales";
import type { JsonLdContext } from "@/lib/json-ld";
import { HOME_PATH, SECTION_KEYS, SECTION_PATHS } from "@/lib/site";

/** Keeps `json-ld.ts` pure: the translated half is assembled here, once per page. */
export async function jsonLdContext(locale: Locale): Promise<JsonLdContext> {
  const [site, nav] = await Promise.all([
    getTranslations({ locale, namespace: "site" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return {
    locale,
    tagline: site("tagline"),
    blogDescription: site("blogDescription"),
    pitch: site("pitch"),
    jobTitle: site("jobTitle"),
    knowsAbout: [
      ".NET",
      "ASP.NET Core",
      "Entity Framework Core",
      "SQL",
      site("knowsAbout.architecture"),
      site("knowsAbout.performance"),
    ],
    blogName: nav("sections.blog.name"),
    routeNames: {
      [HOME_PATH]: nav("home.name"),
      ...Object.fromEntries(
        SECTION_KEYS.map((key) => [
          SECTION_PATHS[key],
          nav(`sections.${key}.name`),
        ]),
      ),
    },
  };
}
