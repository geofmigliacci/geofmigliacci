import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("manifest", () => {
  it("builds the PWA manifest with the site's identity and icon set", () => {
    expect(manifest()).toEqual({
      name: "Geoffrey Migliacci",
      short_name: "Migliacci",
      description:
        "J'écris sur le code, la cuisine, les langues, la philosophie — tout ce qui nourrit ma curiosité et la vie autour.",
      start_url: "/",
      display: "standalone",
      background_color: "#0f0f0f",
      theme_color: "#f59e0b",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        {
          src: "/icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    });
  });

  it("includes a maskable icon with a matching non-maskable fallback size", () => {
    const { icons } = manifest();
    const maskable = icons?.find((icon) => icon.purpose === "maskable");
    const fallback = icons?.find(
      (icon) => icon.sizes === maskable?.sizes && icon.purpose !== "maskable",
    );

    expect(maskable).toBeDefined();
    expect(fallback).toBeDefined();
  });
});
