// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPostExplorer } from "@/app/blog/_components/blog-post-explorer";
import type { BlogPostMeta } from "@/lib/blog";
import { testCover, testCoverAlt } from "@/lib/blog.fixtures";

const postA: BlogPostMeta = {
  slug: "post-a",
  title: "Post A",
  description: "Description A",
  date: "2026-01-01",
  tags: ["dev"],
  readingTime: 3,
  cover: testCover,
  coverAlt: testCoverAlt,
};

const postB: BlogPostMeta = {
  slug: "post-b",
  title: "Post B",
  description: "Description B",
  date: "2026-02-01",
  tags: ["cuisine"],
  readingTime: 5,
  cover: testCover,
  coverAlt: testCoverAlt,
};

const postC: BlogPostMeta = {
  slug: "post-c",
  title: "Post C",
  description: "Description C",
  date: "2026-03-01",
  tags: ["dev", "cuisine"],
  readingTime: 2,
  cover: testCover,
  coverAlt: testCoverAlt,
};

describe("BlogPostExplorer", () => {
  it("renders every post and no tag filter when there is one or fewer unique tags", () => {
    render(<BlogPostExplorer posts={[postA]} />);

    expect(
      screen.queryByRole("button", { name: "dev" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Post A")).toBeInTheDocument();
  });

  it("shows the tag filter, deduped and sorted, when there are multiple unique tags", () => {
    render(<BlogPostExplorer posts={[postA, postB, postC]} />);

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

  it("filters to posts matching the selected tag", () => {
    render(<BlogPostExplorer posts={[postA, postB, postC]} />);

    fireEvent.click(screen.getByRole("button", { name: "cuisine" }));

    expect(screen.queryByText("Post A")).not.toBeInTheDocument();
    expect(screen.getByText("Post B")).toBeInTheDocument();
    expect(screen.getByText("Post C")).toBeInTheDocument();
  });

  it("shows the union of posts matching any selected tag", () => {
    render(<BlogPostExplorer posts={[postA, postB, postC]} />);

    fireEvent.click(screen.getByRole("button", { name: "cuisine" }));
    fireEvent.click(screen.getByRole("button", { name: "dev" }));

    expect(screen.getByText("Post A")).toBeInTheDocument();
    expect(screen.getByText("Post B")).toBeInTheDocument();
    expect(screen.getByText("Post C")).toBeInTheDocument();
  });

  it("shows a reset button only while a filter is active, and clears the filter on click", () => {
    render(<BlogPostExplorer posts={[postA, postB, postC]} />);

    expect(
      screen.queryByRole("button", { name: "Réinitialiser les filtres" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "dev" }));
    expect(screen.queryByText("Post B")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Réinitialiser les filtres" }),
    );

    expect(screen.getByText("Post A")).toBeInTheDocument();
    expect(screen.getByText("Post B")).toBeInTheDocument();
    expect(screen.getByText("Post C")).toBeInTheDocument();
  });

  it("shows a no-matches empty state when the active filter matches nothing, and can reset from it", () => {
    const { rerender } = render(<BlogPostExplorer posts={[postA, postB]} />);

    fireEvent.click(screen.getByRole("button", { name: "dev" }));
    expect(screen.getByText("Post A")).toBeInTheDocument();

    rerender(<BlogPostExplorer posts={[postB]} />);

    expect(screen.getByText("Aucun billet pour ces tags")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Réinitialiser les filtres" }),
    );

    expect(screen.getByText("Post B")).toBeInTheDocument();
  });

  it("announces the filtered count in a live region", () => {
    render(<BlogPostExplorer posts={[postA, postB, postC]} />);

    const region = screen.getByText("3 billets affichés");
    expect(region).toHaveAttribute("aria-live", "polite");

    fireEvent.click(screen.getByRole("button", { name: "cuisine" }));

    expect(screen.getByText("2 billets affichés")).toBeInTheDocument();
  });

  it("announces the empty result without repeating the visible empty state", () => {
    const { rerender } = render(<BlogPostExplorer posts={[postA, postB]} />);

    fireEvent.click(screen.getByRole("button", { name: "dev" }));
    rerender(<BlogPostExplorer posts={[postB]} />);

    expect(screen.getByText("Aucun billet ne correspond")).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByText("Aucun billet pour ces tags")).toBeInTheDocument();
  });

  it("titles list entries as h2, directly under the page h1", () => {
    render(<BlogPostExplorer posts={[postA]} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Post A" }),
    ).toBeInTheDocument();
  });

  it("renders each post card's title, description, date, reading time, tags, and link", () => {
    render(<BlogPostExplorer posts={[postA]} />);

    expect(screen.getByText("Post A")).toBeInTheDocument();
    expect(screen.getByText("Description A")).toBeInTheDocument();
    expect(screen.getByText(/3 min de lecture/)).toBeInTheDocument();
    expect(screen.getByText("dev")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/post-a");
  });

  it("opens every entry on its cover", () => {
    const { container } = render(
      <BlogPostExplorer posts={[postA, postB, postC]} />,
    );

    expect(container.querySelectorAll("img")).toHaveLength(3);
  });

  // `alt=""` also drops the element from the `img` role: the two queries disagreeing is the proof.
  it("keeps the cover out of the link's accessible name", () => {
    const { container } = render(<BlogPostExplorer posts={[postA]} />);

    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
    expect(
      screen.getByRole("link", { name: /Post A/ }).textContent,
    ).not.toMatch(/fenêtre/);
  });

  // All eager would have every cover racing the one that is actually visible.
  it("loads only the first cover eagerly", () => {
    const { container } = render(
      <BlogPostExplorer posts={[postA, postB, postC]} />,
    );

    const loading = [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("loading"),
    );

    expect(loading).toEqual(["eager", "lazy", "lazy"]);
  });
});
