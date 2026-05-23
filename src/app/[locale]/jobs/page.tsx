import type { Metadata } from "next";
import Link from "next/link";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicJobs } from "@/lib/public-content";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Karnataka Job Alerts",
  description: "Government job alerts and deadline tracking for Karnataka exam aspirants.",
};

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const jobs = await getPublicJobs(locale);

  return (
    <section className="kq-container py-10">
      <h1 className="font-serif text-4xl font-bold text-[var(--primary)]">{siteText[locale].jobs}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Link key={job.slug} href={`/${locale}/jobs/${job.slug}`} className="kq-card p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
              {job.organization} • {job.status}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--primary)]">
              {job.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Deadline: <time>{job.deadline}</time>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
