import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Separator } from "@/components/ui/separator";
import { localePath } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { toLocale } from "@/i18n/params";
import { breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { contactEmail, host, person, repoUrl, SECTION_PATHS } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta.legal" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/legal", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/legal"),
    },
  };
}

export default async function LegalPage({
  params,
}: PageProps<"/[locale]/legal">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);

  const ctx = await jsonLdContext(locale);

  return (
    <div className="page-shell">
      <JsonLd data={graph(breadcrumbJsonLd(ctx, { path: "/legal" }))} />
      <LegalBody />
    </div>
  );
}

function LegalBody() {
  const t = useTranslations("legal");
  const nav = useTranslations("nav");
  const site = useTranslations("site");
  const prevails = t("prevails");

  return (
    <div className="enter-rise">
      <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {nav("sections.legal.name")}
      </h1>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        {t("lastUpdatedLabel")} {t("lastUpdated")}
      </p>

      <Separator className="my-8" />

      {/* Base `prose`, not the posts' `prose-lg`: reference text you
          consult is not editorial text you read. */}
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        {/* Empty in French, which is the version it defers to. */}
        {prevails && <p className="text-muted-foreground italic">{prevails}</p>}

        <h2>{t("publisher.heading")}</h2>
        <p>{t("publisher.individual", { name: person.name })}</p>
        <p>
          {t("publisher.director", { name: person.name })}
          <br />
          {t("publisher.contactLabel")}{" "}
          <a href={person.email}>{contactEmail}</a>
        </p>
        <p>{t("publisher.lcen")}</p>

        <h2>{t("host.heading")}</h2>
        <p>
          {host.name}
          <br />
          {site("hostAddress")}
          <br />
          <a href={host.url} target="_blank" rel="noreferrer">
            {host.url}
          </a>
        </p>

        <h2>{t("intellectualProperty.heading")}</h2>
        <p>{t("intellectualProperty.owned", { name: person.name })}</p>
        <p>{t("intellectualProperty.reuse")}</p>
        <p>
          {t.rich("intellectualProperty.code", {
            repo: (chunks) => (
              <a href={repoUrl} target="_blank" rel="noreferrer">
                {chunks}
              </a>
            ),
          })}
        </p>
        <p>{t("intellectualProperty.snippets")}</p>

        <h2>{t("liability.heading")}</h2>
        <p>{t("liability.body")}</p>

        <h2>{t("externalLinks.heading")}</h2>
        <p>{t("externalLinks.body")}</p>

        <h2>{t("personalData.heading")}</h2>
        <p>
          {t.rich("personalData.body", {
            privacy: (chunks) => (
              <Link href={SECTION_PATHS.privacyPolicy}>{chunks}</Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
