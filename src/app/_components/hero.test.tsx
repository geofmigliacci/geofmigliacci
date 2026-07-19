// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "@/app/_components/hero";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

const mockedUseReducedMotion = vi.mocked(useReducedMotion);

afterEach(() => {
  mockedUseReducedMotion.mockReturnValue(false);
});

describe("Hero", () => {
  it("applies the initial motion offset by default", () => {
    render(<Hero />);
    const identityRow = screen.getByText("Ingénieur logiciel senior")
      .parentElement?.parentElement;
    expect(identityRow).toHaveStyle({ opacity: 0 });
  });

  it("skips the initial motion offset when the user prefers reduced motion", () => {
    mockedUseReducedMotion.mockReturnValue(true);
    render(<Hero />);
    const identityRow = screen.getByText("Ingénieur logiciel senior")
      .parentElement?.parentElement;
    expect(identityRow).toHaveStyle({ opacity: 1 });
  });

  it("renders the portrait photo and technical specialization line", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("Portrait de Geoffrey Migliacci"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "+7 ans d'expérience · Performance · CQRS · Clean Architecture",
      ),
    ).toBeInTheDocument();
  });

  it("renders the name as the accessible heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Geoffrey Migliacci" }),
    ).toBeInTheDocument();
  });

  it("renders the job title, technical positioning, and personal tagline", () => {
    render(<Hero />);
    expect(screen.getByText("Ingénieur logiciel senior")).toBeInTheDocument();
    expect(
      screen.getByText(/je conçois des systèmes \.net/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/j'écris sur le code, la cuisine/i),
    ).toBeInTheDocument();
  });

  it("does not render an articles CTA", () => {
    render(<Hero />);
    expect(
      screen.queryByRole("button", { name: /lire les articles/i }),
    ).not.toBeInTheDocument();
  });

  it("links each contact icon to the right destination", () => {
    render(<Hero />);
    expect(
      screen.getByRole("button", { name: "Me contacter par email" }),
    ).toHaveAttribute("href", "mailto:geoffrey.migliacci@gmail.com");
    expect(screen.getByRole("button", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/geofmigliacci",
    );
    expect(screen.getByRole("button", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/geofmigliacci/",
    );
  });
});
