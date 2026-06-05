import type { Metadata } from "next";
import Link from "next/link";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicCurrentAffairs, getPublicJobs, getPublicPosts, getPublicQuizzes } from "@/lib/public-content";

export const revalidate = 300;

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
  const [currentAffairs, posts, jobs, quizzes] = await Promise.all([
    getPublicCurrentAffairs(locale, 5),
    getPublicPosts(locale, 4),
    getPublicJobs(locale, 4),
    getPublicQuizzes(locale, 3),
  ]);

  return (
    <>
      <section className="py-10 bg-white">
        <div className="kq-container grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Left Column: Featured Quizzes */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--primary)]">
              {text.featuredQuizzes}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {quizzes.length === 0 ? (
                <div className="kq-card p-6 col-span-2 text-center text-[var(--muted)] opacity-70">
                  {locale === "kn" ? "ಯಾವುದೇ ಕ್ವಿಜ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ." : "No quizzes available yet."}
                </div>
              ) : (
                quizzes.map((quiz) => (
                  <Link key={quiz.slug} href={`/${locale}/quizzes/${quiz.slug}`} className="kq-card p-5 hover:border-[var(--secondary)] transition-all">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                      {quiz.exam} • {quiz.subject}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-bold text-[var(--primary)]">
                      {quiz.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {quiz.description}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Current Affairs */}
          <aside className="kq-card p-5 self-start">
            <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">
              {text.currentAffairs}
            </h2>
            <div className="mt-4 grid gap-4">
              {currentAffairs.length === 0 ? (
                <p className="text-sm text-[var(--muted)] opacity-70">
                  {locale === "kn" ? "ಯಾವುದೇ ಪ್ರಚಲಿತ ಘಟನೆಗಳಿಲ್ಲ." : "No current affairs available yet."}
                </p>
              ) : (
                currentAffairs.map((item) => (
                  <article key={item.date} className="border-b border-[var(--border)] pb-4 last:border-0">
                    <time className="text-xs font-bold text-[var(--secondary)]">{item.date}</time>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.headline}</p>
                  </article>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="py-10 border-t border-[var(--border)]">
        <div className="kq-container grid gap-8 md:grid-cols-2">
          {/* Study Articles */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--primary)]">{text.posts}</h2>
            <div className="mt-5 grid gap-4">
              {posts.length === 0 ? (
                <div className="kq-card p-6 text-center text-[var(--muted)] opacity-70">
                  {locale === "kn" ? "ಯಾವುದೇ ಲೇಖನಗಳು ಲಭ್ಯವಿಲ್ಲ." : "No articles available yet."}
                </div>
              ) : (
                posts.map((post) => (
                  <Link key={post.slug} href={`/${locale}/posts/${post.slug}`} className="kq-card p-5 hover:border-[var(--secondary)] transition-all">
                    <p className="text-xs font-bold text-[var(--secondary)]">{post.category}</p>
                    <h3 className="mt-2 text-xl font-bold text-[var(--primary)]">{post.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Job Alerts */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--primary)]">{text.jobs}</h2>
            <div className="mt-5 grid gap-4">
              {jobs.length === 0 ? (
                <div className="kq-card p-6 text-center text-[var(--muted)] opacity-70">
                  {locale === "kn" ? "ಯಾವುದೇ ಉದ್ಯೋಗ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ." : "No job alerts available yet."}
                </div>
              ) : (
                jobs.map((job) => (
                  <Link key={job.slug} href={`/${locale}/jobs/${job.slug}`} className="kq-card p-5 hover:border-[var(--secondary)] transition-all">
                    <p className="text-xs font-bold text-[var(--secondary)]">{job.organization}</p>
                    <h3 className="mt-2 text-xl font-bold text-[var(--primary)]">{job.title}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Deadline: <time>{job.deadline}</time>
                    </p>
                  </Link>
                ))
              )}
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
