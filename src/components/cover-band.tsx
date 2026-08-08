import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

/** Tracks `site-container`: its cap less the inline padding, or the browser assumes `100vw`. */
const COVER_SIZES = "(min-width: 1200px) 72rem, calc(100vw - 3rem)";

export type CoverPosition = "bottom" | "center";

/** A lookup, not interpolation: Tailwind only sees whole class names in source. */
const OBJECT_POSITION: Record<CoverPosition, string> = {
  bottom: "object-bottom",
  center: "object-center",
};

interface CoverBandProps {
  cover: StaticImageData;
  alt: string;
  position?: CoverPosition;
  eager?: boolean;
  interactive?: boolean;
}

export function CoverBand({
  cover,
  alt,
  position = "bottom",
  eager = false,
  interactive = false,
}: CoverBandProps) {
  return (
    <div className="relative aspect-2/1 w-full overflow-hidden md:aspect-3/1">
      {/* `priority` is deprecated as of Next 16. */}
      <Image
        src={cover}
        alt={alt}
        fill
        sizes={COVER_SIZES}
        placeholder="blur"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={cn(
          "object-cover saturate-[0.85] contrast-[1.05]",
          OBJECT_POSITION[position],
          // `photo-lift` needs `group` on an ancestor, which only the list's link supplies.
          interactive && "photo-lift",
        )}
      />
    </div>
  );
}
