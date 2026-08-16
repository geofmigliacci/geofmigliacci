import { useTranslations } from "next-intl";
import { HeaderBreadcrumb } from "@/components/header-breadcrumb";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SECTION_PATHS } from "@/lib/site";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="pt-8 md:pt-12">
      <div className="site-container flex h-14 items-center justify-between">
        <HeaderBreadcrumb />
        {/* `shrink-0` so the crumb, not the nav, absorbs a narrow viewport. */}
        <div className="flex shrink-0 items-center gap-2">
          <nav aria-label={t("main")} className="flex items-center gap-2">
            <NavLink href={SECTION_PATHS.blog}>
              {t("sections.blog.name")}
            </NavLink>
            <NavLink href={SECTION_PATHS.about}>
              {t("sections.about.name")}
            </NavLink>
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
