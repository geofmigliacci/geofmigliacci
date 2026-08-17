import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/locales";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

type Tree = { [key: string]: string | Tree };

const entries = (tree: Tree, prefix = ""): [string, string][] =>
  Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [[`${prefix}${key}`, value] as [string, string]]
      : entries(value, `${prefix}${key}.`),
  );

const catalogues: [string, Tree][] = [
  ["en", en],
  ["fr", fr],
];

/** Blank in French on purpose: the French text defers to nothing. */
const MAY_BE_BLANK = ["legal.prevails", "privacy.prevails"];

describe("messages", () => {
  it("covers every locale the routing declares", () => {
    expect(catalogues.map(([name]) => name).toSorted()).toEqual(
      [...LOCALES].toSorted(),
    );
  });

  // What the declaration merge cannot see: a key present, and empty.
  it.each(catalogues)("%s leaves no key accidentally empty", (_, tree) => {
    const blank = entries(tree)
      .filter(([, value]) => value.trim() === "")
      .map(([key]) => key);

    expect(blank).toEqual(blank.filter((key) => MAY_BE_BLANK.includes(key)));
  });

  it("translates the same keys in every locale", () => {
    expect(
      entries(fr)
        .map(([key]) => key)
        .toSorted(),
    ).toEqual(
      entries(en)
        .map(([key]) => key)
        .toSorted(),
    );
  });
});
