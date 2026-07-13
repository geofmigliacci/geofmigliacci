// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonLd } from "@/components/json-ld";

describe("JsonLd", () => {
  it("renders the data as a JSON-LD script tag", () => {
    const data = { "@context": "https://schema.org", "@type": "Person" };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script).not.toBeNull();
    expect(script?.textContent).toBe(JSON.stringify(data));
  });
});
