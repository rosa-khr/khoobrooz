import type { MetadataRoute } from "next";
import { localizedPath, locales, type Locale } from "@/core/lib/site";
import { sitePageContent } from "@/data/sitePageContent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khoobrooz.ir";

const staticPublicPaths = [
  "/",
  "/about",
  "/contact",
  "/documents",
  "/education",
  "/faq",
  "/knowledge",
  "/markets/currency-rates",
  "/services",
  "/services/customs-clearance",
  "/services/dirham-transfer",
  "/services/dollar-transfer",
  "/services/euro-transfer",
  "/services/lira-transfer",
  "/services/yuan-transfer",
  "/trade-updates",
  "/trade-news",
  "/trade-circulars"
];

const dynamicPublicPaths = Object.keys(sitePageContent).map((slug) => `/${slug}`);
const publicPaths = Array.from(new Set([...staticPublicPaths, ...dynamicPublicPaths])).sort();

function absoluteUrl(locale: Locale, path: string) {
  return new URL(localizedPath(locale, path), siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) => (
    publicPaths.map((path) => ({
      url: absoluteUrl(locale, path),
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : path.startsWith("/services") ? 0.85 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((item) => [item, absoluteUrl(item, path)]))
      }
    }))
  ));
}
