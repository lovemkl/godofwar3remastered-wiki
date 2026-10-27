import type { MetadataRoute } from "next";
import { getAllContentPaths } from "@/lib/content";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://godofwar3remastered.wiki";

  // Static paths that always exist
  const staticPaths = [ "/catalog","/", "/guide", "/features", "/comparisons", "/faq", "/privacy-policy", "/terms-of-service", "/copyright", "/about"];

  // Dynamic paths: scan actual MDX content files
  const contentPaths = await getAllContentPaths("en");
  const dynamicPaths = contentPaths.map((item) => `/${[item.contentType, ...item.slug].join("/")}`);

  const paths = [...staticPaths, ...dynamicPaths];

    // en-only sitemap: es/pt/de locales are nav-only skeletons (thin-content guard)
  return paths.map((path) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : path === "/guide" ? 0.8 : 0.6,
  }));
}
