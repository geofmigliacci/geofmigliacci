import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LatestBlogPosts } from "@/app/[locale]/_components/latest-blog-posts";
import { Masthead } from "@/app/[locale]/_components/masthead";
import { JsonLd } from "@/components/json-ld";
import { localePath } from "@/i18n/locales";
import { toLocale } from "@/i18n/params";
import { getBlogPosts } from "@/lib/blog";
import { graph, websiteJsonLd } from "@/lib/json-ld";
import { jsonLdContext } from "@/lib/json-ld-context";
import { alternatesFor, openGraphBase } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getTranslations({ locale });
  return {
    title: t("meta.home.title"),
    description: t("site.tagline"),
    alternates: alternatesFor("/", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/"),
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);

  const [posts, ctx] = await Promise.all([
    getBlogPosts(locale),
    jsonLdContext(locale),
  ]);

  return (
    <>
      {/* Google reads the site name from the homepage only. */}
      <JsonLd data={graph(websiteJsonLd(ctx))} />
      <div className="page-shell">
        <Masthead />
        {posts.length > 0 && <LatestBlogPosts posts={posts} />}
      </div>
    </>
  );
}
