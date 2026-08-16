"use client";

import { Button } from "@/components/ui/button";
import { useMountedPathname } from "@/components/use-mounted-pathname";
import { Link } from "@/i18n/navigation";
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
  const pathname = useMountedPathname();
  const isActive =
    pathname !== null &&
    (exact ? pathname === href : pathname.startsWith(href));

  return (
    <Button
      variant="ghost"
      size="lg"
      className={cn(
        "hover:bg-transparent hover:text-primary",
        isActive &&
          "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
      )}
      nativeButton={false}
      render={<Link href={href} aria-current={isActive ? "page" : undefined} />}
    >
      {children}
    </Button>
  );
}
