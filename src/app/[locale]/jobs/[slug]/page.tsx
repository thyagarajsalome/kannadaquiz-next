import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import { getPublicJobBySlug, getPublicPostBySlug, getPublicJobs } from "@/lib/public-content";

export const revalidate = 86400;

export async function generateStaticParams() {
  const knJobs = await getPublicJobs("kn", 50);
  const enJobs = await getPublicJobs("en", 50);
  const knParams = knJobs.map((j) => ({ locale: "kn", slug: j.slug }));
  const enParams = enJobs.map((j) => ({ locale: "en", slug: j.slug }));
  return [...knParams, ...enParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  const job = await getPublicJobBySlug(locale, slug);
  if (job) {
    return {
      title: job.title,
      description: job.body?.slice(0, 160) || job.title,
      alternates: {
        canonical: `https://kannadaquiz.in/${locale}/jobs/${slug}`,
      },
      openGraph: {
        title: job.title,
        description: job.body?.slice(0, 160) || job.title,
        url: `https://kannadaquiz.in/${locale}/jobs/${slug}`,
        siteName: "KannadaQuiz",
        locale: locale === "kn" ? "kn_IN" : "en_US",
        type: "article",
      },
    };
  }

  // If it's a post, it will be redirected in the component
  const post = await getPublicPostBySlug(locale, slug);
  if (post) {
    return {
      title: post.title,
      description: post.excerpt || post.title,
    };
  }

  return {
    title: "Not Found",
    robots: { index: false, follow: false },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  // 1. Check if the job exists in the jobs collection
  const job = await getPublicJobBySlug(locale, slug);
  if (job) {
    const jobJsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.body || job.title,
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.organization || "Government of Karnataka",
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "Karnataka",
          "addressCountry": "IN",
        },
      },
      ...(job.deadline ? { "validThrough": job.deadline } : {}),
    };

    return (
      <main className="bg-[var(--background)] min-h-screen py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }}
        />

        <div className="kq-container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--muted)] flex items-center gap-2 mb-6">
            <Link href={`/${locale}`} className="hover:text-[var(--primary)]">
              {locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/jobs`} className="hover:text-[var(--primary)]">
              {locale === "kn" ? "ಉದ್ಯೋಗಗಳು" : "Jobs"}
            </Link>
            <span>›</span>
            <span className="text-[var(--foreground)] font-semibold truncate max-w-xs">
              {job.title}
            </span>
          </nav>

          <article className="kq-card p-6 md:p-10 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200">
                {job.organization || "Govt Notification"}
              </span>
              {job.deadline && (
                <span className="bg-rose-50 text-rose-700 font-bold text-xs px-3 py-1 rounded-full border border-rose-200">
                  {locale === "kn" ? `ಕೊನೆಯ ದಿನಾಂಕ: ${job.deadline}` : `Deadline: ${job.deadline}`}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[var(--primary)] leading-tight mb-6">
              {job.title}
            </h1>

            <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed text-[var(--foreground)] space-y-4 border-t border-[var(--border)] pt-6">
              {job.body?.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap gap-4 items-center justify-between">
              <Link
                href={`/${locale}/jobs`}
                className="text-xs font-bold text-[var(--secondary)] hover:underline flex items-center gap-1"
              >
                <span>←</span>
                <span>{locale === "kn" ? "ಎಲ್ಲಾ ಉದ್ಯೋಗ ಮಾಹಿತಿಗಳನ್ನು ನೋಡಿ" : "Back to All Jobs"}</span>
              </Link>

              <Link
                href={`/${locale}/quizzes`}
                className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                {locale === "kn" ? "ಪರೀಕ್ಷಾ ತಯಾರಿ ಕ್ವಿಜ್ ಪ್ರಾರಂಭಿಸಿ ➔" : "Take Practice Quiz ➔"}
              </Link>
            </div>
          </article>
        </div>
      </main>
    );
  }

  // 2. Check if this slug exists as a Post in the posts collection (301 Permanent Redirect)
  const post = await getPublicPostBySlug(locale, slug);
  if (post) {
    redirect(`/${locale}/posts/${slug}`);
  }

  // Also check alternative locale in posts
  const altLocale: Locale = locale === "kn" ? "en" : "kn";
  const altPost = await getPublicPostBySlug(altLocale, slug);
  if (altPost) {
    redirect(`/${altLocale}/posts/${slug}`);
  }

  // 3. If neither exists, return true HTTP 404 (NEVER redirect to homepage!)
  notFound();
}
