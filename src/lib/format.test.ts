import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/format";

describe("formatDate", () => {
  it("formats an ISO date as a long French date", () => {
    expect(formatDate("2026-01-01")).toBe("1 janvier 2026");
  });

  it("handles other months correctly", () => {
    expect(formatDate("2026-07-13")).toBe("13 juillet 2026");
  });
});
