import type { ReactNode } from "react";
import { AccentRule } from "@/components/decorative/accent-rule";

export function Epilogue({ children }: { children: ReactNode }) {
  return (
    <aside className="panel mt-12 bg-muted [&>p:last-child]:mb-0">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="my-0! font-mono text-xs leading-none tracking-eyebrow text-primary uppercase">
          Épilogue
        </h2>
        <AccentRule />
      </div>
      {children}
    </aside>
  );
}
