// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";
import { render, screen, within } from "@/test-utils";

const colophon = () =>
  screen.getByRole("navigation", { name: "Informations légales" });

describe("SiteFooter", () => {
  it("carries the legal links, which reach the reader from nowhere else", () => {
    render(<SiteFooter />);

    expect(
      within(colophon()).getByRole("link", { name: "Mentions légales" }),
    ).toHaveAttribute("href", "/fr/legal");
    expect(
      within(colophon()).getByRole("link", { name: "Confidentialité" }),
    ).toHaveAttribute("href", "/fr/privacy-policy");
  });

  it("keeps the feed reachable from every page, not just the posts index", () => {
    render(<SiteFooter />);

    expect(
      within(colophon()).getByRole("link", { name: "RSS" }),
    ).toHaveAttribute("href", "/fr/feed.xml");
  });

  it("credits the author for the current year", () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(`© ${new Date().getFullYear()} Geoffrey Migliacci`),
    ).toBeInTheDocument();
  });

  // The guard against the footer growing back into a second copy of the masthead.
  it("does not repeat the masthead's identity block", () => {
    render(<SiteFooter />);

    expect(screen.queryByText("Ingénieur logiciel senior")).toBeNull();
    expect(screen.queryByRole("link", { name: "GitHub" })).toBeNull();
    expect(screen.queryByRole("link", { name: "LinkedIn" })).toBeNull();
    expect(
      screen.queryByRole("link", { name: "Me contacter par email" }),
    ).toBeNull();
  });

  it("does not repeat the header's section navigation", () => {
    render(<SiteFooter />);

    expect(screen.queryByRole("link", { name: "Blog" })).toBeNull();
    expect(screen.queryByRole("link", { name: "À propos" })).toBeNull();
  });
});
