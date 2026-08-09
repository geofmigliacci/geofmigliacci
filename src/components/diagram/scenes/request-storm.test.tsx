// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequestStorm } from "@/components/diagram/scenes/request-storm";

const activeRequests = () => screen.getByText("Requêtes actives").parentElement;
const connectedClients = () =>
  screen.getByText("Clients connectés").parentElement;

// `RESET_GAP_MS` plus client 0's leave offset, `(2 - 1) * SEND_GAP_MS + LINGER_MS`.
const FIRST_DISCONNECT_MS = 600 + 1320;

afterEach(() => {
  vi.useRealTimers();
});

describe("RequestStorm", () => {
  it("renders five clients plus the server and database nodes", () => {
    render(<RequestStorm mode="without" />);
    expect(screen.getAllByText("Client")).toHaveLength(5);
    expect(screen.getByText("Serveur")).toBeInTheDocument();
    expect(screen.getByText("SQL Server")).toBeInTheDocument();
  });

  it.each(["without", "with"] as const)(
    "starts idle with every client connected in %s mode",
    (mode) => {
      render(<RequestStorm mode={mode} />);
      expect(activeRequests()).toHaveTextContent("0");
      expect(connectedClients()).toHaveTextContent("5");
    },
  );

  it("disconnects a client once its burst has lingered", async () => {
    vi.useFakeTimers();
    render(<RequestStorm mode="without" />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(FIRST_DISCONNECT_MS);
    });

    expect(connectedClients()).toHaveTextContent("4");
  });
});
