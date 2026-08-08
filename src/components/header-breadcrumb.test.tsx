// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { HeaderBreadcrumb } from "@/components/header-breadcrumb";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return { ...actual, usePathname: vi.fn() };
});

const mockedUsePathname = vi.mocked(usePathname);

const crumb = () => screen.getByRole("navigation", { name: "Fil d'Ariane" });

const at = (pathname: string) => {
  mockedUsePathname.mockReturnValue(pathname);
  render(<HeaderBreadcrumb />);
};

describe("HeaderBreadcrumb", () => {
  it("links the logo to the homepage", () => {
    at("/");

    expect(
      screen.getByRole("link", { name: "Geoffrey Migliacci · accueil" }),
    ).toHaveAttribute("href", "/");
  });

  it("shows no section crumb on the homepage, since the logo is the home crumb", () => {
    at("/");

    expect(within(crumb()).getAllByRole("link")).toHaveLength(1);
  });

  it("crumbs the section, not the post, on a nested post page", () => {
    at("/blog/mon-post");

    const link = within(crumb()).getByRole("link", { name: "Blog" });
    expect(link).toHaveAttribute("href", "/blog");
    // The crumb points at the section, which is not the current document.
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("marks the section crumb as the current page on the section index", () => {
    at("/blog");

    expect(within(crumb()).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("crumbs À propos on the about page", () => {
    at("/about");

    expect(
      within(crumb()).getByRole("link", { name: "À propos" }),
    ).toHaveAttribute("href", "/about");
  });

  // Reachable only from the footer, so this crumb is the reader's only way back up.
  it.each([
    ["/legal", "Mentions légales"],
    ["/privacy-policy", "Confidentialité"],
  ])("crumbs %s, the only way back up from it", (pathname, label) => {
    at(pathname);

    const link = within(crumb()).getByRole("link", { name: label });
    expect(link).toHaveAttribute("href", pathname);
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("shows no crumb for a route it does not know", () => {
    at("/quelque-chose-dautre");

    expect(within(crumb()).getAllByRole("link")).toHaveLength(1);
  });
});
