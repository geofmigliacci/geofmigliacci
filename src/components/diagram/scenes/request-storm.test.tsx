// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { useReducedMotion } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequestStorm } from "@/components/diagram/scenes/request-storm";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => true) };
});

const mockedUseReducedMotion = vi.mocked(useReducedMotion);

afterEach(() => {
  mockedUseReducedMotion.mockReturnValue(true);
});

describe("RequestStorm", () => {
  it("renders three clients plus the server and database nodes", () => {
    render(<RequestStorm />);
    expect(screen.getAllByText("Client")).toHaveLength(3);
    expect(screen.getByText("Serveur")).toBeInTheDocument();
    expect(screen.getByText("SQL Server")).toBeInTheDocument();
  });

  it("stacks abandoned requests without the token and drains them with it", () => {
    render(<RequestStorm />);
    const withoutToken = screen.getByRole("button", { name: "Sans token" });
    const withToken = screen.getByRole("button", { name: "Avec token" });
    const activeRequests = () =>
      screen.getByText("Requêtes actives").parentElement;

    expect(withoutToken).toHaveAttribute("aria-pressed", "true");
    expect(activeRequests()).toHaveTextContent("6");

    fireEvent.click(withToken);

    expect(withToken).toHaveAttribute("aria-pressed", "true");
    expect(activeRequests()).toHaveTextContent("0");
  });
});
