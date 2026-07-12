import { describe, expect, it } from "vitest";
import { cn, slugify } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind utilities, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("supports clsx's conditional object syntax", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips accents", () => {
    expect(slugify("Café à Paris")).toBe("cafe-a-paris");
  });

  it("collapses consecutive non-alphanumeric characters", () => {
    expect(slugify("Hello,   World!!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Hello World--  ")).toBe("hello-world");
  });

  it("returns an empty string when nothing alphanumeric remains", () => {
    expect(slugify("!!!")).toBe("");
  });
});
