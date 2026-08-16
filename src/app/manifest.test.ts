import { describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";
// Against the catalogue, not a literal: a reworded tagline is not a broken manifest.
import en from "@/messages/en.json";

vi.mock("next-intl/server", () => import("@/i18n/server.mock"));

describe("manifest", () => {
  it("builds the PWA manifest with the site's identity and icon set", async () => {
    await expect(manifest()).resolves.toEqual({
      id: "/",
      name: "Geoffrey Migliacci",
      short_name: "Migliacci",
      description: en.site.tagline,
      lang: "en",
      start_url: "/",
      display: "standalone",
      background_color: "#fbfcfd",
      theme_color: "#4e4ea4",
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

  it("includes a maskable icon with a matching non-maskable fallback size", async () => {
    const { icons } = await manifest();
    const maskable = icons?.find((icon) => icon.purpose === "maskable");
    const fallback = icons?.find(
      (icon) => icon.sizes === maskable?.sizes && icon.purpose !== "maskable",
    );

    expect(maskable).toBeDefined();
    expect(fallback).toBeDefined();
  });
});
