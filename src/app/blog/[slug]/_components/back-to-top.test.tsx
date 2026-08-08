// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BackToTop } from "@/app/blog/[slug]/_components/back-to-top";

const NAME = "Retour en haut de la page";

describe("BackToTop", () => {
  it("stays out of the way at the top of the page", () => {
    render(<BackToTop />);

    expect(screen.queryByRole("link", { name: NAME })).not.toBeInTheDocument();
  });
});
