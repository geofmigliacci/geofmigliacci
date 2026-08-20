// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { Readout } from "@/components/diagram/diagram";
import { render, screen } from "@/test-utils";

describe("Readout", () => {
  it("renders the label and numeric value", () => {
    render(<Readout label="Requêtes actives" value={6} />);
    expect(screen.getByText("Requêtes actives")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
