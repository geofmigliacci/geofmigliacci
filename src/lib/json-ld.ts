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
import { person, siteName, siteUrl } from "@/lib/site";

/**
 * The translated half of the graph. Passed in rather than read here, so this
 * module stays pure and its test needs no request context.
 */
export interface JsonLdCopy {
  tagline: string;
  blogDescription: string;
  pitch: string;
  jobTitle: string;
  knowsAbout: string[];
  blogName: string;
  /** Locale-less path to display name, for the breadcrumb trail. */
  routeNames: Record<string, string>;
}

export interface JsonLdContext extends JsonLdCopy {
  locale: Locale;
}

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

/** Mapped, not spread: a field added to `person` must not reach the graph unasked. */
export function personJsonLd(ctx: JsonLdContext) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    alternateName: person.alternateName,
    url: profileId(ctx.locale),
    image: person.image,
    jobTitle: ctx.jobTitle,
    description: ctx.pitch,
    email: person.email,
    knowsAbout: ctx.knowsAbout,
    sameAs: person.sameAs,
    mainEntityOfPage: { "@type": "ProfilePage", "@id": profileId(ctx.locale) },
  } satisfies Person;
}

/** Google reads the site name from `name` and `url`, and only on the home page. */
export function websiteJsonLd(ctx: JsonLdContext) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteName,
    url: absolute(ctx.locale, "/"),
    description: ctx.tagline,
    inLanguage: LANGUAGE_TAG[ctx.locale],
    publisher: personRef(ctx.locale),
  } satisfies WebSite;
}

export function profilePageJsonLd(ctx: JsonLdContext) {
  return {
    "@type": "ProfilePage",
    "@id": profileId(ctx.locale),
    name: person.name,
    url: profileId(ctx.locale),
    inLanguage: LANGUAGE_TAG[ctx.locale],
    mainEntity: personJsonLd(ctx),
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
  /** The locale the body is written in, which a fallback makes differ from the page's. */
  contentLocale?: Locale;
}

export function blogPostingJsonLd(
  ctx: JsonLdContext,
  {
    title,
    description,
    date,
    slug,
    tags,
    cover,
    updated,
    readingTime,
    contentLocale,
  }: BlogPostJsonLdInput,
) {
  // One post, one identity: a fallback page describes the original, not itself.
  const locale = contentLocale ?? ctx.locale;

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
    isPartOf: {
      "@type": "Blog",
      "@id": blogId(locale),
      name: ctx.blogName,
    },
    inLanguage: LANGUAGE_TAG[locale],
    keywords: tags,
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    author: personRef(locale),
  } satisfies BlogPosting;
}

export function blogJsonLd(ctx: JsonLdContext) {
  return {
    "@type": "Blog",
    "@id": blogId(ctx.locale),
    name: ctx.blogName,
    description: ctx.blogDescription,
    url: absolute(ctx.locale, "/blog"),
    inLanguage: LANGUAGE_TAG[ctx.locale],
    author: personRef(ctx.locale),
  } satisfies Blog;
}

/** The home step stays: two `ListItem`s is Google's floor for showing a trail. */
export function breadcrumbJsonLd(
  ctx: JsonLdContext,
  { path, leafName }: { path: string; leafName?: string },
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
        ctx.routeNames[step] ?? (step === path ? leafName : undefined);
      // A page in a trail needs a row here, and so does every ancestor.
      if (!name) {
        throw new Error(`Breadcrumb step "${step}" has no name.`);
      }

      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name,
        item: absolute(ctx.locale, step),
      };
    }),
  } satisfies BreadcrumbList;
}
