import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { getPublicPosts, getPublicQuizzes } from "@/lib/public-content";
import fs from "fs";
import path from "path";

const baseUrl = "https://kannadaquiz.in";

export const dynamic = "force-static";
export const revalidate = 86400; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/quizzes`,
    `/${locale}/posts`,
    `/${locale}/syllabus`,
    `/${locale}/syllabus/kas`,
    `/${locale}/syllabus/psi`,
    `/${locale}/syllabus/fda-sda`,
    `/${locale}/syllabus/vao`,
    `/${locale}/syllabus/sslc`,
    `/${locale}/syllabus/puc`,
    `/${locale}/category/jobs`,
    `/${locale}/category/schemes`,
    `/${locale}/category/education`,
    `/${locale}/category/technology`,
  ]);

  const contentByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      quizzes: await getPublicQuizzes(locale, 2000),
      posts: await getPublicPosts(locale, 2000),
    })),
  );

  const contentRoutes = contentByLocale.flatMap(({ locale, quizzes, posts }) => [
    ...quizzes.map((quiz) => `/${locale}/quizzes/${quiz.slug}`),
    ...posts.map((post) => `/${locale}/posts/${post.slug}`),
  ]);

  // Load SEO Pages
  let seoRoutes: string[] = [];
  try {
    const seoFilePath = path.join(process.cwd(), "src", "data", "seo-exams.json");
    if (fs.existsSync(seoFilePath)) {
      const seoData = JSON.parse(fs.readFileSync(seoFilePath, "utf8"));
      seoRoutes = locales.flatMap(locale => 
        seoData.map((page: any) => `/${locale}/exams/${page.slug}`)
      );
    }
  } catch (error) {
    console.error("Failed to load SEO pages for sitemap:", error);
  }

  return [...staticRoutes, ...contentRoutes, ...seoRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("/quizzes/") ? "weekly" : "daily",
    priority: route === "/kn" || route === "/en" ? 1 : 0.8,
  }));
}
