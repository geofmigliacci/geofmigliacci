"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** `usePathname` directly in the header returns React #418: one 404 document, every URL. */
export function useMountedPathname(): string | null {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? pathname : null;
}
