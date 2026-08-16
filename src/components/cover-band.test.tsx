// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { CoverBand } from "@/components/cover-band";
import { testCover } from "@/lib/blog.fixtures";
import { render, screen } from "@/test-utils";

const ALT = "Vue sur un lac et des montagnes depuis une fenêtre ouverte.";

const bandImage = () => screen.getByAltText(ALT);

describe("CoverBand", () => {
  it("describes the photograph for a reader who cannot see it", () => {
    render(<CoverBand cover={testCover} alt={ALT} />);

    expect(bandImage()).toBeInTheDocument();
  });

  // Interpolating the class would emit nothing and leave the crop at the browser default.
  it("anchors the crop to the bottom by default", () => {
    render(<CoverBand cover={testCover} alt={ALT} />);

    expect(bandImage()).toHaveClass("object-bottom");
  });

  // The escape hatch for a subject sitting high in the frame, which the default beheads.
  it("centres the crop when the cover asks for it", () => {
    render(<CoverBand cover={testCover} alt={ALT} position="center" />);

    expect(bandImage()).toHaveClass("object-center");
    expect(bandImage()).not.toHaveClass("object-bottom");
  });

  it("loads lazily unless told otherwise", () => {
    render(<CoverBand cover={testCover} alt={ALT} />);

    expect(bandImage()).toHaveAttribute("loading", "lazy");
  });

  it("loads eagerly and at high priority when it is the likely LCP element", () => {
    render(<CoverBand cover={testCover} alt={ALT} eager />);

    expect(bandImage()).toHaveAttribute("loading", "eager");
    expect(bandImage()).toHaveAttribute("fetchpriority", "high");
  });

  // `photo-lift` needs a `group` ancestor, which only the list's link supplies.
  it("stays inert unless it is interactive", () => {
    render(<CoverBand cover={testCover} alt={ALT} />);

    expect(bandImage()).not.toHaveClass("photo-lift");
  });

  it("takes the shared photo hover when interactive", () => {
    render(<CoverBand cover={testCover} alt={ALT} interactive />);

    expect(bandImage()).toHaveClass("photo-lift");
  });
});
