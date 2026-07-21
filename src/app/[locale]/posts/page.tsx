import type { Metadata } from "next";
import Link from "next/link";
import { siteText } from "@/data/content";
import { isLocale, type Locale } from "@/lib/locales";
import { getPublicPosts } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return {
    title:
      locale === "kn"
        ? "ಖಾತೆ ಲೇಖನಗಳು ಮತ್ತು ದಿನನಿತ್ಯದ ಸುದ್ದಿಗಳು | KannadaQuiz"
        : "Study Articles & Daily News | KannadaQuiz",
    description:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ಉಪಯುಕ್ತವಾದ ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು, ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ಲೇಖನಗಳು."
        : "Latest study articles, news analysis, and current affairs updates for Karnataka competitive exams.",
    keywords:
      locale === "kn"
        ? [
            "ಕನ್ನಡ ಲೇಖನಗಳು",
            "ಕೆಪಿಎಸ್‌ಸಿ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ",
            "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು",
            "ಎಫ್‌ಡಿಎ ಎಸ್‌ಡಿಎ ಲೇಖನ",
          ]
        : [
            "Kannada Articles",
            "KPSC Study Materials",
            "Current Affairs Articles",
            "Exams Preparation",
          ],
  };
}

const categoryTranslations: Record<string, Record<string, string>> = {
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  national: { kn: "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "National News" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "International News" },
  jobs: { kn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", en: "Jobs & Careers" },
  kpsc: { kn: "ಪರೀಕ್ಷಾ ವಿವರಗಳು", en: "Exams & Education" },
  current_affairs: { kn: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", en: "Current Affairs" },
  general: { kn: "ಸಾಮಾನ್ಯ", en: "General" },
};

function getLocalizedCategory(category: string, locale: string): string {
  const norm = category.toLowerCase();
  if (norm.includes("karnataka"))
    return categoryTranslations.karnataka[locale] || category;
  if (norm.includes("international"))
    return categoryTranslations.international[locale] || category;
  if (norm.includes("national"))
    return categoryTranslations.national[locale] || category;
  if (
    norm.includes("job") ||
    norm.includes("kpsc") ||
    norm.includes("exam") ||
    norm.includes("career")
  ) {
    return categoryTranslations.jobs[locale] || category;
  }
  if (norm.includes("affair") || norm.includes("current")) {
    return categoryTranslations.current_affairs[locale] || category;
  }
  return categoryTranslations.general[locale] || category;
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const posts = await getPublicPosts(locale);

  return (
    <section className="kq-container py-10">
      <h1 className="font-serif text-4xl font-bold text-[var(--primary)]">
        {siteText[locale].posts}
      </h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/posts/${post.slug}`}
            prefetch={false}
            className="kq-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow rounded-xl border border-[var(--border)]"
          >
            <div>
              {post.featuredImageUrl && (
                <div className="block overflow-hidden aspect-video border-b border-[var(--border)]/40">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                  {getLocalizedCategory(post.category, locale)} • {post.date}{" "}
                  {post.sourceName ? `• ${post.sourceName}` : ""}
                </p>
                <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--primary)]">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}