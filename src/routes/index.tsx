import { createFileRoute } from "@tanstack/react-router";

import GavetaApp from "@/components/GavetaApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gaveta Matemática" },
      { name: "description", content: "Visualizações Didáticas para o Professor" },
      { property: "og:title", content: "Gaveta Matemática" },
      { property: "og:description", content: "Visualizações Didáticas para o Professor" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GavetaApp,
});
