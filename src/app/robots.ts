import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://godofwar3remastered.wiki";
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Perplexity-User", "GoogleOther", "Google-Extended", "DuckAssistBot", "CCBot", "Bytespider", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
