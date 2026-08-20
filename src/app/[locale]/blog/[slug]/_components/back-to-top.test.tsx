// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { BackToTop } from "@/app/[locale]/blog/[slug]/_components/back-to-top";
import { render, screen } from "@/test-utils";

const NAME = "Retour en haut de la page";

describe("BackToTop", () => {
  it("stays out of the way at the top of the page", () => {
    render(<BackToTop />);

    expect(screen.queryByRole("link", { name: NAME })).not.toBeInTheDocument();
  });
});
