import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobs } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";

export function generateStaticParams() {
  return locales.flatMap((locale) => jobs.map((job) => ({ locale, slug: job.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const job = jobs.find((item) => item.slug === slug);

  if (!job) {
    return {};
  }

  return {
    title: job.title[locale],
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
  const job = jobs.find((item) => item.slug === slug);

  if (!job) {
    notFound();
  }

  return (
    <article className="kq-container max-w-3xl py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
        {job.organization} • {job.status}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
        {job.title[locale]}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title[locale],
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
    </article>
  );
}
