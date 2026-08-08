import type { ReactNode } from "react";

export function Quote({
  children,
  author,
  source,
  href,
}: {
  children: ReactNode;
  author?: string;
  source?: string;
  href?: string;
}) {
  return (
    <figure>
      <blockquote cite={href}>{children}</blockquote>
      {author && (
        <figcaption>
          {author}
          {source && (
            <>
              {" · "}
              <cite>{href ? <a href={href}>{source}</a> : source}</cite>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
