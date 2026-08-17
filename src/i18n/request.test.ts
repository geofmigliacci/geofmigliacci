import { describe, expect, it, vi } from "vitest";
import requestConfig from "@/i18n/request";
import fr from "@/messages/fr.json";

vi.mock("next-intl/server", () => import("@/i18n/server.mock"));

const resolve = (requestLocale?: string, locale?: "en" | "fr") =>
  requestConfig({ requestLocale: Promise.resolve(requestLocale), locale });

describe("the request config", () => {
  it("prefers an explicit locale, which build time has and headers do not", async () => {
    await expect(resolve("fr", "en")).resolves.toMatchObject({ locale: "en" });
  });

  it("falls back to the locale the proxy matched", async () => {
    await expect(resolve("fr")).resolves.toMatchObject({ locale: "fr" });
  });

  it("reads an unknown segment as the default locale", async () => {
    await expect(resolve("de")).resolves.toMatchObject({ locale: "en" });
  });

  it("reads a page outside the segment as the default locale", async () => {
    await expect(resolve()).resolves.toMatchObject({ locale: "en" });
  });

  it("loads the catalogue for the locale it settled on", async () => {
    const { messages } = await resolve("fr");

    expect(messages).toEqual(fr);
  });
});
