import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/i18n/locales";
import type { BlogPostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

/** Expects a `group` ancestor, or the title and arrow stop reacting to hover together. */
export function BlogPostSummary({
  post,
  titleAs: Title = "h3",
}: {
  post: BlogPostMeta;
  titleAs?: "h2" | "h3";
}) {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;
  const translated = post.contentLocale === locale;

  return (
    <>
      <p className="font-mono text-xs text-muted-foreground">
        {formatDate(post.date, locale)} ·{" "}
        {t("post.readingTime", { count: post.readingTime })}
      </p>
      {/* `max-w-2xl` holds the title to the same measure as the description below it. */}
      <Title
        lang={translated ? undefined : post.contentLocale}
        className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-balance transition-colors group-hover:text-primary md:text-3xl"
      >
        {post.title}
      </Title>
      <p
        lang={translated ? undefined : post.contentLocale}
        className="mt-3 max-w-2xl text-muted-foreground"
      >
        {post.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {!translated && (
          <Badge variant="outline" className="border-primary/40 text-primary">
            {t("post.untranslated.badge", {
              language: t(`post.untranslated.language.${post.contentLocale}`),
            })}
          </Badge>
        )}
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="mt-6 inline-flex items-center gap-2 font-medium text-primary">
        {t("list.readPost")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </p>
    </>
  );
}
