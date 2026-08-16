// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { SocialLinks } from "@/components/social-links";
import { render, screen } from "@/test-utils";

/** The URLs stay literal: asserting against `site.ts` would pass whatever it contained. */
describe("SocialLinks", () => {
  it("links each contact icon to the right destination", () => {
    render(<SocialLinks />);

    expect(
      screen.getByRole("button", { name: "Me contacter par email" }),
    ).toHaveAttribute("href", "mailto:geoffrey.migliacci@gmail.com");
    expect(screen.getByRole("button", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/geofmigliacci",
    );
    expect(screen.getByRole("button", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/geofmigliacci/",
    );
  });

  it("opens the off-site profiles in a new tab without leaking the referrer", () => {
    render(<SocialLinks />);

    for (const name of ["GitHub", "LinkedIn"]) {
      const link = screen.getByRole("button", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("keeps the mail link in the same tab, since it hands off to a mail client", () => {
    render(<SocialLinks />);

    expect(
      screen.getByRole("button", { name: "Me contacter par email" }),
    ).not.toHaveAttribute("target");
  });

  it("labels each icon, which carries no text of its own", () => {
    render(<SocialLinks />);

    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
