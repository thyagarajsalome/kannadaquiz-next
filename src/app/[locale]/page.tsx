import type { Metadata } from "next";
import Link from "next/link";
import { currentAffairs, jobs, posts, quizzes, siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";

  return {
    title:
      lang === "kn"
        ? "KannadaQuiz - ಕರ್ನಾಟಕ ಪರೀಕ್ಷಾ ತಯಾರಿ"
        : "KannadaQuiz - Karnataka Exam Preparation",
    description:
      lang === "kn"
        ? "KPSC, PSI, FDA-SDA, TET ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನಕ್ಕಾಗಿ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಕ್ವಿಜ್‌ಗಳು."
        : "Kannada and English quiz practice, current affairs, and job alerts for Karnataka competitive exams.",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        kn: "/kn",
        en: "/en",
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const text = siteText[locale];

  return (
    <>
      <section className="bg-white">
        <div className="kq-container grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--secondary)]">
              KPSC • PSI • FDA-SDA • TET
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-[var(--primary)] md:text-5xl">
              {text.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{text.heroLead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/quizzes`}
                className="rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white"
              >
                {text.primaryCta}
              </Link>
              <Link
                href={`/${locale}/posts`}
                className="rounded-md border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--primary)]"
              >
                {text.secondaryCta}
              </Link>
            </div>
          </div>
          <aside className="kq-card p-5">
            <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">
              {text.currentAffairs}
            </h2>
            <div className="mt-4 grid gap-4">
              {currentAffairs.map((item) => (
                <article key={item.date} className="border-b border-[var(--border)] pb-4 last:border-0">
                  <time className="text-xs font-bold text-[var(--secondary)]">{item.date}</time>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.headline[locale]}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="kq-band py-10">
        <div className="kq-container">
          <h2 className="font-serif text-3xl font-bold text-[var(--primary)]">
            {text.featuredQuizzes}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link key={quiz.slug} href={`/${locale}/quizzes/${quiz.slug}`} className="kq-card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                  {quiz.exam} • {quiz.subject}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[var(--primary)]">
                  {quiz.title[locale]}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {quiz.description[locale]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="kq-container grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--primary)]">{text.posts}</h2>
            <div className="mt-5 grid gap-4">
              {posts.map((post) => (
                <article key={post.slug} className="kq-card p-5">
                  <p className="text-xs font-bold text-[var(--secondary)]">{post.category}</p>
                  <h3 className="mt-2 text-xl font-bold text-[var(--primary)]">{post.title[locale]}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{post.excerpt[locale]}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--primary)]">{text.jobs}</h2>
            <div className="mt-5 grid gap-4">
              {jobs.map((job) => (
                <article key={job.slug} className="kq-card p-5">
                  <p className="text-xs font-bold text-[var(--secondary)]">{job.organization}</p>
                  <h3 className="mt-2 text-xl font-bold text-[var(--primary)]">{job.title[locale]}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Deadline: <time>{job.deadline}</time>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "KannadaQuiz",
            url: "https://kannadaquiz.in",
            inLanguage: locale === "kn" ? "kn-IN" : "en-IN",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://kannadaquiz.in/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
