import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";

interface UntranslatedNoticeProps {
  contentLocale: Locale;
  slug: string;
}

export function UntranslatedNotice({
  contentLocale,
  slug,
}: UntranslatedNoticeProps) {
  const t = useTranslations("blog.post.untranslated");

  return (
    <aside className="panel mt-8 flex items-start gap-4 bg-muted">
      <Languages aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="text-sm text-muted-foreground">
        {t("body", { language: t(`language.${contentLocale}`) })}{" "}
        <Link
          href={`/blog/${slug}`}
          locale={contentLocale}
          lang={contentLocale}
          className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          {t("readOriginal")}
        </Link>
      </p>
    </aside>
  );
}
