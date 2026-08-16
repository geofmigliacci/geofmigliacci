import type { ReactNode } from "react";
import { AccentRule } from "@/components/decorative/accent-rule";

/** The title comes from the MDX, like `Chapter`'s: on a fallback post it has to
    be the language the body is written in, which no request locale can supply. */
export function Epilogue({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="panel mt-12 bg-muted [&>p:last-child]:mb-0">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="my-0! font-mono text-xs leading-none tracking-eyebrow text-primary uppercase">
          {title}
        </h2>
        <AccentRule />
      </div>
      {children}
    </aside>
  );
}
