import type { ReactNode } from "react";

export function Epilogue({ children }: { children: ReactNode }) {
  return (
    <aside className="relative mt-12 p-6 ring-1 ring-primary/20 md:p-8 [&>p:last-child]:mb-0">
      <span aria-hidden className="blueprint-target text-primary/40" />
      <div className="mb-6 flex items-center gap-4">
        <h2 className="my-0 scroll-mt-24 font-mono text-xs tracking-[0.25em] text-primary uppercase">
          Épilogue
        </h2>
        <span aria-hidden className="h-px min-w-6 flex-1 bg-primary/20" />
      </div>
      {children}
    </aside>
  );
}
