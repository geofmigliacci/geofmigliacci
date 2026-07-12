"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "hover:text-primary",
        isActive &&
          "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent",
      )}
      nativeButton={false}
      render={<Link href={href} aria-current={isActive ? "page" : undefined} />}
    >
      {children}
    </Button>
  );
}
