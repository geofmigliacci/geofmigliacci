// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/app/_components/hero";

describe("Hero", () => {
  it("renders the name as the accessible heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Geoffrey Migliacci" }),
    ).toBeInTheDocument();
  });

  it("renders the job title and tagline", () => {
    render(<Hero />);
    expect(screen.getByText("Ingénieur logiciel")).toBeInTheDocument();
    expect(
      screen.getByText(/j'écris sur le code, la cuisine/i),
    ).toBeInTheDocument();
  });

  it("links the CTA to the articles page", () => {
    render(<Hero />);
    expect(
      screen.getByRole("button", { name: /lire les articles/i }),
    ).toHaveAttribute("href", "/articles");
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
