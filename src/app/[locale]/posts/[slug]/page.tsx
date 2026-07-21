import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPostBySlug } from "@/lib/public-content";

// Force dynamic rendering to prevent the static-to-dynamic runtime 500 error
export const dynamic = "force-dynamic";

// 1. Explicitly define the allowed locales here to guarantee type safety
type ValidLocale = "kn" | "en";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // 2. Safely cast the locale so TypeScript is 100% sure it's valid
  const locale = (resolvedParams.locale === "en" ? "en" : "kn") as ValidLocale;

  if (!slug) {
    return {
      title: "KannadaQuiz",
    };
  }

  // 3. No more type errors here!
  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    return {
      title: locale === "kn" ? "ಲೇಖನ ಕಂಡುಬಂದಿಲ್ಲ | KannadaQuiz" : "Post Not Found | KannadaQuiz",
    };
  }

  const title = (post as { title?: string }).title || "KannadaQuiz";
  const excerpt = (post as { excerpt?: string }).excerpt || title;
  const image = (post as { featuredImageUrl?: string }).featuredImageUrl;

  return {
    title: `${title} | KannadaQuiz`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Apply the same strict casting here
  const locale = (resolvedParams.locale === "en" ? "en" : "kn") as ValidLocale;

  if (!slug) {
    notFound();
  }

  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  // Type assertions to safely handle optional or flexible post fields
  const postData = post as {
    title?: string;
    category?: string;
    date?: string;
    sourceName?: string;
    featuredImageUrl?: string;
    content?: string;
    excerpt?: string;
  };

  return (
    <article className="kq-container py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href={`/${locale}/posts`}
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
          <span>{locale === "kn" ? "ಎಲ್ಲಾ ಲೇಖನಗಳು" : "Back to Articles"}</span>
        </Link>

        {/* Category & Date */}
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
          {postData.category || "General"} • {postData.date || ""} {postData.sourceName ? `• ${postData.sourceName}` : ""}
        </p>

        {/* Title */}
        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[var(--primary)] leading-tight">
          {postData.title}
        </h1>

        {/* Featured Image */}
        {postData.featuredImageUrl && (
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] aspect-video">
            <img
              src={postData.featuredImageUrl}
              alt={postData.title || "Post image"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        {postData.content ? (
          <div
            className="mt-8 prose prose-slate max-w-none text-[var(--foreground)] leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        ) : (
          <p className="mt-8 text-base text-[var(--muted)] leading-relaxed">
            {postData.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}