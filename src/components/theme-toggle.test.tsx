// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";
import { fireEvent, render, screen } from "@/test-utils";

const toggle = () => screen.getByRole("button", { name: "Changer de thème" });

const stubViewTransitions = () => {
  const startViewTransition = vi.fn((apply: () => void) => {
    apply();
    return {} as ViewTransition;
  });
  Object.defineProperty(document, "startViewTransition", {
    value: startViewTransition,
    configurable: true,
    writable: true,
  });
  return startViewTransition;
};

beforeEach(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.removeAttribute("style");
  localStorage.clear();
});

afterEach(() => {
  Reflect.deleteProperty(document, "startViewTransition");
});

describe("ThemeToggle", () => {
  it("leaves the page light until asked, since dark is opt-in", () => {
    render(<ThemeToggle />);

    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBeNull();
  });

  it("switches to dark and remembers it", () => {
    render(<ThemeToggle />);
    fireEvent.click(toggle());

    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("switches back to light and remembers that too", () => {
    render(<ThemeToggle />);
    fireEvent.click(toggle());
    fireEvent.click(toggle());

    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("still switches where the View Transitions API is missing", () => {
    expect(document.startViewTransition).toBeUndefined();

    render(<ThemeToggle />);
    fireEvent.click(toggle());

    expect(document.documentElement).toHaveClass("dark");
  });

  it("drives the fade through startViewTransition when it is available", () => {
    const startViewTransition = stubViewTransitions();

    render(<ThemeToggle />);
    fireEvent.click(toggle());

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.documentElement).toHaveClass("dark");
  });

  // jsdom synthesises no click from Enter, so `fireEvent` returning false is the real proof.
  it.each(["Enter", " "])(
    "suppresses auto-repeat so holding %s cannot strobe the fade",
    (key) => {
      render(<ThemeToggle />);

      expect(fireEvent.keyDown(toggle(), { key, repeat: true })).toBe(false);
    },
  );

  it.each(["Enter", " "])("leaves a deliberate %s press alone", (key) => {
    render(<ThemeToggle />);

    expect(fireEvent.keyDown(toggle(), { key })).toBe(true);
  });

  it("does not block holding an arrow key to scroll while focused", () => {
    render(<ThemeToggle />);

    expect(
      fireEvent.keyDown(toggle(), { key: "ArrowDown", repeat: true }),
    ).toBe(true);
  });
});
