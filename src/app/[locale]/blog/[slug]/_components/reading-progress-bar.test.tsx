// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { ReadingProgressBar } from "@/app/[locale]/blog/[slug]/_components/reading-progress-bar";
import { render } from "@/test-utils";

describe("ReadingProgressBar", () => {
  it("renders as decorative, hidden from assistive tech", () => {
    const { container } = render(<ReadingProgressBar />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  // `useScroll` is a no-op without a scroll container, which jsdom has none of.
  it("renders with the bar collapsed until the reader moves", () => {
    const { container } = render(<ReadingProgressBar />);
    const bar = container.firstElementChild?.firstElementChild;

    expect(bar).toHaveStyle({ transform: "scaleX(0)" });
  });
});
