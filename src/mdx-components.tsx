import type { MDXComponents } from "mdx/types";
import { Chapter } from "@/components/mdx/chapter";
import { Epilogue } from "@/components/mdx/epilogue";
import { Quote } from "@/components/mdx/quote";
import { SectionHeading } from "@/components/mdx/section-heading";
import { SubsectionHeading } from "@/components/mdx/subsection-heading";
import { Takeaway, Takeaways } from "@/components/mdx/takeaways";

/** `h1` renders an `h2`: the page owns the post's only top-level heading. */
const components: MDXComponents = {
  Chapter,
  Epilogue,
  Quote,
  Takeaway,
  Takeaways,
  blockquote: Quote,
  h1: SectionHeading,
  h2: SectionHeading,
  h3: SubsectionHeading,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
