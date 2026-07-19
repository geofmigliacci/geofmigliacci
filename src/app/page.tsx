import type { Metadata } from "next";
import { LatestArticle } from "@/app/_components/latest-article";
import { Masthead } from "@/app/_components/masthead";
import { JsonLd } from "@/components/json-ld";
import { getArticles } from "@/lib/articles";
import { personJsonLd } from "@/lib/json-ld";
import { openGraphBase, rssAlternate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Geoffrey Migliacci — Ingénieur logiciel senior",
  description:
    "J'écris sur le code, la cuisine, les langues, la philosophie — tout ce qui nourrit ma curiosité et la vie autour.",
  alternates: { canonical: "/", types: rssAlternate },
  openGraph: { ...openGraphBase, type: "website", url: "/" },
};

export default async function Home() {
  const articles = await getArticles();
  const latest = articles.at(0);

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <div className="mx-auto max-w-240 px-6 py-16 md:py-24 2xl:max-w-300">
        <Masthead />
        {latest && <LatestArticle article={latest} />}
      </div>
    </>
  );
}
