import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("font-mono text-xs", className)}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) =>
          index === lastIndex ? (
            <li key={item.path} aria-current="page" className="text-foreground">
              {item.name}
            </li>
          ) : (
            <li key={item.path} className="flex items-center gap-2">
              <Link
                href={item.path}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
              <span aria-hidden className="text-foreground/30">
                /
              </span>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
