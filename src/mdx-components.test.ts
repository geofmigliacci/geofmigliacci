import { describe, expect, it } from "vitest";
import { Chapter } from "@/components/mdx/chapter";
import { Epilogue } from "@/components/mdx/epilogue";
import { Quote } from "@/components/mdx/quote";
import { SectionHeading } from "@/components/mdx/section-heading";
import { SubsectionHeading } from "@/components/mdx/subsection-heading";
import { Takeaway, Takeaways } from "@/components/mdx/takeaways";
import { useMDXComponents } from "@/mdx-components";

describe("useMDXComponents", () => {
  it("returns the MDX component overrides map", () => {
    expect(useMDXComponents()).toEqual({
      Chapter,
      Epilogue,
      Quote,
      Takeaway,
      Takeaways,
      blockquote: Quote,
      h1: SectionHeading,
      h2: SectionHeading,
      h3: SubsectionHeading,
    });
  });
});
