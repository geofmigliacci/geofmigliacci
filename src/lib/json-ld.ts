import { person, siteUrl } from "@/lib/site";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...person,
  };
}

interface ArticleJsonLdInput {
  title: string;
  description: string;
  date: string;
  slug: string;
}

export function articleJsonLd({
  title,
  description,
  date,
  slug,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    image: new URL(`/articles/${slug}/opengraph-image/og`, siteUrl).href,
    url: new URL(`/articles/${slug}`, siteUrl).href,
    author: {
      "@type": "Person",
      name: person.name,
      url: person.url,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).href,
    })),
  };
}
