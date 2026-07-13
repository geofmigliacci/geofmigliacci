// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ArticleTableOfContents,
  ReadingProgressBar,
} from "@/app/articles/[slug]/_components/article-reading-experience";

describe("ReadingProgressBar", () => {
  it("renders as decorative, hidden from assistive tech", () => {
    const { container } = render(<ReadingProgressBar />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ArticleTableOfContents", () => {
  it("renders no summary when there is only one heading", () => {
    render(
      <ArticleTableOfContents>
        <h2>Introduction</h2>
        <p>Some text</p>
      </ArticleTableOfContents>,
    );

    expect(
      screen.queryByRole("navigation", { name: "Sommaire" }),
    ).not.toBeInTheDocument();
  });

  it("builds a summary from h2/h3 headings, indenting h3 items", () => {
    render(
      <ArticleTableOfContents>
        <h2>Introduction</h2>
        <h3>Details</h3>
        <h2>Conclusion</h2>
      </ArticleTableOfContents>,
    );

    const nav = screen.getByRole("navigation", { name: "Sommaire" });
    const links = within(nav).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Introduction",
      "Details",
      "Conclusion",
    ]);
    expect(links[0]).toHaveAttribute("href", "#introduction");
    expect(links[1]).toHaveAttribute("href", "#details");
    expect(links[2]).toHaveAttribute("href", "#conclusion");

    const listItems = within(nav).getAllByRole("listitem");
    expect(listItems[1]).toHaveClass("ml-4");
    expect(listItems[0]).not.toHaveClass("ml-4");
    expect(listItems[2]).not.toHaveClass("ml-4");
  });

  it("de-duplicates repeated heading text with a numeric suffix", () => {
    render(
      <ArticleTableOfContents>
        <h2>Section</h2>
        <h2>Section</h2>
      </ArticleTableOfContents>,
    );

    const nav = screen.getByRole("navigation", { name: "Sommaire" });
    const links = within(nav).getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "#section");
    expect(links[1]).toHaveAttribute("href", "#section-1");
  });

  it("does not overwrite a heading's existing id", () => {
    render(
      <ArticleTableOfContents>
        <h2 id="custom-id">Introduction</h2>
        <h2>Conclusion</h2>
      </ArticleTableOfContents>,
    );

    const nav = screen.getByRole("navigation", { name: "Sommaire" });
    const links = within(nav).getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "#custom-id");
  });

  it("falls back to a generated id when the heading text yields an empty slug", () => {
    render(
      <ArticleTableOfContents>
        <h2>!!!</h2>
        <h2>Real heading</h2>
      </ArticleTableOfContents>,
    );

    const nav = screen.getByRole("navigation", { name: "Sommaire" });
    const links = within(nav).getAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "#section-0");
  });
});
