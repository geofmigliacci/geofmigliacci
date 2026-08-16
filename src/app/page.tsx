import type { Metadata } from "next";
import { LatestBlogPosts } from "@/app/_components/latest-blog-posts";
import { Masthead } from "@/app/_components/masthead";
import { JsonLd } from "@/components/json-ld";
import { getBlogPosts } from "@/lib/blog";
import { graph, websiteJsonLd } from "@/lib/json-ld";
import { openGraphBase, rssAlternate, tagline } from "@/lib/site";

export const metadata: Metadata = {
  title: "Geoffrey Migliacci · Ingénieur logiciel senior",
  description: tagline,
  alternates: { canonical: "/", types: rssAlternate },
  openGraph: { ...openGraphBase, type: "website", url: "/" },
};

export default async function Home() {
  const posts = await getBlogPosts("fr");

  return (
    <>
      {/* Google reads the site name from the homepage only. */}
      <JsonLd data={graph(websiteJsonLd())} />
      <div className="page-shell">
        <Masthead />
        {posts.length > 0 && <LatestBlogPosts posts={posts} />}
      </div>
    </>
  );
}
