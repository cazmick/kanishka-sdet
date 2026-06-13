import { createFileRoute } from "@tanstack/react-router";
import CV from "@/components/CV";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kanishka Mogha — Senior SDET & Automation Specialist" },
      { name: "description", content: "Interactive infographic CV of Kanishka Mogha — Senior SDET specializing in mobile, API automation, and AI-driven quality engineering." },
      { property: "og:title", content: "Kanishka Mogha — Senior SDET" },
      { property: "og:description", content: "Mobile, API & AI-powered test automation. 6+ years building unbreakable software." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  component: CV,
});
