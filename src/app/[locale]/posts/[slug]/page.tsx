import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicPostBySlug } from "@/lib/public-content";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${locale}/posts/${post.slug}`,
      languages: {
        kn: `/kn/posts/${post.slug}`,
        en: `/en/posts/${post.slug}`,
      },
    },
  };
}

const categoryTranslations: Record<string, Record<string, string>> = {
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  national: { kn: "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "National News" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "International News" },
  jobs: { kn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", en: "Jobs & Careers" },
  kpsc: { kn: "ಪರೀಕ್ಷಾ ವಿವರಗಳು", en: "Exams & Education" },
  current_affairs: { kn: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", en: "Current Affairs" },
  general: { kn: "ಸಾಮಾನ್ಯ", en: "General" }
};

function getLocalizedCategory(category: string, locale: string): string {
  const norm = category.toLowerCase();
  if (norm.includes("karnataka")) return categoryTranslations.karnataka[locale] || category;
  if (norm.includes("international")) return categoryTranslations.international[locale] || category;
  if (norm.includes("national")) return categoryTranslations.national[locale] || category;
  if (norm.includes("job") || norm.includes("kpsc") || norm.includes("exam") || norm.includes("career")) {
    return categoryTranslations.jobs[locale] || category;
  }
  if (norm.includes("affair") || norm.includes("current")) {
    return categoryTranslations.current_affairs[locale] || category;
  }
  return categoryTranslations.general[locale] || category;
}

function getSourceName(post: { sourceUrl?: string; sourceName?: string }) {
  if (post.sourceName) return post.sourceName;
  if (!post.sourceUrl) return "";
  try {
    const url = new URL(post.sourceUrl);
    return url.hostname.replace(/^(www\.|feeds\.|rss\.)/, "");
  } catch {
    return "News Source";
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="kq-container max-w-3xl py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
        {getLocalizedCategory(post.category, locale)} • {post.date}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
      {post.featuredImageUrl ? (
        <img
          src={post.featuredImageUrl}
          alt={post.title}
          className="mt-6 w-full max-h-[400px] object-cover rounded-lg shadow-sm border border-[var(--border)]"
        />
      ) : null}
      <div className="mt-8 kq-card p-5 text-base leading-8 text-[var(--foreground)]">
        {post.body
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        {post.sourceUrl ? (
          <div className="mt-6 border-t border-[var(--border)] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--muted)]">
            <span>
              {locale === "kn" ? "ಮೂಲ ಮಾಹಿತಿ: " : "Source: "}
              <span className="font-semibold text-[var(--foreground)]">
                {getSourceName(post)}
              </span>
            </span>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[var(--secondary)] hover:underline"
            >
              {locale === "kn" ? "ಮೂಲ ಲೇಖನ ಓದಿ ➔" : "Read Original Article ➔"}
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
