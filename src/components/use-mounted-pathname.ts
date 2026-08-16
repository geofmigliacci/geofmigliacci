"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { stripLocale } from "@/i18n/locales";

/**
 * Locale-less, so the value can be compared against the route table directly.
 * Stripped here rather than through next-intl's `usePathname`, which strips only
 * the locale its provider was given: `global-not-found.tsx` renders in the
 * default one whatever locale the URL asked for, and the crumb has to survive it.
 *
 * `usePathname` directly in the header returns React #418: one 404 document, every URL.
 */
export function useMountedPathname(): string | null {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? stripLocale(pathname) : null;
}
