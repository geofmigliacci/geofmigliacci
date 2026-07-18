import { describe, expect, it } from "vitest";
import { Epilogue } from "@/components/mdx/epilogue";
import { SectionHeading } from "@/components/mdx/section-heading";
import { useMDXComponents } from "@/mdx-components";

describe("useMDXComponents", () => {
  it("returns the MDX component overrides map", () => {
    expect(useMDXComponents()).toEqual({ Epilogue, h2: SectionHeading });
  });
});
