import type { ReactNode } from "react";

export function Epilogue({ children }: { children: ReactNode }) {
  return (
    <aside className="relative mt-12 px-6 py-6 ring-1 ring-primary/20 md:px-8 md:py-7 [&>p:last-child]:mb-0">
      <span aria-hidden className="blueprint-target text-primary/40" />
      <div className="mb-6 flex items-center gap-3">
        <h2 className="my-0 scroll-mt-24 font-mono text-xs tracking-[0.25em] text-primary uppercase">
          Épilogue
        </h2>
        <span aria-hidden className="h-px flex-1 bg-primary/20" />
      </div>
      {children}
    </aside>
  );
}
