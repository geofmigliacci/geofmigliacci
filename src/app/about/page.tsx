import type { Metadata } from "next";
import { Hero } from "@/app/_components/hero";
import { JsonLd } from "@/components/json-ld";
import { personJsonLd } from "@/lib/json-ld";
import { openGraphBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Ingénieur logiciel senior, +7 ans d'expérience en .NET : le parcours, la stack et la façon de travailler derrière les articles.",
  alternates: { canonical: "/about" },
  openGraph: { ...openGraphBase, type: "website", url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Hero />
    </>
  );
}
