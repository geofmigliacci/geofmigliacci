// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPostByline } from "@/app/blog/[slug]/_components/blog-post-byline";
import { person } from "@/lib/site";

const DATE = "2026-01-15";
const UPDATED = "2026-03-02";

describe("BlogPostByline", () => {
  it("credits the author with a link to the about page", () => {
    render(<BlogPostByline date={DATE} />);

    const link = screen.getByRole("link", { name: person.name });

    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveAttribute("rel", "author");
  });

  it("leaves the portrait out of the accessible name", () => {
    render(<BlogPostByline date={DATE} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the publication date as a machine-readable time", () => {
    const { container } = render(<BlogPostByline date={DATE} />);

    const time = container.querySelector(`time[datetime="${DATE}"]`);

    expect(time).toHaveTextContent("15 janvier 2026");
  });

  it("renders the reading time when given one", () => {
    render(<BlogPostByline date={DATE} readingTime={6} />);

    expect(screen.getByText("6 min de lecture")).toBeInTheDocument();
  });

  it("omits the reading time when it is unknown", () => {
    render(<BlogPostByline date={DATE} />);

    expect(screen.queryByText(/min de lecture/)).not.toBeInTheDocument();
  });

  it("renders the update date when it differs from the publication date", () => {
    const { container } = render(
      <BlogPostByline date={DATE} updated={UPDATED} />,
    );

    expect(screen.getByText(/Mis à jour le/)).toBeInTheDocument();
    expect(
      container.querySelector(`time[datetime="${UPDATED}"]`),
    ).toHaveTextContent("2 mars 2026");
  });

  it("omits the update date when the post has never been revised", () => {
    render(<BlogPostByline date={DATE} updated={DATE} />);

    expect(screen.queryByText(/Mis à jour le/)).not.toBeInTheDocument();
  });
});
