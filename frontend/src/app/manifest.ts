import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CozyLetters",
    short_name: "CozyLetters",
    description: "Send warm letters to random souls around the world",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#C4756B",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
