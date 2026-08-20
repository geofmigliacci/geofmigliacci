import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "@/lib/format";

const WEST_OF_UTC = "America/Los_Angeles";

const formatUnderTimeZone = async (timeZone: string, iso: string) => {
  const original = process.env.TZ;
  process.env.TZ = timeZone;
  vi.resetModules();
  const { formatDate: freshFormatDate } = await import("@/lib/format");
  process.env.TZ = original;
  return freshFormatDate(iso, "fr");
};

describe("formatDate", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("formats an ISO date as a long French date", () => {
    expect(formatDate("2026-01-01", "fr")).toBe("1 janvier 2026");
  });

  it("handles other months correctly", () => {
    expect(formatDate("2026-07-13", "fr")).toBe("13 juillet 2026");
  });

  it("formats an English date the US way", () => {
    expect(formatDate("2026-01-01", "en")).toBe("January 1, 2026");
    expect(formatDate("2026-07-13", "en")).toBe("July 13, 2026");
  });

  // A subclass, not `spyOn`: that replaces the constructor with something `new` rejects.
  it("keeps one formatter per locale rather than building one per call", async () => {
    const Original = Intl.DateTimeFormat;
    let built = 0;

    vi.resetModules();
    vi.stubGlobal("Intl", {
      ...Intl,
      DateTimeFormat: class extends Original {
        constructor(...args: ConstructorParameters<typeof Original>) {
          built += 1;
          super(...args);
        }
      },
    });

    try {
      const { formatDate: fresh } = await import("@/lib/format");
      fresh("2026-01-01", "fr");
      fresh("2026-02-02", "fr");
      fresh("2026-03-03", "fr");
    } finally {
      vi.unstubAllGlobals();
    }

    expect(built).toBe(1);
  });

  it("does not shift the day for viewers west of UTC", async () => {
    expect(await formatUnderTimeZone(WEST_OF_UTC, "2026-07-17")).toBe(
      "17 juillet 2026",
    );
  });

  it("does not shift the year across a New Year boundary", async () => {
    expect(await formatUnderTimeZone(WEST_OF_UTC, "2026-01-01")).toBe(
      "1 janvier 2026",
    );
  });
});
