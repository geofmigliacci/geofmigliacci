"use client";

import Link from "next/link";
import { Logo } from "@/components/decorative/logo";
import { useMountedPathname } from "@/components/use-mounted-pathname";

interface Section {
  name: string;
  path: string;
}

const SECTIONS: Section[] = [
  { name: "Blog", path: "/blog" },
  { name: "À propos", path: "/about" },
  // Reachable only from the footer, so the crumb is the sole way back up.
  { name: "Mentions légales", path: "/legal" },
  { name: "Confidentialité", path: "/privacy-policy" },
];

export function HeaderBreadcrumb() {
  const pathname = useMountedPathname();
  const section = SECTIONS.find(
    (candidate) =>
      pathname === candidate.path || pathname?.startsWith(`${candidate.path}/`),
  );

  return (
    // `min-w-0` all the way down, or a long section name scrolls the page sideways.
    <nav aria-label="Fil d'Ariane" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2">
        <li className="flex">
          <Link href="/" aria-label="Geoffrey Migliacci · accueil">
            <Logo className="size-8" />
          </Link>
        </li>
        {section && (
          <li
            key={section.path}
            className="flex min-w-0 items-center gap-2 font-mono text-xs animate-in fade-in slide-in-from-right-2 duration-500 ease-site motion-reduce:animate-none"
          >
            <span aria-hidden className="shrink-0 text-foreground/30">
              ›
            </span>
            <Link
              href={section.path}
              aria-current={pathname === section.path ? "page" : undefined}
              className="truncate rounded-md bg-muted px-2 py-1 text-foreground transition-colors hover:text-primary"
            >
              {section.name}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
}
