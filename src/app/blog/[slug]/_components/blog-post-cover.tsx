import type { StaticImageData } from "next/image";
import { CoverBand, type CoverPosition } from "@/components/cover-band";

interface BlogPostCoverProps {
  cover: StaticImageData;
  alt: string;
  caption?: string;
  position?: CoverPosition;
}

/** Loaded eagerly: this is the post's likely LCP element. */
export function BlogPostCover({
  cover,
  alt,
  caption,
  position,
}: BlogPostCoverProps) {
  return (
    <figure className="my-8">
      <CoverBand cover={cover} alt={alt} position={position} eager />
      {caption && (
        <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
