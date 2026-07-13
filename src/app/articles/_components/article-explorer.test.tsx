// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleExplorer } from "@/app/articles/_components/article-explorer";
import type { ArticleMeta } from "@/lib/articles";

const articleA: ArticleMeta = {
  slug: "article-a",
  title: "Article A",
  description: "Description A",
  date: "2026-01-01",
  tags: ["dev"],
  readingTime: 3,
};

const articleB: ArticleMeta = {
  slug: "article-b",
  title: "Article B",
  description: "Description B",
  date: "2026-02-01",
  tags: ["cuisine"],
  readingTime: 5,
};

const articleC: ArticleMeta = {
  slug: "article-c",
  title: "Article C",
  description: "Description C",
  date: "2026-03-01",
  tags: ["dev", "cuisine"],
  readingTime: 2,
};

describe("ArticleExplorer", () => {
  it("renders every article and no tag filter when there is one or fewer unique tags", () => {
    render(<ArticleExplorer articles={[articleA]} />);

    expect(
      screen.queryByRole("button", { name: "dev" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Article A")).toBeInTheDocument();
  });

  it("shows the tag filter, deduped and sorted, when there are multiple unique tags", () => {
    render(<ArticleExplorer articles={[articleA, articleB, articleC]} />);

    const tagButtons = screen
      .getAllByRole("button")
      .filter((button) =>
        ["dev", "cuisine"].includes(button.textContent ?? ""),
      );

    expect(tagButtons.map((button) => button.textContent)).toEqual([
      "cuisine",
      "dev",
    ]);
  });

  it("filters to articles matching the selected tag", () => {
    render(<ArticleExplorer articles={[articleA, articleB, articleC]} />);

    fireEvent.click(screen.getByRole("button", { name: "cuisine" }));

    expect(screen.queryByText("Article A")).not.toBeInTheDocument();
    expect(screen.getByText("Article B")).toBeInTheDocument();
    expect(screen.getByText("Article C")).toBeInTheDocument();
  });

  it("shows the union of articles matching any selected tag", () => {
    render(<ArticleExplorer articles={[articleA, articleB, articleC]} />);

    fireEvent.click(screen.getByRole("button", { name: "cuisine" }));
    fireEvent.click(screen.getByRole("button", { name: "dev" }));

    expect(screen.getByText("Article A")).toBeInTheDocument();
    expect(screen.getByText("Article B")).toBeInTheDocument();
    expect(screen.getByText("Article C")).toBeInTheDocument();
  });

  it("shows a reset button only while a filter is active, and clears the filter on click", () => {
    render(<ArticleExplorer articles={[articleA, articleB, articleC]} />);

    expect(
      screen.queryByRole("button", { name: "Réinitialiser les filtres" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "dev" }));
    expect(screen.queryByText("Article B")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Réinitialiser les filtres" }),
    );

    expect(screen.getByText("Article A")).toBeInTheDocument();
    expect(screen.getByText("Article B")).toBeInTheDocument();
    expect(screen.getByText("Article C")).toBeInTheDocument();
  });

  it("shows a no-matches empty state when the active filter matches nothing, and can reset from it", () => {
    const { rerender } = render(
      <ArticleExplorer articles={[articleA, articleB]} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "dev" }));
    expect(screen.getByText("Article A")).toBeInTheDocument();

    rerender(<ArticleExplorer articles={[articleB]} />);

    expect(screen.getByText("Aucun article pour ces tags")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Réinitialiser les filtres" }),
    );

    expect(screen.getByText("Article B")).toBeInTheDocument();
  });

  it("renders each article card's title, description, date, reading time, tags, and link", () => {
    render(<ArticleExplorer articles={[articleA]} />);

    expect(screen.getByText("Article A")).toBeInTheDocument();
    expect(screen.getByText("Description A")).toBeInTheDocument();
    expect(screen.getByText(/3 min de lecture/)).toBeInTheDocument();
    expect(screen.getByText("dev")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/articles/article-a",
    );
  });
});
