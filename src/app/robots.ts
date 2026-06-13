import type { MetadataRoute } from "next";

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
      ],
    },
    sitemap: "https://kannadaquiz.in/sitemap.xml",
  };
}
