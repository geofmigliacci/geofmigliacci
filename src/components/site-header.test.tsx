// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return { ...actual, usePathname: vi.fn() };
});

const mockedUsePathname = vi.mocked(usePathname);

describe("SiteHeader", () => {
  it("links the logo to the homepage", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "Geoffrey Migliacci — accueil" }),
    ).toHaveAttribute("href", "/");
  });

  it("marks Accueil active on the homepage and Articles inactive", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Accueil" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", { name: "Articles" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks Articles active on a nested article page and Accueil inactive", () => {
    mockedUsePathname.mockReturnValue("/articles/mon-article");
    render(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Accueil" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("button", { name: "Articles" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
