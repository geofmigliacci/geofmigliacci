import type { Metadata } from "next";
import { Hero } from "@/app/_components/hero";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/json-ld";
import { openGraphBase, rssAlternate } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Ingénieur logiciel senior, +7 ans d'expérience en .NET : le parcours, la stack et la façon de travailler derrière les articles.",
  alternates: { canonical: "/about", types: rssAlternate },
  openGraph: { ...openGraphBase, type: "website", url: "/about" },
};

const BREADCRUMB_TRAIL = [
  { name: "Accueil", path: "/" },
  { name: "À propos", path: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(BREADCRUMB_TRAIL)} />
      <div className="mx-auto w-full max-w-240 px-6 pt-16 md:pt-24 2xl:max-w-300">
        <Breadcrumb items={BREADCRUMB_TRAIL} />
      </div>
      <Hero />
    </>
  );
}
