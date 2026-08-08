// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Readout } from "@/components/diagram/diagram";

describe("Readout", () => {
  it("renders the label and numeric value", () => {
    render(<Readout label="Requêtes actives" value={6} />);
    expect(screen.getByText("Requêtes actives")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
