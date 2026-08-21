// @vitest-environment jsdom

import { mockResizeObserver } from "jsdom-testing-mocks";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderMenu } from "@/components/header-menu";
import { fireEvent, render, screen, waitFor } from "@/test-utils";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return { ...actual, usePathname: vi.fn() };
});

const mockedUsePathname = vi.mocked(usePathname);

// Base UI positions the popup with a `ResizeObserver`, which jsdom does not implement.
mockResizeObserver();

describe("HeaderMenu", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/fr/blog");
  });

  it("holds the sections and both locales behind the burger", async () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    await waitFor(() =>
      expect(
        screen.getAllByRole("menuitem").map((item) => item.textContent),
      ).toEqual(["Blog", "À propos", "English", "Français"]),
    );
  });

  it("closes when the viewport crosses out from under the burger", async () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    expect(
      await screen.findByRole("menuitem", { name: "Blog" }),
    ).toBeInTheDocument();

    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(screen.queryByRole("menuitem")).not.toBeInTheDocument(),
    );
  });

  it("keeps the language links on the current path, the active one marked", async () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    expect(
      await screen.findByRole("menuitem", { name: "English" }),
    ).toHaveAttribute("href", "/en/blog");
    const french = screen.getByRole("menuitem", { name: "Français" });
    expect(french).toHaveAttribute("href", "/fr/blog");
    expect(french).toHaveAttribute("aria-current", "true");
  });
});
