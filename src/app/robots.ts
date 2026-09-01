import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/api/*",
        "/*/profile",
        "/*/login",
        "/*/category/karnataka",
        "/*/category/national",
        "/*/category/international",
        "/*/category/movies",
        "/*/category/sports",
        "/*/category/bangalore",
      ],
    },
    sitemap: "https://kannadaquiz.in/sitemap.xml",
  };
}
