// @vitest-environment jsdom

import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";
import { render, screen, within } from "@/test-utils";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return { ...actual, usePathname: vi.fn() };
});

const mockedUsePathname = vi.mocked(usePathname);

/** Composition only: the crumb and the active-link rule are tested in their own files. */
describe("SiteHeader", () => {
  it("assembles the crumb, the section nav and the theme toggle", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(
      screen.getByRole("navigation", { name: "Fil d'Ariane" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigation principale" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Changer de thème" }),
    ).toBeInTheDocument();
  });

  it("drops the redundant Accueil link, keeping only the two sections", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<SiteHeader />);

    const nav = screen.getByRole("navigation", {
      name: "Navigation principale",
    });
    expect(
      screen.queryByRole("button", { name: "Accueil" }),
    ).not.toBeInTheDocument();
    expect(
      within(nav)
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["Blog", "À propos"]);
  });
});
