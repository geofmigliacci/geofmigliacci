// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd } from "@/components/json-ld";
import { testCover } from "@/lib/blog.fixtures";
import {
  blogPostingJsonLd,
  graph,
  type JsonLdContext,
  personJsonLd,
} from "@/lib/json-ld";
import { render } from "@/test-utils";

const ctx: JsonLdContext = {
  locale: "fr",
  tagline: "Une tagline.",
  blogDescription: "Une description de blog.",
  pitch: "Un pitch.",
  jobTitle: "Ingénieur logiciel senior",
  knowsAbout: [".NET"],
  blogName: "Blog",
  routeNames: { "/": "Accueil", "/blog": "Blog" },
};

describe("JsonLd", () => {
  it("renders the graph as a JSON-LD script tag", () => {
    const data = graph(personJsonLd(ctx));
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script).not.toBeNull();
  });

  // Markup, not the DOM: a `render()` version passes on a page a browser would break on.
  it("escapes a title that closes the script element", () => {
    const html = renderToStaticMarkup(
      <JsonLd
        data={graph(
          blogPostingJsonLd(ctx, {
            title: "Échapper une balise </script> en MDX",
            description: "Une description.",
            date: "2026-01-01",
            tags: [],
            cover: testCover,
            slug: "mon-post",
          }),
        )}
      />,
    );

    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it("keeps the escaped payload readable", () => {
    const title = "Échapper une balise </script> en MDX";
    const { container } = render(
      <JsonLd
        data={graph(
          blogPostingJsonLd(ctx, {
            title,
            description: "Une description.",
            date: "2026-01-01",
            tags: [],
            cover: testCover,
            slug: "mon-post",
          }),
        )}
      />,
    );

    const text = container.querySelector("script")?.textContent ?? "";

    expect(text).not.toContain("<");
    expect(JSON.parse(text)["@graph"][0].headline).toBe(title);
  });
});
