import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicJobBySlug } from "@/lib/public-content";

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
  const job = await getPublicJobBySlug(locale, slug);

  if (!job) {
    return {};
  }

  return {
    title: job.title,
    description: `${job.organization} deadline ${job.deadline}`,
    alternates: {
      canonical: `/${locale}/jobs/${job.slug}`,
      languages: {
        kn: `/kn/jobs/${job.slug}`,
        en: `/en/jobs/${job.slug}`,
      },
    },
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const job = await getPublicJobBySlug(locale, slug);

  if (!job) {
    notFound();
  }

  return (
    <article className="kq-container max-w-3xl py-10">
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
        {job.organization} • {job.status}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
        {job.title}
      </h1>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="kq-card p-4">
          <dt className="text-xs font-bold uppercase text-[var(--secondary)]">
            {locale === "kn" ? "ಅಂತಿಮ ದಿನಾಂಕ" : "Deadline"}
          </dt>
          <dd className="mt-1 text-xl font-bold">{job.deadline}</dd>
        </div>
        <div className="kq-card p-4">
          <dt className="text-xs font-bold uppercase text-[var(--secondary)]">
            {locale === "kn" ? "ಸ್ಥಿತಿ" : "Status"}
          </dt>
          <dd className="mt-1 text-xl font-bold">{job.status}</dd>
        </div>
      </dl>
      {job.body ? (
        <div className="mt-8 kq-card p-5 text-base leading-8 text-[var(--foreground)]">
          {job.body
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
        </div>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            hiringOrganization: {
              "@type": "Organization",
              name: job.organization,
            },
            datePosted: "2026-05-23",
            validThrough: `${job.deadline}T23:59:59+05:30`,
            employmentType: "FULL_TIME",
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressRegion: "Karnataka",
                addressCountry: "IN",
              },
            },
          }),
        }}
      />
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
