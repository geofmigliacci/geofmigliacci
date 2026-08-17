import { describe, expect, it, vi } from "vitest";
import { toLocale } from "@/i18n/params";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

describe("toLocale", () => {
  it("narrows a segment the routing knows", () => {
    expect(toLocale("fr")).toBe("fr");
  });

  it("404s on a segment that is not a locale", () => {
    expect(() => toLocale("de")).toThrow("404");
  });
});
