// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModeToggle, Readout } from "@/components/diagram/diagram";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
] as const;

describe("ModeToggle", () => {
  it("marks only the active option as pressed", () => {
    render(
      <ModeToggle
        value="a"
        onChange={() => {}}
        options={OPTIONS}
        ariaLabel="x"
      />,
    );
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the clicked option value", () => {
    const onChange = vi.fn();
    render(
      <ModeToggle
        value="a"
        onChange={onChange}
        options={OPTIONS}
        ariaLabel="x"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("Readout", () => {
  it("renders the label and numeric value", () => {
    render(<Readout label="Requêtes actives" value={6} />);
    expect(screen.getByText("Requêtes actives")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
