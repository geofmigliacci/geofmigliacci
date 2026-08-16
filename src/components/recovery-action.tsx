import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

type RecoveryActionProps = {
  icon: LucideIcon;
  children: string;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

const STYLES =
  "group inline-flex cursor-pointer items-center gap-2 py-1 font-mono text-xs tracking-eyebrow text-foreground uppercase underline-offset-4 transition-colors hover:text-primary hover:underline";

export function RecoveryAction({
  icon: Icon,
  children,
  href,
  onClick,
}: RecoveryActionProps) {
  // Retrying is not navigation, so it stays a real button and keeps Space as well as Enter.
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={STYLES}>
        <Icon aria-hidden className="size-3.5" />
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={STYLES}>
      <Icon
        aria-hidden
        className="size-3.5 transition-transform group-hover:-translate-x-0.5"
      />
      {children}
    </Link>
  );
}
