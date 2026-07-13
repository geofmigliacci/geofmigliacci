import { describe, expect, it } from "vitest";
import { useMDXComponents } from "@/mdx-components";

describe("useMDXComponents", () => {
  it("returns the MDX component overrides map", () => {
    expect(useMDXComponents()).toEqual({});
  });
});
