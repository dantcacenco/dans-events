import type { MetadataRoute } from "next";

const PRIVATE = ["/pixel-mob-admin", "/pixel-mob-test", "/pixel-mob-user", "/songs", "/admin", "/api/"];

// Search engines and AI assistants are welcome to read and cite the public pages.
const AI_AND_SEARCH = [
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_AND_SEARCH, allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://dans-events.com/sitemap.xml",
  };
}
