// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AboutPhotos } from "@/app/about/_components/about-photos";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

const mockedUseReducedMotion = vi.mocked(useReducedMotion);

afterEach(() => {
  mockedUseReducedMotion.mockReturnValue(false);
});

describe("AboutPhotos", () => {
  it("renders every photo with a description of its own", () => {
    render(<AboutPhotos />);

    const photos = screen.getAllByRole("img");
    const alts = photos.map((photo) => photo.getAttribute("alt"));

    expect(photos).toHaveLength(3);
    expect(new Set(alts).size).toBe(3);
    expect(alts.every((alt) => alt && alt.length > 20)).toBe(true);
  });

  it("names each location", () => {
    render(<AboutPhotos />);

    expect(screen.getByAltText(/rocca d'angera/i)).toBeInTheDocument();
    expect(screen.getByAltText(/viareggio/i)).toBeInTheDocument();
    expect(screen.getByAltText(/isola bella/i)).toBeInTheDocument();
  });

  // `lazy` is the browser default, so this fails the moment either prop is dropped.
  it("loads every photo immediately rather than on scroll", () => {
    render(<AboutPhotos />);

    for (const photo of screen.getAllByRole("img")) {
      expect(photo).toHaveAttribute("loading", "eager");
      expect(photo).toHaveAttribute("fetchpriority", "high");
    }
  });

  it("holds each frame to the right of its cell before it slides in", () => {
    render(<AboutPhotos />);

    const frame = screen.getByAltText(/rocca d'angera/i).parentElement;

    expect(frame).toHaveStyle({
      opacity: 0,
      transform: "translateX(32px)",
    });
  });

  // Asserting `opacity: 1` would prove nothing: it is the CSS default either way.
  it("writes no inline offset at all when the user prefers reduced motion", () => {
    mockedUseReducedMotion.mockReturnValue(true);
    render(<AboutPhotos />);

    expect(
      screen.getByAltText(/rocca d'angera/i).parentElement,
    ).not.toHaveAttribute("style");
  });
});
