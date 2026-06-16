import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import { getPublicPostBySlug } from "@/lib/public-content";
import { MiniQuizPlayer } from "@/components/MiniQuizPlayer";

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

  // Generate dynamic keywords from the title
  const titleWords = post.title
    .split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z0-9\u0C80-\u0CFF]/g, "")) // Clean special chars
    .filter(w => w.length > 3)
    .slice(0, 8);

  const baseKeywords = locale === "kn"
    ? ["ಕನ್ನಡ ಸುದ್ದಿ", "ಸುದ್ದಿ ಸಾರಾಂಶ", "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", post.category]
    : ["Kannada News", "News Summary", "Current Affairs", post.category];

  return {
    title: `${post.title} | KannadaQuiz`,
    description: post.excerpt,
    keywords: [...baseKeywords, ...titleWords],
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
  agriculture: { kn: "ಕೃಷಿ ಮಾಹಿತಿ", en: "Agriculture Info" },
  education: { kn: "ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶಿಗಳು", en: "Education Guides" },
  schemes: { kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", en: "Government Schemes" },
  tourism: { kn: "ಇತಿಹಾಸ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ", en: "Heritage & Tourism" },
  sports: { kn: "ಕ್ರೀಡಾ ಸುದ್ದಿ", en: "Sports News" },
  general: { kn: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ", en: "General News" }
};

function getCategorySlug(category: string): string {
  const norm = category.toLowerCase();
  if (norm.includes("karnataka")) return "karnataka";
  if (norm.includes("international")) return "international";
  if (norm.includes("national") || norm.includes("affair") || norm.includes("current") || norm.includes("general")) return "national";
  if (norm.includes("job") || norm.includes("kpsc") || norm.includes("exam") || norm.includes("career")) return "jobs";
  if (norm.includes("agriculture") || norm.includes("krishi") || norm.includes("farm")) return "agriculture";
  if (norm.includes("college") || norm.includes("guide") || norm.includes("education")) return "education";
  if (norm.includes("scheme") || norm.includes("yojane")) return "schemes";
  if (norm.includes("tourism") || norm.includes("heritage") || norm.includes("itihasa") || norm.includes("culture")) return "tourism";
  if (norm.includes("sport") || norm.includes("game") || norm.includes("kriide")) return "sports";
  return "national";
}

function getLocalizedCategory(category: string, locale: string): string {
  const slug = getCategorySlug(category);
  return categoryTranslations[slug]?.[locale] || category;
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImageUrl ? [post.featuredImageUrl] : ["https://kannadaquiz.in/icon.svg"],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "KannadaQuiz",
      "url": "https://kannadaquiz.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KannadaQuiz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kannadaquiz.in/icon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kannadaquiz.in/${locale}/posts/${post.slug}`
    }
  };

  return (
    <article className="kq-container max-w-3xl py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back Link at the Top */}
      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--secondary)] transition-colors select-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {locale === "kn" ? "ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ" : "Back to Home"}
        </Link>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
        <Link href={`/${locale}/category/${getCategorySlug(post.category)}`} className="hover:underline">
          {getLocalizedCategory(post.category, locale)}
        </Link>
        <span> • {post.date}</span>
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
      
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

      {post.quiz && post.quiz.length > 0 ? (
        <MiniQuizPlayer questions={post.quiz} locale={locale} />
      ) : null}

      {/* Back to Home Button at the Bottom */}
      <div className="mt-8 flex justify-center border-t border-[var(--border)] pt-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-md shadow hover:bg-[var(--primary)]/90 transition-all text-sm cursor-pointer select-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          {locale === "kn" ? "ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ" : "Back to Home"}
        </Link>
      </div>
    </article>
  );
}
