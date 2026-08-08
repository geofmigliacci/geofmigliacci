// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
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

const activeRequests = () => screen.getByText("Requêtes actives").parentElement;

describe("RequestStorm", () => {
  it("renders five clients plus the server and database nodes", () => {
    render(<RequestStorm mode="without" />);
    expect(screen.getAllByText("Client")).toHaveLength(5);
    expect(screen.getByText("Serveur")).toBeInTheDocument();
    expect(screen.getByText("SQL Server")).toBeInTheDocument();
  });

  it("stacks the abandoned requests without the token", () => {
    render(<RequestStorm mode="without" />);
    expect(activeRequests()).toHaveTextContent("6");
  });

  it("keeps the load bounded with the token", () => {
    render(<RequestStorm mode="with" />);
    expect(activeRequests()).toHaveTextContent("0");
  });
});
