import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { personJsonLd } from "@/lib/json-ld";
import { openGraphBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Geoffrey Migliacci — Ingénieur logiciel",
  description:
    "J'écris sur le code, la cuisine, les langues, la philosophie — tout ce qui nourrit ma curiosité et la vie autour.",
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, type: "website", url: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Hero />
    </>
  );
}
