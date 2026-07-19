import { describe, expect, it } from "vitest";
import { Chapter } from "@/components/mdx/chapter";
import { Epilogue } from "@/components/mdx/epilogue";
import { SectionHeading } from "@/components/mdx/section-heading";
import { Takeaway, Takeaways } from "@/components/mdx/takeaways";
import { useMDXComponents } from "@/mdx-components";

describe("useMDXComponents", () => {
  it("returns the MDX component overrides map", () => {
    expect(useMDXComponents()).toEqual({
      Chapter,
      Epilogue,
      Takeaway,
      Takeaways,
      h2: SectionHeading,
    });
  });
});
