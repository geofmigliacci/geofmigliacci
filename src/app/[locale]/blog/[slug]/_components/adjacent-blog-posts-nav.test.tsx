// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { AdjacentBlogPostsNav } from "@/app/[locale]/blog/[slug]/_components/adjacent-blog-posts-nav";
import type { BlogPostMeta } from "@/lib/blog";
import { testCover, testCoverAlt } from "@/lib/blog.fixtures";
import { render, screen, within } from "@/test-utils";

const olderPost: BlogPostMeta = {
  slug: "older-post",
  title: "Older Post",
  description: "An older post",
  date: "2026-01-01",
  tags: [],
  readingTime: 1,
  cover: testCover,
  coverAlt: testCoverAlt,
};

const newerPost: BlogPostMeta = {
  slug: "newer-post",
  title: "Newer Post",
  description: "A newer post",
  date: "2026-06-01",
  tags: [],
  readingTime: 1,
  cover: testCover,
  coverAlt: testCoverAlt,
};

describe("AdjacentBlogPostsNav", () => {
  it("renders nothing when there is no adjacent post", () => {
    const { container } = render(<AdjacentBlogPostsNav />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only the older post card when there is no newer one", () => {
    render(<AdjacentBlogPostsNav olderPost={olderPost} />);

    const nav = screen.getByRole("navigation", {
      name: "Navigation entre billets",
    });
    const link = within(nav).getByRole("link", {
      name: /billet plus ancien/i,
    });

    expect(link).toHaveAttribute("href", "/fr/blog/older-post");
    expect(within(link).getByText("Older Post")).toBeInTheDocument();
    expect(
      within(nav).queryByRole("link", { name: /billet plus récent/i }),
    ).not.toBeInTheDocument();
  });

  it("renders only the newer post card when there is no older one", () => {
    render(<AdjacentBlogPostsNav newerPost={newerPost} />);

    const nav = screen.getByRole("navigation", {
      name: "Navigation entre billets",
    });
    const link = within(nav).getByRole("link", {
      name: /billet plus récent/i,
    });

    expect(link).toHaveAttribute("href", "/fr/blog/newer-post");
    expect(within(link).getByText("Newer Post")).toBeInTheDocument();
    expect(
      within(nav).queryByRole("link", { name: /billet plus ancien/i }),
    ).not.toBeInTheDocument();
  });

  it("renders both cards, older first and newer second", () => {
    render(
      <AdjacentBlogPostsNav olderPost={olderPost} newerPost={newerPost} />,
    );

    const nav = screen.getByRole("navigation", {
      name: "Navigation entre billets",
    });
    const links = within(nav).getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/fr/blog/older-post");
    expect(links[1]).toHaveAttribute("href", "/fr/blog/newer-post");
  });
});
