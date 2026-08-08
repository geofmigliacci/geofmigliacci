import type { ReactNode } from "react";

export function Takeaways({ children }: { children: ReactNode }) {
  return (
    <div className="panel mt-8">
      <ol className="m-0! grid list-none gap-0 divide-y divide-border p-0! [counter-reset:takeaway]">
        {children}
      </ol>
    </div>
  );
}

export function Takeaway({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="m-0! flex gap-4 py-6 pl-0! first:pt-0 last:pb-0 [counter-increment:takeaway]">
      <span
        aria-hidden
        className="pt-1 font-mono text-xs text-primary before:content-[counter(takeaway,decimal-leading-zero)]"
      />
      <div>
        <p className="m-0! font-semibold text-foreground">{title}</p>
        <div className="mt-1 [&_p]:m-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground">
          {children}
        </div>
      </div>
    </li>
  );
}
