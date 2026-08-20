// @vitest-environment jsdom

import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { BlogPostCover } from "@/app/[locale]/blog/[slug]/_components/blog-post-cover";
import { render, screen } from "@/test-utils";

/** The blur fields are not padding: `placeholder="blur"` makes `next/image` throw without them. */
const cover: StaticImageData = {
  src: "/_next/static/media/cover.jpg",
  width: 3456,
  height: 1606,
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
  blurWidth: 8,
  blurHeight: 4,
};

const ALT = "Vue sur un lac et des montagnes depuis une fenêtre ouverte.";

describe("BlogPostCover", () => {
  it("describes the photograph for a reader who cannot see it", () => {
    render(<BlogPostCover cover={cover} alt={ALT} />);

    expect(screen.getByAltText(ALT)).toBeInTheDocument();
  });

  it("names the place in a caption tied to the photograph", () => {
    render(<BlogPostCover cover={cover} alt={ALT} caption="Lac Majeur" />);

    expect(screen.getByText("Lac Majeur").tagName).toBe("FIGCAPTION");
  });

  it("renders no caption line when the cover has none", () => {
    const { container } = render(<BlogPostCover cover={cover} alt={ALT} />);

    expect(container.querySelector("figcaption")).toBeNull();
  });

  // `lazy` is the browser default, which is what this would silently become.
  it("loads immediately rather than on scroll", () => {
    render(<BlogPostCover cover={cover} alt={ALT} />);
    const image = screen.getByAltText(ALT);

    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });
});
