import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/app/[locale]/about/_components/hero";
import { JsonLd } from "@/components/json-ld";
import { type Locale, localePath } from "@/i18n/locales";
import { breadcrumbJsonLd, graph, profilePageJsonLd } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/about", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/about"),
    },
  };
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  const ctx = await jsonLdContext(locale);

  return (
    <>
      <JsonLd
        data={graph(
          profilePageJsonLd(ctx),
          breadcrumbJsonLd(ctx, { path: "/about" }),
        )}
      />
      <Hero />
    </>
  );
}
