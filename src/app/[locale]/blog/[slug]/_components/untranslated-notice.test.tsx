// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { UntranslatedNotice } from "@/app/[locale]/blog/[slug]/_components/untranslated-notice";
import { render, screen } from "@/test-utils";

describe("UntranslatedNotice", () => {
  it("sends the reader to the locale that wrote the post", () => {
    render(
      <UntranslatedNotice contentLocale="en" slug="ef-core-lazy-loading" />,
    );

    const original = screen.getByRole("link", { name: /Lire l'original/ });

    expect(original).toHaveAttribute("href", "/en/blog/ef-core-lazy-loading");
    expect(original).toHaveAttribute("hreflang", "en");
  });

  it("names the language the post was written in", () => {
    render(<UntranslatedNotice contentLocale="en" slug="ef-core" />);

    expect(screen.getByText("Original en anglais")).toBeVisible();
  });
});
