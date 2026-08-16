import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Separator } from "@/components/ui/separator";
import { LOCALE_COOKIE, type Locale, localePath } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { contactEmail, host, person, SECTION_PATHS } from "@/lib/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.privacyPolicy" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/privacy-policy", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/privacy-policy"),
    },
  };
}

export default async function PrivacyPolicyPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  const ctx = await jsonLdContext(locale);

  return (
    <div className="page-shell">
      <JsonLd
        data={graph(breadcrumbJsonLd(ctx, { path: "/privacy-policy" }))}
      />
      <PrivacyBody />
    </div>
  );
}

function PrivacyBody() {
  const t = useTranslations("privacy");
  const nav = useTranslations("nav");
  const prevails = t("prevails");

  const code = (chunks: React.ReactNode) => <code>{chunks}</code>;
  const mail = (chunks: React.ReactNode) => <a href={person.email}>{chunks}</a>;

  return (
    <div className="enter-rise">
      <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {nav("sections.privacyPolicy.name")}
      </h1>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        {t("lastUpdatedLabel")} {t("lastUpdated")}
      </p>

      <Separator className="my-8" />

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        {/* Empty in French, which is the version it defers to. */}
        {prevails && <p className="text-muted-foreground italic">{prevails}</p>}

        <h2>{t("summary.heading")}</h2>
        <p>{t("summary.body")}</p>

        <h2>{t("stored.heading")}</h2>
        {/* Both keys come from the constants, so the prose cannot drift from them. */}
        <p>{t.rich("stored.theme", { code, themeKey: THEME_STORAGE_KEY })}</p>
        <p>{t.rich("stored.locale", { code, localeCookie: LOCALE_COOKIE })}</p>
        <p>{t("stored.neverLeaves")}</p>
        <p>{t("stored.consent")}</p>

        <h2>{t("logs.heading")}</h2>
        <p>{t("logs.processor", { host: host.name })}</p>
        <p>
          {t.rich("logs.notRead", {
            link: (chunks) => (
              <a href={host.privacyUrl} target="_blank" rel="noreferrer">
                {chunks}
              </a>
            ),
          })}
        </p>
        <p>{t("logs.transfer", { host: host.name })}</p>

        <h2>{t("writing.heading")}</h2>
        <p>{t.rich("writing.body", { mail, email: contactEmail })}</p>

        <h2>{t("rights.heading")}</h2>
        <p>{t.rich("rights.body", { mail, email: contactEmail })}</p>
        <p>
          {t.rich("rights.complaint", {
            cnil: (chunks) => (
              <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
                {chunks}
              </a>
            ),
          })}
        </p>

        <h2>{t("controller.heading")}</h2>
        <p>
          {t.rich("controller.body", {
            mail,
            email: contactEmail,
            name: person.name,
            host: host.name,
            legal: (chunks) => <Link href={SECTION_PATHS.legal}>{chunks}</Link>,
          })}
        </p>
      </div>
    </div>
  );
}
