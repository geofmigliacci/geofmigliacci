// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { NavLink } from "@/components/nav-link";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return { ...actual, usePathname: vi.fn() };
});

const mockedUsePathname = vi.mocked(usePathname);

describe("NavLink", () => {
  it("links to the given href", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<NavLink href="/articles">Articles</NavLink>);

    expect(screen.getByRole("button", { name: "Articles" })).toHaveAttribute(
      "href",
      "/articles",
    );
  });

  it("marks itself active on an exact pathname match when exact is set", () => {
    mockedUsePathname.mockReturnValue("/");
    render(
      <NavLink href="/" exact>
        Accueil
      </NavLink>,
    );

    expect(screen.getByRole("button", { name: "Accueil" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not mark itself active on a partial match when exact is set", () => {
    mockedUsePathname.mockReturnValue("/articles/mon-article");
    render(
      <NavLink href="/articles" exact>
        Articles
      </NavLink>,
    );

    expect(
      screen.getByRole("button", { name: "Articles" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks itself active on a nested path when exact is not set", () => {
    mockedUsePathname.mockReturnValue("/articles/mon-article");
    render(<NavLink href="/articles">Articles</NavLink>);

    expect(screen.getByRole("button", { name: "Articles" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not mark itself active when the pathname doesn't start with href", () => {
    mockedUsePathname.mockReturnValue("/");
    render(<NavLink href="/articles">Articles</NavLink>);

    expect(
      screen.getByRole("button", { name: "Articles" }),
    ).not.toHaveAttribute("aria-current");
  });
});
