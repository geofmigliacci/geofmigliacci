"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/decorative/logo";
import { useMountedPathname } from "@/components/use-mounted-pathname";
import { Link } from "@/i18n/navigation";
import { SECTION_KEYS, SECTION_PATHS } from "@/lib/site";

export function HeaderBreadcrumb() {
  const t = useTranslations("nav");
  const pathname = useMountedPathname();

  const key = SECTION_KEYS.find(
    (candidate) =>
      pathname === SECTION_PATHS[candidate] ||
      pathname?.startsWith(`${SECTION_PATHS[candidate]}/`),
  );
  const path = key && SECTION_PATHS[key];

  return (
    // `min-w-0` all the way down, or a long section name scrolls the page sideways.
    <nav aria-label={t("breadcrumb")} className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2">
        <li className="flex">
          <Link href="/" aria-label={t("homeLink")}>
            <Logo className="size-8" />
          </Link>
        </li>
        {key && path && (
          <li
            key={path}
            className="flex min-w-0 items-center gap-2 font-mono text-xs animate-in fade-in slide-in-from-right-2 duration-500 ease-site motion-reduce:animate-none"
          >
            <span aria-hidden className="shrink-0 text-foreground/30">
              ›
            </span>
            <Link
              href={path}
              aria-current={pathname === path ? "page" : undefined}
              className="truncate rounded-md bg-muted px-2 py-1 text-foreground transition-colors hover:text-primary"
            >
              {t(`sections.${key}.short`)}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
}
