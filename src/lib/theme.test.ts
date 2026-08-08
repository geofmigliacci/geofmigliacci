// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_BOOT_SCRIPT, THEME_STORAGE_KEY } from "@/lib/theme";

/** A template literal reports as covered on import, so running the string is the only test. */
const runBootScript = () => {
  // biome-ignore lint/security/noGlobalEval: executing the script is the test
  eval(THEME_BOOT_SCRIPT);
};

const isDark = () => document.documentElement.classList.contains("dark");

beforeEach(() => {
  // Unstub first: the throwing-localStorage test leaves a stub with no `clear`.
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("dark");
  localStorage.clear();
});

describe("THEME_BOOT_SCRIPT", () => {
  it("goes dark before paint for a reader who chose dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    runBootScript();

    expect(isDark()).toBe(true);
  });

  it("leaves a first-time reader on the light default", () => {
    runBootScript();

    expect(isDark()).toBe(false);
  });

  it("leaves a reader who chose light alone", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");

    runBootScript();

    expect(isDark()).toBe(false);
  });

  it("ignores a value it does not recognise rather than guessing", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "DARK");

    runBootScript();

    expect(isDark()).toBe(false);
  });

  // Safari in private mode throws on access, and this script runs in the head before paint.
  it("survives a localStorage that throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("access denied");
      },
    });

    expect(() => {
      runBootScript();
    }).not.toThrow();
    expect(isDark()).toBe(false);
  });

  // A literal on purpose: asserting against the constant would move with a rename.
  it("keeps the persisted key stable across releases", () => {
    expect(THEME_STORAGE_KEY).toBe("theme");
  });
});
