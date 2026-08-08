import type { ComponentProps } from "react";
import { AccentRule } from "@/components/decorative/accent-rule";

export function SubsectionHeading({
  children,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3 {...props} className="flex items-center gap-4 text-xl md:text-2xl">
      <span className="min-w-0">{children}</span>
      <AccentRule />
    </h3>
  );
}
