import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPostBySlug, type PublicPost } from "@/lib/public-content";
import { MiniQuizPlayer } from "@/components/MiniQuizPlayer";

// Force dynamic rendering to prevent static bailout errors in production
export const dynamic = "force-dynamic";

type ValidLocale = "kn" | "en";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

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
  movies: { kn: "ಚಲನಚಿತ್ರ ಸುದ್ದಿ", en: "Movies & Cinema" },
  "home-design": { kn: "ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್", en: "Home Design & Real Estate" },
  general: { kn: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ", en: "General News" }
};

function getCategorySlug(category?: string): string {
  if (!category) return "general";
  const norm = category.toLowerCase();
  if (norm.includes("karnataka")) return "karnataka";
  if (norm.includes("international")) return "international";
  if (norm.includes("movie") || norm.includes("cinema") || norm.includes("film") || norm.includes("sandalwood")) return "movies";
  if (norm.includes("home") || norm.includes("design") || norm.includes("interior") || norm.includes("plan") || norm.includes("real estate") || norm.includes("estate") || norm.includes("promotion")) return "home-design";
  if (norm.includes("national") || norm.includes("affair") || norm.includes("current") || norm.includes("general")) return "national";
  if (norm.includes("job") || norm.includes("kpsc") || norm.includes("exam") || norm.includes("career")) return "jobs";
  if (norm.includes("agriculture") || norm.includes("krishi") || norm.includes("farm")) return "agriculture";
  if (norm.includes("college") || norm.includes("guide") || norm.includes("education")) return "education";
  if (norm.includes("scheme") || norm.includes("yojane")) return "schemes";
  if (norm.includes("tourism") || norm.includes("heritage") || norm.includes("itihasa") || norm.includes("culture")) return "tourism";
  if (norm.includes("sport") || norm.includes("game") || norm.includes("kriide")) return "sports";
  return "general";
}

function getLocalizedCategory(category: string | undefined, locale: string): string {
  if (!category) return categoryTranslations.general[locale] || "General";
  const slug = getCategorySlug(category);
  return categoryTranslations[slug]?.[locale] || category;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const locale = (resolvedParams.locale === "en" ? "en" : "kn") as ValidLocale;

  if (!slug) {
    return {
      title: "KannadaQuiz",
    };
  }

  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    return {
      title: locale === "kn" ? "ಲೇಖನ ಕಂಡುಬಂದಿಲ್ಲ | KannadaQuiz" : "Post Not Found | KannadaQuiz",
    };
  }

  return {
    title: `${post.title} | KannadaQuiz`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const locale = (resolvedParams.locale === "en" ? "en" : "kn") as ValidLocale;

  if (!slug) {
    notFound();
  }

  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="kq-container py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href={`/${locale}`}
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--secondary)] hover:underline mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>{locale === "kn" ? "ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ" : "Back to Home"}</span>
        </Link>

        {/* Category & Date */}
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
          <Link href={`/${locale}/category/${getCategorySlug(post.category)}`} className="hover:underline">
            {getLocalizedCategory(post.category, locale)}
          </Link>
          <span> • {post.date}</span>
          {post.sourceName && <span> • {post.sourceName}</span>}
        </p>

        {/* Title */}
        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[var(--primary)] leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-[var(--muted)] font-medium">
            {post.excerpt}
          </p>
        )}

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] aspect-video">
            <img
              src={post.featuredImageUrl}
              alt={post.title || "Post image"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="mt-8 kq-card p-5 md:p-6 text-base leading-8 text-[var(--foreground)] whitespace-pre-wrap">
          {(post.body || "")
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
        </div>

        {/* Mini Quiz Player (if attached) */}
        {post.quiz && post.quiz.length > 0 && (
          <div className="mt-10">
            <MiniQuizPlayer questions={post.quiz} locale={locale} />
          </div>
        )}
      </div>
    </article>
  );
}