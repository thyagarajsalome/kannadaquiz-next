import type { MetadataRoute } from "next";
import { jobs, posts, quizzes } from "@/data/content";
import { locales } from "@/lib/locales";

const baseUrl = "https://kannadaquiz.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/quizzes`,
    `/${locale}/posts`,
    `/${locale}/jobs`,
  ]);

  const quizRoutes = locales.flatMap((locale) =>
    quizzes.map((quiz) => `/${locale}/quizzes/${quiz.slug}`),
  );

  const contentRoutes = locales.flatMap((locale) => [
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
