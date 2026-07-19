// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LatestArticle } from "@/app/_components/latest-article";
import type { ArticleMeta } from "@/lib/articles";

const article: ArticleMeta = {
  slug: "ef-core-lazy-loading",
  title: "Une ligne de code, 200 requêtes SQL",
  description: "L'histoire vraie d'un N+1.",
  date: "2026-07-17",
  tags: ["dotnet", "ef-core"],
  readingTime: 12,
};

describe("LatestArticle", () => {
  it("renders the ruled section label as a heading", () => {
    render(<LatestArticle article={article} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Dernier article" }),
    ).toBeInTheDocument();
  });

  it("links to the articles index", () => {
    render(<LatestArticle article={article} />);
    expect(
      screen.getByRole("link", { name: "Tous les articles" }),
    ).toHaveAttribute("href", "/articles");
  });

  it("links the whole card to the article", () => {
    render(<LatestArticle article={article} />);
    expect(
      screen.getByRole("link", { name: /une ligne de code/i }),
    ).toHaveAttribute("href", "/articles/ef-core-lazy-loading");
  });

  it("renders the date, reading time, description and tags", () => {
    render(<LatestArticle article={article} />);
    expect(
      screen.getByText("17 juillet 2026 · 12 min de lecture"),
    ).toBeInTheDocument();
    expect(screen.getByText("L'histoire vraie d'un N+1.")).toBeInTheDocument();
    expect(screen.getByText("dotnet")).toBeInTheDocument();
    expect(screen.getByText("ef-core")).toBeInTheDocument();
  });

  it("renders the read affordance", () => {
    render(<LatestArticle article={article} />);
    expect(screen.getByText("Lire l'article")).toBeInTheDocument();
  });
});
