import type { ReactNode } from "react";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";

export function Takeaways({ children }: { children: ReactNode }) {
  return (
    <div className="relative mt-8 p-6 ring-1 ring-foreground/10 md:p-8">
      <BlueprintCorners />
      <ol className="m-0! grid list-none gap-0 divide-y divide-foreground/10 p-0! [counter-reset:takeaway]">
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
    <li className="m-0! flex gap-4 py-5 pl-0! first:pt-0 last:pb-0 [counter-increment:takeaway]">
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
