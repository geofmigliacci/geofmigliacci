import { ArrowRight, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { AccentRule } from "@/components/decorative/accent-rule";
import { type Locale, localePath } from "@/i18n/locales";

interface UntranslatedNoticeProps {
  contentLocale: Locale;
  slug: string;
}

export function UntranslatedNotice({
  contentLocale,
  slug,
}: UntranslatedNoticeProps) {
  const t = useTranslations("blog.post.untranslated");
  const language = t(`language.${contentLocale}`);

  return (
    <aside className="panel my-8 border-l-2 border-l-primary bg-accent">
      <div className="flex items-center gap-4">
        <Languages aria-hidden className="size-4 shrink-0 text-primary" />
        <p className="font-mono text-xs leading-none tracking-eyebrow text-primary uppercase">
          {t("eyebrow", { language })}
        </p>
        <AccentRule />
      </div>
      <p className="mt-4 text-foreground">{t("body")}</p>
      {/* A plain anchor, like the language switcher: a soft navigation across
          `[locale]` remounts the layout over the theme class the boot script set. */}
      <a
        href={localePath(contentLocale, `/blog/${slug}`)}
        hrefLang={contentLocale}
        className="group/original mt-4 inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("readOriginal")}
        <ArrowRight className="size-4 transition-transform group-hover/original:translate-x-1 motion-reduce:transition-none" />
      </a>
    </aside>
  );
}
