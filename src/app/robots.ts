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
      ],
    },
    sitemap: "https://kannadaquiz.in/sitemap.xml",
  };
}
