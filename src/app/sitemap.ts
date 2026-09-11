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
    `/${locale}/exams`,
    `/${locale}/posts`,
    `/${locale}/education`,
    `/${locale}/syllabus`,
    `/${locale}/syllabus/kas`,
    `/${locale}/syllabus/psi`,
    `/${locale}/syllabus/fda-sda`,
    `/${locale}/syllabus/vao`,
    `/${locale}/syllabus/sslc`,
    `/${locale}/syllabus/puc`,
    `/${locale}/category/jobs`,
    `/${locale}/category/question-papers`,
    `/${locale}/category/schemes`,
    `/${locale}/category/education`,
    `/${locale}/category/technology`,
    `/${locale}/category/agriculture`,
    `/${locale}/services`,
    `/${locale}/services/railway`,
    `/${locale}/games/gadhe`,
    `/${locale}/games/worldcup`,
    `/${locale}/about`,
    `/${locale}/contact`,
    `/${locale}/privacy`,
    `/${locale}/terms`,
    `/${locale}/disclaimer`,
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
      seoRoutes = seoData.map((page: any) => `/kn/exams/${page.slug}`);
    }
  } catch (error) {
    console.error("Failed to load SEO pages for sitemap:", error);
  }

  const now = new Date();

  return [...staticRoutes, ...contentRoutes, ...seoRoutes].map((route) => {
    const isHome = route === "/kn" || route === "/en";
    const isQuiz = route.includes("/quizzes");
    const isJob = route.includes("/jobs") || route.includes("/exams");
    const isPolicy = ["/privacy", "/terms", "/disclaimer", "/about", "/contact"].some((p) => route.endsWith(p));

    return {
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: isHome || isJob ? "daily" : isQuiz ? "weekly" : isPolicy ? "monthly" : "weekly",
      priority: isHome ? 1.0 : isQuiz || isJob ? 0.9 : isPolicy ? 0.5 : 0.8,
    };
  });
}
