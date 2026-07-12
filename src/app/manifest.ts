import type { MetadataRoute } from "next";
import { person } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: person.name,
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
  };
}
