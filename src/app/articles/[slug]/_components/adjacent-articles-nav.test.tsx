// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdjacentArticlesNav } from "@/app/articles/[slug]/_components/adjacent-articles-nav";
import type { ArticleMeta } from "@/lib/articles";

const olderArticle: ArticleMeta = {
  slug: "older-post",
  title: "Older Post",
  description: "An older article",
  date: "2026-01-01",
  tags: [],
  readingTime: 1,
};

const newerArticle: ArticleMeta = {
  slug: "newer-post",
  title: "Newer Post",
  description: "A newer article",
  date: "2026-06-01",
  tags: [],
  readingTime: 1,
};

describe("AdjacentArticlesNav", () => {
  it("renders nothing when there is no adjacent article", () => {
    const { container } = render(<AdjacentArticlesNav />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only the older article card when there is no newer one", () => {
    render(<AdjacentArticlesNav olderArticle={olderArticle} />);

    const nav = screen.getByRole("navigation", {
      name: "Navigation entre articles",
    });
    const link = within(nav).getByRole("link", {
      name: /article plus ancien/i,
    });

    expect(link).toHaveAttribute("href", "/articles/older-post");
    expect(within(link).getByText("Older Post")).toBeInTheDocument();
    expect(
      within(nav).queryByRole("link", { name: /article plus récent/i }),
    ).not.toBeInTheDocument();
  });

  it("renders only the newer article card when there is no older one", () => {
    render(<AdjacentArticlesNav newerArticle={newerArticle} />);

    const nav = screen.getByRole("navigation", {
      name: "Navigation entre articles",
    });
    const link = within(nav).getByRole("link", {
      name: /article plus récent/i,
    });

    expect(link).toHaveAttribute("href", "/articles/newer-post");
    expect(within(link).getByText("Newer Post")).toBeInTheDocument();
    expect(
      within(nav).queryByRole("link", { name: /article plus ancien/i }),
    ).not.toBeInTheDocument();
  });

  it("renders both cards, older first and newer second", () => {
    render(
      <AdjacentArticlesNav
        olderArticle={olderArticle}
        newerArticle={newerArticle}
      />,
    );

    const nav = screen.getByRole("navigation", {
      name: "Navigation entre articles",
    });
    const links = within(nav).getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/articles/older-post");
    expect(links[1]).toHaveAttribute("href", "/articles/newer-post");
  });
});
