import Link from "next/link";
import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Logo } from "@/components/decorative/logo";
import { NavLink } from "@/components/nav-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-6 pt-4">
      <div className="relative mx-auto flex h-14 max-w-240 items-center justify-between bg-background/80 px-6 ring-1 ring-foreground/10 backdrop-blur supports-[backdrop-filter]:bg-background/60 2xl:max-w-300">
        <BlueprintCorners />
        <Link href="/" aria-label="Geoffrey Migliacci — accueil">
          <Logo className="size-8" />
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink href="/" exact>
            Accueil
          </NavLink>
          <NavLink href="/articles">Articles</NavLink>
          <NavLink href="/about">À propos</NavLink>
        </nav>
      </div>
    </header>
  );
}
