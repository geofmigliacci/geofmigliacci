import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("blog.post");
  const locale = useLocale();

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
        <time dateTime={date}>{formatDate(date, locale)}</time>
      </Segment>
      {readingTime !== undefined && (
        <Segment>
          <span>{t("readingTime", { count: readingTime })}</span>
        </Segment>
      )}
      {updated && updated !== date && (
        <Segment>
          <span>
            {t("updatedOn")}{" "}
            <time dateTime={updated}>{formatDate(updated, locale)}</time>
          </span>
        </Segment>
      )}
    </div>
  );
}
