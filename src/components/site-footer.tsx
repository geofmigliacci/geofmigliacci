import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { person, SECTION_PATHS } from "@/lib/site";

// Build time, not the visitor's clock: a rebuild is what rolls it over.
const currentYear = new Date().getFullYear();

export function SiteFooter() {
  const t = useTranslations("nav");

  const colophon = [
    { href: SECTION_PATHS.legal, label: t("sections.legal.name") },
    {
      href: SECTION_PATHS.privacyPolicy,
      label: t("sections.privacyPolicy.short"),
    },
    { href: "/feed.xml", label: t("rss") },
  ];

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-8">
        <p className="font-mono text-xs text-muted-foreground">
          © {currentYear} {person.name}
        </p>
        <nav
          aria-label={t("legalInformation")}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {colophon.map(({ href, label }) => (
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
