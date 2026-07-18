import type { ComponentProps } from "react";

export function SectionHeading({ children, ...props }: ComponentProps<"h2">) {
  return (
    <h2 {...props} className="flex items-center gap-4">
      <span className="min-w-0">{children}</span>
      <span aria-hidden className="h-px min-w-6 flex-1 bg-primary/20" />
    </h2>
  );
}
