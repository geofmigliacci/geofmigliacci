import { useTranslations } from "next-intl";
import { HeaderBreadcrumb } from "@/components/header-breadcrumb";
import { HeaderMenu } from "@/components/header-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { HEADER_SECTIONS, SECTION_PATHS } from "@/lib/site";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="pt-8 md:pt-12">
      <div className="site-container flex h-14 items-center justify-between">
        <HeaderBreadcrumb />
        {/* `shrink-0` so the crumb, not the nav, absorbs a narrow viewport. */}
        <div className="flex shrink-0 items-center gap-2">
          {/* The burger sits inside the landmark: a nav with only hidden children has no box. */}
          <nav aria-label={t("main")} className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              {HEADER_SECTIONS.map((key) => (
                <NavLink key={key} href={SECTION_PATHS[key]}>
                  {t(`sections.${key}.name`)}
                </NavLink>
              ))}
            </div>
            <HeaderMenu />
          </nav>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
