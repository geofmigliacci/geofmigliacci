// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { LatestBlogPosts } from "@/app/[locale]/_components/latest-blog-posts";
import type { BlogPostMeta } from "@/lib/blog";
import { testCover, testCoverAlt } from "@/lib/blog.fixtures";
import { render, screen } from "@/test-utils";

const post: BlogPostMeta = {
  slug: "ef-core-lazy-loading",
  title: "Une ligne de code, 200 requêtes SQL",
  description: "L'histoire vraie d'un N+1.",
  date: "2026-07-17",
  tags: ["dotnet", "ef-core"],
  readingTime: 12,
  contentLocale: "fr",
  cover: testCover,
  coverAlt: testCoverAlt,
};

const previous = (index: number): BlogPostMeta => ({
  slug: `post-${index}`,
  title: `Post ${index}`,
  description: `Description ${index}`,
  date: `2026-06-${String(index).padStart(2, "0")}`,
  tags: ["dotnet"],
  contentLocale: "fr",
  readingTime: index,
  cover: testCover,
  coverAlt: testCoverAlt,
});

const previousPosts = [5, 4, 3, 2, 1].map(previous);

describe("LatestBlogPosts", () => {
  it("renders the ruled section label as a heading", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Derniers billets" }),
    ).toBeInTheDocument();
  });

  it("links to the posts index", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(
      screen.getByRole("link", { name: "Tous les billets" }),
    ).toHaveAttribute("href", "/fr/blog");
  });

  // The counterpart to blog-post-explorer.test.tsx's h2 case, one level deeper.
  it("titles the featured entry as h3, under the section heading", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(
      screen.getByRole("heading", { level: 3, name: /une ligne de code/i }),
    ).toBeInTheDocument();
  });

  it("links the whole card to the latest post", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(
      screen.getByRole("link", { name: /une ligne de code/i }),
    ).toHaveAttribute("href", "/fr/blog/ef-core-lazy-loading");
  });

  it("renders the date, reading time, description and tags of the latest post", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(
      screen.getByText("17 juillet 2026 · 12 min de lecture"),
    ).toBeInTheDocument();
    expect(screen.getByText("L'histoire vraie d'un N+1.")).toBeInTheDocument();
    expect(screen.getByText("dotnet")).toBeInTheDocument();
    expect(screen.getByText("ef-core")).toBeInTheDocument();
  });

  it("renders the read affordance", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(screen.getByText("Lire le billet")).toBeInTheDocument();
  });

  it("lists the previous posts as compact rows", () => {
    render(<LatestBlogPosts posts={[post, ...previousPosts]} />);
    expect(screen.getByRole("link", { name: /post 5/i })).toHaveAttribute(
      "href",
      "/fr/blog/post-5",
    );
    expect(screen.getByText("5 juin 2026")).toBeInTheDocument();
  });

  it("caps the previous posts at four", () => {
    render(<LatestBlogPosts posts={[post, ...previousPosts]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.queryByRole("link", { name: /post 1/i })).toBeNull();
  });

  it("renders only the latest post when it is the sole one", () => {
    render(<LatestBlogPosts posts={[post]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
