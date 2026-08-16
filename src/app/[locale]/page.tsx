import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LatestBlogPosts } from "@/app/[locale]/_components/latest-blog-posts";
import { Masthead } from "@/app/[locale]/_components/masthead";
import { JsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/locales";
import { getBlogPosts } from "@/lib/blog";
import { graph, websiteJsonLd } from "@/lib/json-ld";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { tagline } from "@/lib/site";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Geoffrey Migliacci · Ingénieur logiciel senior",
    description: tagline,
    alternates: alternatesFor("/", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/"),
    },
  };
}

export default async function Home({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getBlogPosts(locale);

  return (
    <>
      {/* Google reads the site name from the homepage only. */}
      <JsonLd data={graph(websiteJsonLd(locale))} />
      <div className="page-shell">
        <Masthead />
        {posts.length > 0 && <LatestBlogPosts posts={posts} />}
      </div>
    </>
  );
}
