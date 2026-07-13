import { cn } from "@/lib/utils";

const CORNERS = [
  "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
] as const;

/**
 * Blueprint "+" registration marks centered on the four corners of the
 * nearest positioned ancestor — the parent must be `relative`.
 */
export function BlueprintCorners({ className }: { className?: string }) {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={cn(
            "blueprint-cross text-foreground/30",
            corner,
            className,
          )}
        />
      ))}
    </>
  );
}
