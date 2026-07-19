import type { MDXComponents } from "mdx/types";
import { Chapter } from "@/components/mdx/chapter";
import { Epilogue } from "@/components/mdx/epilogue";
import { SectionHeading } from "@/components/mdx/section-heading";
import { Takeaway, Takeaways } from "@/components/mdx/takeaways";

const components: MDXComponents = {
  Chapter,
  Epilogue,
  Takeaway,
  Takeaways,
  h2: SectionHeading,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
