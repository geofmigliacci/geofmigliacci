import type { ComponentProps } from "react";
import { AccentRule } from "@/components/decorative/accent-rule";

export function SectionHeading({ children, ...props }: ComponentProps<"h2">) {
  return (
    // Sized here: the plugin's `prose-lg` h2 computes to the page h1's size and weight.
    <h2 {...props} className="flex items-center gap-4 text-2xl md:text-3xl">
      <span className="min-w-0">{children}</span>
      <AccentRule />
    </h2>
  );
}
