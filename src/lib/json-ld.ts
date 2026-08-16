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
import { LANGUAGE_TAG, type Locale, localePath } from "@/i18n/locales";
import {
  blogDescription,
  home,
  person,
  sections,
  siteName,
  siteUrl,
  tagline,
} from "@/lib/site";

const absolute = (locale: Locale, path: string) =>
  new URL(localePath(locale, path), siteUrl).href;

/** Fragment-anchored so an identifier never collides with the URL of a page. */
const PERSON_ID = new URL("/#person", siteUrl).href;
const WEBSITE_ID = new URL("/#website", siteUrl).href;

/** These are page URLs, unlike the two above, so they carry the locale. */
const blogId = (locale: Locale) => `${absolute(locale, "/blog")}#blog`;
const profileId = (locale: Locale) => absolute(locale, "/about");
const postId = (locale: Locale, slug: string) =>
  `${absolute(locale, `/blog/${slug}`)}#post`;

/** The only place `@context` is added: every builder below returns a bare node. */
export function graph(...nodes: Thing[]): Graph {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Self-describing: nothing resolves a bare `@id` from the page that defines it. */
const personRef = (locale: Locale) =>
  ({
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    url: profileId(locale),
  }) satisfies Person;

const blogRef = (locale: Locale) =>
  ({
    "@type": "Blog",
    "@id": blogId(locale),
    name: sections.blog.name,
  }) satisfies Blog;

/** Mapped, not spread: a field added to `person` must not reach the graph unasked. */
export function personJsonLd(locale: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    alternateName: person.alternateName,
    url: profileId(locale),
    image: person.image,
    jobTitle: person.jobTitle,
    description: person.description,
    email: person.email,
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs,
    mainEntityOfPage: { "@type": "ProfilePage", "@id": profileId(locale) },
  } satisfies Person;
}

/** Google reads the site name from `name` and `url`, and only on the home page. */
export function websiteJsonLd(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteName,
    url: absolute(locale, "/"),
    description: tagline,
    inLanguage: LANGUAGE_TAG[locale],
    publisher: personRef(locale),
  } satisfies WebSite;
}

export function profilePageJsonLd(locale: Locale) {
  return {
    "@type": "ProfilePage",
    "@id": profileId(locale),
    name: person.name,
    url: profileId(locale),
    inLanguage: LANGUAGE_TAG[locale],
    mainEntity: personJsonLd(locale),
  } satisfies ProfilePage;
}

interface BlogPostJsonLdInput {
  locale: Locale;
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
  locale,
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
    "@id": postId(locale, slug),
    headline: title,
    description,
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(updated ?? date).toISOString(),
    image: new URL(cover.src, siteUrl).href,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolute(locale, `/blog/${slug}`),
    },
    isPartOf: blogRef(locale),
    inLanguage: LANGUAGE_TAG[locale],
    keywords: tags,
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    author: personRef(locale),
  } satisfies BlogPosting;
}

export function blogJsonLd(locale: Locale) {
  return {
    "@type": "Blog",
    "@id": blogId(locale),
    name: sections.blog.name,
    description: blogDescription,
    url: absolute(locale, "/blog"),
    inLanguage: LANGUAGE_TAG[locale],
    author: personRef(locale),
  } satisfies Blog;
}

/** A page in a trail needs a row here, and so does every ancestor, or this throws. */
const ROUTES = {
  [home.path]: home.name,
  [sections.blog.path]: sections.blog.name,
  [sections.about.path]: sections.about.name,
  [sections.legal.path]: sections.legal.name,
  [sections.privacyPolicy.path]: sections.privacyPolicy.name,
} as const;

interface BreadcrumbInput {
  locale: Locale;
  /** Locale-less: the prefix is added when building each URL, never looked up. */
  path: string;
  leafName?: string;
}

/** The home step stays: two `ListItem`s is Google's floor for showing a trail. */
export function breadcrumbJsonLd({
  locale,
  path,
  leafName,
}: BreadcrumbInput): BreadcrumbList {
  const segments = path.split("/").filter(Boolean);
  const trail = [
    "/",
    ...segments.map((_, index) => `/${segments.slice(0, index + 1).join("/")}`),
  ];

  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => {
      const name =
        ROUTES[step as keyof typeof ROUTES] ??
        (step === path ? leafName : undefined);
      if (!name) {
        throw new Error(
          `Breadcrumb step "${step}" has no name: add it to ROUTES.`,
        );
      }

      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name,
        item: absolute(locale, step),
      };
    }),
  } satisfies BreadcrumbList;
}
