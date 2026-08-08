import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { person, portraitPath } from "@/lib/site";

const AVATAR_PX = 28;

interface BlogPostBylineProps {
  date: string;
  readingTime?: number;
  updated?: string;
}

/** The separator travels inside its segment, or wrapping strands a lone dot on a line. */
function Segment({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true">·</span>
      {children}
    </span>
  );
}

export function BlogPostByline({
  date,
  readingTime,
  updated,
}: BlogPostBylineProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
      <Link
        href="/about"
        rel="author"
        className="group inline-flex items-center gap-2"
      >
        {/* Empty alt on purpose: the name sits right beside it. */}
        <Image
          src={portraitPath}
          alt=""
          width={AVATAR_PX}
          height={AVATAR_PX}
          className="size-7 shrink-0 object-cover grayscale contrast-125 transition-[filter] group-hover:grayscale-0"
        />
        <span className="font-sans font-medium text-foreground transition-colors group-hover:text-primary">
          {person.name}
        </span>
      </Link>
      <Segment>
        <time dateTime={date}>{formatDate(date)}</time>
      </Segment>
      {readingTime !== undefined && (
        <Segment>
          <span>{readingTime} min de lecture</span>
        </Segment>
      )}
      {updated && updated !== date && (
        <Segment>
          <span>
            Mis à jour le <time dateTime={updated}>{formatDate(updated)}</time>
          </span>
        </Segment>
      )}
    </div>
  );
}
