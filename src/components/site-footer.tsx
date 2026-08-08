import Link from "next/link";
import { person } from "@/lib/site";

// Build time, not the visitor's clock: a rebuild is what rolls it over.
const currentYear = new Date().getFullYear();

const COLOPHON_LINKS = [
  { href: "/legal", label: "Mentions légales" },
  { href: "/privacy-policy", label: "Confidentialité" },
  { href: "/feed.xml", label: "RSS" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-8">
        <p className="font-mono text-xs text-muted-foreground">
          © {currentYear} {person.name}
        </p>
        <nav
          aria-label="Informations légales"
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {COLOPHON_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-1 font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
