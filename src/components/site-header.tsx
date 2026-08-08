import { HeaderBreadcrumb } from "@/components/header-breadcrumb";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="pt-8 md:pt-12">
      <div className="site-container flex h-14 items-center justify-between">
        <HeaderBreadcrumb />
        {/* `shrink-0` so the crumb, not the nav, absorbs a narrow viewport. */}
        <div className="flex shrink-0 items-center gap-2">
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-2"
          >
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/about">À propos</NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
