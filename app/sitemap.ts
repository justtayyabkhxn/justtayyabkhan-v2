import { MetadataRoute } from "next";

const BASE_URL = "https://justtayyabkhan.com";

// Bump a route's date here only when that page's content actually changes —
// using `new Date()` at build time made every route look "modified today"
// on every deploy, which is meaningless to crawlers.
const routes: { path: string; lastModified: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", lastModified: "2026-07-17", changeFrequency: "monthly", priority: 1 },
  { path: "/about", lastModified: "2026-07-17", changeFrequency: "monthly", priority: 0.8 },
  
  { path: "/gallery", lastModified: "2026-07-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/places", lastModified: "2026-07-17", changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
