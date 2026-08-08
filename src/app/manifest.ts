import type { MetadataRoute } from "next";
import { person, tagline } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: person.name,
    short_name: "Migliacci",
    description: tagline,
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
  };
}
