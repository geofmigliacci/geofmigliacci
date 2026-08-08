// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Masthead } from "@/app/_components/masthead";

describe("Masthead", () => {
  it("renders the name as the accessible heading", () => {
    render(<Masthead />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Geoffrey Migliacci" }),
    ).toBeInTheDocument();
  });

  it("renders the job title and specialization line", () => {
    render(<Masthead />);
    expect(screen.getByText("Ingénieur logiciel senior")).toBeInTheDocument();
    expect(
      screen.getByText(
        "+7 ans d'expérience · Performance · CQRS · Clean Architecture",
      ),
    ).toBeInTheDocument();
  });

  it("renders the portrait photo", () => {
    render(<Masthead />);
    expect(
      screen.getByAltText("Portrait de Geoffrey Migliacci"),
    ).toBeInTheDocument();
  });

  // The destinations are asserted in social-links.test.tsx; this only mounts them.
  it("carries the contact links", () => {
    render(<Masthead />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
