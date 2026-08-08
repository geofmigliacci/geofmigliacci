"use client";

import { Moon, Sun } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Both icons render and CSS picks one, so nothing reads the theme during render. */
export function ThemeToggle() {
  // A held Enter repeats, and every repeat synthesises a click that strobes the fade.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
    }
  };

  const handleClick = () => {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";

    const apply = () => {
      root.classList.toggle("dark", nextTheme === "dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {}
    };

    if (!document.startViewTransition) {
      apply();
      return;
    }

    document.startViewTransition(apply);
  };

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label="Changer de thème"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
