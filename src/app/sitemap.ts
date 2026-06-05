import type { MetadataRoute } from "next";
import { quizzes } from "@/data/content";
import { locales } from "@/lib/locales";
import { getPublicJobs, getPublicPosts } from "@/lib/public-content";

const baseUrl = "https://kannadaquiz.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/quizzes`,
    `/${locale}/posts`,
    `/${locale}/jobs`,
    `/${locale}/category/karnataka`,
    `/${locale}/category/national`,
    `/${locale}/category/international`,
    `/${locale}/category/jobs`,
  ]);

  const quizRoutes = locales.flatMap((locale) =>
    quizzes.map((quiz) => `/${locale}/quizzes/${quiz.slug}`),
  );

  const contentByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: await getPublicPosts(locale, 500),
      jobs: await getPublicJobs(locale, 500),
    })),
  );

  const contentRoutes = contentByLocale.flatMap(({ locale, posts, jobs }) => [
    ...posts.map((post) => `/${locale}/posts/${post.slug}`),
    ...jobs.map((job) => `/${locale}/jobs/${job.slug}`),
  ]);

  return [...staticRoutes, ...quizRoutes, ...contentRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("/quizzes/") ? "weekly" : "daily",
    priority: route === "/kn" || route === "/en" ? 1 : 0.8,
  }));
}
