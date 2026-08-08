import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "@/lib/format";

const WEST_OF_UTC = "America/Los_Angeles";

const formatUnderTimeZone = async (timeZone: string, iso: string) => {
  const original = process.env.TZ;
  process.env.TZ = timeZone;
  vi.resetModules();
  const { formatDate: freshFormatDate } = await import("@/lib/format");
  process.env.TZ = original;
  return freshFormatDate(iso);
};

describe("formatDate", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("formats an ISO date as a long French date", () => {
    expect(formatDate("2026-01-01")).toBe("1 janvier 2026");
  });

  it("handles other months correctly", () => {
    expect(formatDate("2026-07-13")).toBe("13 juillet 2026");
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
