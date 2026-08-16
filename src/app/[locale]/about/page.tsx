import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/app/[locale]/about/_components/hero";
import { JsonLd } from "@/components/json-ld";
import { type Locale, localePath } from "@/i18n/locales";
import { breadcrumbJsonLd, graph, profilePageJsonLd } from "@/lib/json-ld";
import { alternatesFor, openGraphBase } from "@/lib/metadata";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "À propos",
    description:
      "Ingénieur logiciel senior, +7 ans d'expérience en .NET : le parcours, la stack et la façon de travailler derrière les billets.",
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

  return (
    <>
      <JsonLd
        data={graph(
          profilePageJsonLd(locale),
          breadcrumbJsonLd({ locale, path: "/about" }),
        )}
      />
      <Hero />
    </>
  );
}
