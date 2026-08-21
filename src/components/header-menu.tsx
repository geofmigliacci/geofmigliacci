"use client";

import type { Menu } from "@base-ui/react/menu";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, localePath, stripLocale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { HEADER_SECTIONS, SECTION_PATHS } from "@/lib/site";

export function HeaderMenu() {
  const t = useTranslations("nav");
  const active = useLocale();
  const path = stripLocale(usePathname());
  const actions = useRef<Menu.Root.Actions>(null);

  // The trigger is `sm:hidden`: once hidden it anchors the popup at the page origin.
  useEffect(() => {
    const close = () => actions.current?.close();
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <DropdownMenu actionsRef={actions}>
      <DropdownMenuTrigger
        className="sm:hidden"
        render={
          <Button variant="ghost" size="icon-lg" aria-label={t("menu")} />
        }
      >
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {HEADER_SECTIONS.map((key) => (
          <DropdownMenuItem
            key={key}
            render={<Link href={SECTION_PATHS[key]} />}
          >
            {t(`sections.${key}.name`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("language.label")}</DropdownMenuLabel>
          {LOCALES.map((locale) => (
            <DropdownMenuItem
              key={locale}
              render={
                // Plain anchor, per `language-switcher`: a soft locale switch drops the theme.
                <a
                  href={localePath(locale, path)}
                  hrefLang={locale}
                  lang={locale}
                  aria-current={locale === active ? "true" : undefined}
                />
              }
            >
              {t(`language.${locale}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
