import type { StaticImageData } from "next/image";
import type {
  Blog,
  BlogPosting,
  BreadcrumbList,
  Graph,
  Person,
  ProfilePage,
  Thing,
  WebSite,
} from "schema-dts";
import {
  blogDescription,
  person,
  profileUrl,
  siteLanguage,
  siteName,
  siteUrl,
  tagline,
} from "@/lib/site";

/** Fragment-anchored so an identifier never collides with the URL of a page. */
const PERSON_ID = new URL("/#person", siteUrl).href;
const WEBSITE_ID = new URL("/#website", siteUrl).href;
const BLOG_ID = new URL("/blog#blog", siteUrl).href;
const PROFILE_ID = profileUrl;
const postId = (slug: string) => new URL(`/blog/${slug}#post`, siteUrl).href;

/** The only place `@context` is added: every builder below returns a bare node. */
export function graph(...nodes: Thing[]): Graph {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Self-describing: nothing resolves a bare `@id` from the page that defines it. */
const personRef = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: person.name,
  url: PROFILE_ID,
} satisfies Person;

const blogRef = {
  "@type": "Blog",
  "@id": BLOG_ID,
  name: "Blog",
} satisfies Blog;

/** Mapped, not spread: a field added to `person` must not reach the graph unasked. */
export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    alternateName: person.alternateName,
    url: PROFILE_ID,
    image: person.image,
    jobTitle: person.jobTitle,
    description: person.description,
    email: person.email,
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs,
    mainEntityOfPage: { "@type": "ProfilePage", "@id": PROFILE_ID },
  } satisfies Person;
}

/** Google reads the site name from `name` and `url`, and only on the home page. */
export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteName,
    url: siteUrl.href,
    description: tagline,
    inLanguage: siteLanguage,
    publisher: personRef,
  } satisfies WebSite;
}

export function profilePageJsonLd() {
  return {
    "@type": "ProfilePage",
    "@id": PROFILE_ID,
    name: person.name,
    url: PROFILE_ID,
    inLanguage: siteLanguage,
    mainEntity: personJsonLd(),
  } satisfies ProfilePage;
}

interface BlogPostJsonLdInput {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  /** The photograph, not the OG card: Google asks for an image, not a caption. */
  cover: StaticImageData;
  updated?: string;
  readingTime?: number;
}

export function blogPostingJsonLd({
  title,
  description,
  date,
  slug,
  tags,
  cover,
  updated,
  readingTime,
}: BlogPostJsonLdInput) {
  return {
    "@type": "BlogPosting",
    "@id": postId(slug),
    headline: title,
    description,
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(updated ?? date).toISOString(),
    image: new URL(cover.src, siteUrl).href,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/blog/${slug}`, siteUrl).href,
    },
    isPartOf: blogRef,
    inLanguage: siteLanguage,
    keywords: tags,
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    author: personRef,
  } satisfies BlogPosting;
}

export function blogJsonLd() {
  return {
    "@type": "Blog",
    "@id": BLOG_ID,
    name: blogRef.name,
    description: blogDescription,
    url: new URL("/blog", siteUrl).href,
    inLanguage: siteLanguage,
    author: personRef,
  } satisfies Blog;
}

/** A page in a trail needs a row here, and so does every ancestor, or this throws. */
const ROUTES = {
  "/": "Accueil",
  "/blog": "Blog",
  "/about": "À propos",
  "/legal": "Mentions légales",
  "/privacy-policy": "Politique de confidentialité",
} as const;

type StaticPath = keyof typeof ROUTES;

/** The home step stays: two `ListItem`s is Google's floor for showing a trail. */
export function breadcrumbJsonLd(path: StaticPath): BreadcrumbList;
export function breadcrumbJsonLd(
  path: string,
  leafName: string,
): BreadcrumbList;
export function breadcrumbJsonLd(
  path: string,
  leafName?: string,
): BreadcrumbList {
  const segments = path.split("/").filter(Boolean);
  const trail = [
    "/",
    ...segments.map((_, index) => `/${segments.slice(0, index + 1).join("/")}`),
  ];

  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => {
      const name =
        ROUTES[step as StaticPath] ?? (step === path ? leafName : undefined);
      if (!name) {
        throw new Error(
          `Breadcrumb step "${step}" has no name: add it to ROUTES.`,
        );
      }

      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name,
        item: new URL(step, siteUrl).href,
      };
    }),
  } satisfies BreadcrumbList;
}
