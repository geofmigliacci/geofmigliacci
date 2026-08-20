import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/app/[locale]/about/_components/hero";
import { JsonLd } from "@/components/json-ld";
import { localePath } from "@/i18n/locales";
import { toLocale } from "@/i18n/params";
import { breadcrumbJsonLd, graph, profilePageJsonLd } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
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

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const locale = toLocale((await params).locale);
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
