"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { stripLocale } from "@/i18n/locales";

/** Not next-intl's `usePathname`, which strips only the locale its provider was given. */
export function useMountedPathname(): string | null {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? stripLocale(pathname) : null;
}
