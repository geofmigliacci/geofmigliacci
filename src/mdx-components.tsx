import type { MDXComponents } from "mdx/types";
import { Epilogue } from "@/components/mdx/epilogue";
import { SectionHeading } from "@/components/mdx/section-heading";

const components: MDXComponents = { Epilogue, h2: SectionHeading };

export function useMDXComponents(): MDXComponents {
  return components;
}
