import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { getPublicJobs, getPublicPosts, getPublicQuizzes } from "@/lib/public-content";

const baseUrl = "https://kannadaquiz.in";

export const dynamic = "force-static";
export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/quizzes`,
    `/${locale}/posts`,
    `/${locale}/jobs`,
    `/${locale}/syllabus`,
    `/${locale}/syllabus/kas`,
    `/${locale}/syllabus/psi`,
    `/${locale}/syllabus/fda-sda`,
    `/${locale}/syllabus/vao`,
    `/${locale}/syllabus/sslc`,
    `/${locale}/syllabus/puc`,
    `/${locale}/services`,
    `/${locale}/services/railway`,
    `/${locale}/expat`,
    `/${locale}/games/gadhe`,
    `/${locale}/games/worldcup`,
    `/${locale}/category/karnataka`,
    `/${locale}/category/national`,
    `/${locale}/category/international`,
    `/${locale}/category/jobs`,
    `/${locale}/category/schemes`,
    `/${locale}/category/agriculture`,
    `/${locale}/category/education`,
    `/${locale}/category/tourism`,
    `/${locale}/category/sports`,
    `/${locale}/category/technology`,
  ]);

  const contentByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      quizzes: await getPublicQuizzes(locale, 500),
      posts: await getPublicPosts(locale, 500),
      jobs: await getPublicJobs(locale, 500),
    })),
  );

  const contentRoutes = contentByLocale.flatMap(({ locale, quizzes, posts, jobs }) => [
    ...quizzes.map((quiz) => `/${locale}/quizzes/${quiz.slug}`),
    ...posts.map((post) => `/${locale}/posts/${post.slug}`),
    ...jobs.map((job) => `/${locale}/jobs/${job.slug}`),
  ]);

  return [...staticRoutes, ...contentRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("/quizzes/") ? "weekly" : "daily",
    priority: route === "/kn" || route === "/en" ? 1 : 0.8,
  }));
}
