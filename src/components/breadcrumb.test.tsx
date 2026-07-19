// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "@/components/breadcrumb";

const items = [
  { name: "Accueil", path: "/" },
  { name: "Articles", path: "/articles" },
  { name: "Mon article", path: "/articles/mon-article" },
];

describe("Breadcrumb", () => {
  it("renders a labelled navigation landmark", () => {
    render(<Breadcrumb items={items} />);
    expect(
      screen.getByRole("navigation", { name: "Fil d'Ariane" }),
    ).toBeInTheDocument();
  });

  it("links every item except the current page", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Articles" })).toHaveAttribute(
      "href",
      "/articles",
    );
    expect(
      screen.queryByRole("link", { name: "Mon article" }),
    ).not.toBeInTheDocument();
  });

  it("marks the last item as the current page", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Mon article")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders the items in trail order", () => {
    render(<Breadcrumb items={items} />);
    const listItems = screen
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(listItems).toEqual(["Accueil/", "Articles/", "Mon article"]);
  });
});
