// @vitest-environment jsdom

import { mockIntersectionObserver } from "jsdom-testing-mocks";
import type { TocItem } from "rehype-mdx-toc";
import { describe, expect, it } from "vitest";
import { BlogPostToc } from "@/app/[locale]/blog/[slug]/_components/blog-post-toc";
import { render, screen, within } from "@/test-utils";

const items = [
  { depth: 2, value: "L'histoire", numbering: [1], id: "lhistoire" },
  { depth: 2, value: "Le sevrage", numbering: [2], id: "le-sevrage" },
  {
    depth: 3,
    value: "La projection vers un DTO",
    numbering: [2, 1],
    id: "la-projection",
  },
] satisfies TocItem[];

// The setup file's mock never fires, so a test that needs a scroll drives its own.
const io = mockIntersectionObserver();

/** The headings have to be in the document: the rail resolves them by `id`. */
function renderWithHeadings() {
  render(
    <>
      {items.map((item) => (
        <h2 id={item.id} key={item.id}>
          {item.value}
        </h2>
      ))}
      <BlogPostToc items={items} />
    </>,
  );

  return (name: string) => screen.getByRole("heading", { name });
}

describe("BlogPostToc", () => {
  it("lists every heading in document order, each linking to its fragment", () => {
    renderWithHeadings();

    const nav = screen.getByRole("navigation", { name: "Sommaire" });
    const links = within(nav).getAllByRole("link");

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAccessibleName("L'histoire");
    expect(links[0]).toHaveAttribute("href", "#lhistoire");
    expect(links[1]).toHaveAttribute("href", "#le-sevrage");
    expect(links[2]).toHaveAttribute("href", "#la-projection");
  });

  it.each([
    { name: "no markdown headings", toc: [] },
    {
      name: "headings the slug plugin never reached",
      toc: [{ depth: 2, value: "Sans id", numbering: [1] }] satisfies TocItem[],
    },
  ])("renders nothing for a post with $name", ({ toc }) => {
    const { container } = render(<BlogPostToc items={toc} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("marks no entry as current before anything scrolls into view", () => {
    renderWithHeadings();

    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("marks the section in view as the current location", () => {
    const heading = renderWithHeadings();
    io.enterNode(heading("Le sevrage"));

    expect(screen.getByRole("link", { name: "Le sevrage" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(
      screen.getByRole("link", { name: "L'histoire" }),
    ).not.toHaveAttribute("aria-current");
  });

  // Passed in reverse, so document order is what decides rather than record order.
  it("takes the first heading in document order when several are in view", () => {
    const heading = renderWithHeadings();
    io.enterNodes([
      heading("La projection vers un DTO"),
      heading("Le sevrage"),
    ]);

    expect(screen.getByRole("link", { name: "Le sevrage" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("holds the current entry through a section longer than the band", () => {
    const heading = renderWithHeadings();
    io.enterNode(heading("Le sevrage"));
    io.leaveNode(heading("Le sevrage"));

    expect(screen.getByRole("link", { name: "Le sevrage" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("indents a subsection so the outline shows its depth", () => {
    renderWithHeadings();

    expect(
      screen.getByRole("link", { name: "La projection vers un DTO" }),
    ).toHaveClass("ps-4");
    expect(screen.getByRole("link", { name: "Le sevrage" })).not.toHaveClass(
      "ps-4",
    );
  });
});
