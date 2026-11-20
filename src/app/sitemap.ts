import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const LAST_MODIFIED = new Date("2026-11-20");

export default function sitemap(): MetadataRoute.Sitemap {
  return TOOLS.map((tool) => ({
    url: `${siteConfig.url}${tool.href === "/" ? "" : tool.href}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: tool.href === "/" ? 1 : 0.9,
  }));
}
