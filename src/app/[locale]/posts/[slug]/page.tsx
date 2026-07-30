import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getPublicPosts, getPublicPostBySlug, type PublicPost } from "@/lib/public-content";
import { MiniQuizPlayer } from "@/components/MiniQuizPlayer";

export async function generateStaticParams() {
  const knPosts = await getPublicPosts("kn", 2000);
  const enPosts = await getPublicPosts("en", 2000);
  const knParams = knPosts.map((post) => ({ locale: "kn", slug: post.slug }));
  const enParams = enPosts.map((post) => ({ locale: "en", slug: post.slug }));
  const combined = [...knParams, ...enParams];
  if (combined.length === 0) {
    return [{ locale: "kn", slug: "default-post" }, { locale: "en", slug: "default-post" }];
  }
  return combined;
}

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

function getSourceName(post: { sourceUrl?: string; sourceName?: string }) {
  if (post.sourceName) return post.sourceName;
  if (!post.sourceUrl) return "";
  try {
    const url = new URL(post.sourceUrl);
    return url.hostname.replace(/^(www\.|feeds\.|rss\.)/, "");
  } catch {
    return "External Link";
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const locale = (resolvedParams.locale === "en" ? "en" : "kn") as ValidLocale;

    if (!slug) {
      return {
        title: "KannadaQuiz",
      };
    }

    let post = await getPublicPostBySlug(locale, slug);

    if (!post) {
      const altLocale = locale === "en" ? "kn" : "en";
      post = (await getPublicPostBySlug(altLocale, slug)) || undefined;
    }

    if (!post) {
      return {
        title: locale === "kn" ? "ಸುದ್ದಿ | KannadaQuiz" : "Posts | KannadaQuiz",
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
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "KannadaQuiz",
    };
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const locale = (resolvedParams.locale === "en" ? "en" : "kn") as ValidLocale;

  let post: PublicPost | null = null;
  let redirectUrl = "";

  try {
    post = (await getPublicPostBySlug(locale, slug)) ?? null;

    if (!post) {
      // Check if the post exists in the alternative locale
      const altLocale = locale === "en" ? "kn" : "en";
      const altPost = await getPublicPostBySlug(altLocale, slug);
      if (altPost) {
        redirectUrl = `/${altLocale}/posts/${slug}`;
      }
    }
  } catch (error) {
    console.error(`Database error fetching post [${slug}]:`, error);
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  if (!post) {
    return (
      <main className="kq-container py-16 text-center">
        <div className="max-w-md mx-auto kq-card p-8 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            📰
          </div>
          <h1 className="font-serif text-2xl font-bold text-[var(--primary)] mb-3">
            {locale === "kn" ? "ಲೇಖನವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ..." : "Article Loading or Moved"}
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            {locale === "kn"
              ? "ನೀವು ವೀಕ್ಷಿಸುತ್ತಿರುವ ಲೇಖನವು ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತಿದೆ ಅಥವಾ ಮುಖಪುಟದಲ್ಲಿದೆ. ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ."
              : "The requested article is being updated or has moved. Return to the home page to view the latest content."}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--secondary)] text-white font-extrabold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            <span>{locale === "kn" ? "ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ ➔" : "Return to Home Page ➔"}</span>
          </Link>
        </div>
      </main>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImageUrl ? [post.featuredImageUrl] : [],
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "KannadaQuiz",
      url: "https://kannadaquiz.in",
    },
    publisher: {
      "@type": "Organization",
      name: "KannadaQuiz",
      logo: {
        "@type": "ImageObject",
        url: "https://kannadaquiz.in/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kannadaquiz.in/${locale}/posts/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "kn" ? "ಮುಖಪುಟ" : "Home",
        item: `https://kannadaquiz.in/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: getLocalizedCategory(post.category, locale),
        item: `https://kannadaquiz.in/${locale}/category/${getCategorySlug(post.category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://kannadaquiz.in/${locale}/posts/${post.slug}`,
      },
    ],
  };

  return (
    <article className="kq-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] aspect-video relative">
            <Image
              src={post.featuredImageUrl}
              alt={post.title || "Post image"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="mt-8 kq-card p-5 md:p-6 text-base leading-8 text-[var(--foreground)] whitespace-pre-wrap">
          {(post.body || "")
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, index) => {
              const urlRegex = /(https?:\/\/[^\s<]+)/g;
              const parts = paragraph.split(urlRegex);
              return (
                <p key={index} className="mb-5 last:mb-0">
                  {parts.map((part, idx) => {
                    if (/^https?:\/\//i.test(part)) {
                      const isInternal = part.includes("kannadaquiz.in") || part.startsWith("/");
                      if (isInternal) {
                        try {
                          const urlObj = new URL(part);
                          return (
                            <Link
                              key={idx}
                              href={urlObj.pathname}
                              className="text-[var(--secondary)] font-bold hover:underline break-all"
                            >
                              {part}
                            </Link>
                          );
                        } catch {
                          return (
                            <a
                              key={idx}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--secondary)] font-bold hover:underline break-all"
                            >
                              {part}
                            </a>
                          );
                        }
                      }
                      return (
                        <a
                          key={idx}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--secondary)] font-bold hover:underline break-all"
                        >
                          {part}
                        </a>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}

          {post.sourceUrl ? (() => {
            const formattedUrl = !/^https?:\/\//i.test(post.sourceUrl)
              ? `https://${post.sourceUrl}`
              : post.sourceUrl;
            return (
              <div className="mt-6 border-t border-[var(--border)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--muted)]">
                <span>
                  {post.category && getCategorySlug(post.category) === "home-design"
                    ? (locale === "kn" ? "ಹೆಚ್ಚಿನ ವಿವರಗಳು ಮತ್ತು ಸೇವೆಗಳು: " : "Product Details & Services: ")
                    : (locale === "kn" ? "ಮೂಲ ಮಾಹಿತಿ: " : "Source Details: ")}
                  <span className="font-bold text-[var(--foreground)]">
                    {getSourceName(post)}
                  </span>
                </span>
                <a
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[var(--secondary)] hover:underline"
                >
                  {post.category && getCategorySlug(post.category) === "home-design"
                    ? (locale === "kn" ? "ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ➔" : "Visit Website ➔")
                    : (locale === "kn" ? "ಮೂಲ ಲೇಖನ ಓದಿ ➔" : "Read Original Article ➔")}
                </a>
              </div>
            );
          })() : null}
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