import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/QuizPlayer";
import { quizzes } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";

export function generateStaticParams() {
  return locales.flatMap((locale) => quizzes.map((quiz) => ({ locale, slug: quiz.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const quiz = quizzes.find((item) => item.slug === slug);

  if (!quiz) {
    return {};
  }

  return {
    title: quiz.title[locale],
    description: quiz.description[locale],
    alternates: {
      canonical: `/${locale}/quizzes/${quiz.slug}`,
      languages: {
        kn: `/kn/quizzes/${quiz.slug}`,
        en: `/en/quizzes/${quiz.slug}`,
      },
    },
    openGraph: {
      title: quiz.title[locale],
      description: quiz.description[locale],
      type: "article",
    },
  };
}

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const quiz = quizzes.find((item) => item.slug === slug);

  if (!quiz) {
    notFound();
  }

  return (
    <article className="kq-container grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <header>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
          {quiz.exam} • {quiz.subject} • {quiz.difficulty}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
          {quiz.title[locale]}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{quiz.description[locale]}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="kq-card p-4">
            <dt className="text-xs font-bold text-[var(--secondary)]">
              {locale === "kn" ? "ಪ್ರಶ್ನೆಗಳು" : "Questions"}
            </dt>
            <dd className="mt-1 text-2xl font-bold">{quiz.questions.length}</dd>
          </div>
          <div className="kq-card p-4">
            <dt className="text-xs font-bold text-[var(--secondary)]">
              {locale === "kn" ? "ಸಮಯ" : "Time"}
            </dt>
            <dd className="mt-1 text-2xl font-bold">{quiz.timeLimitMinutes} min</dd>
          </div>
        </dl>
      </header>
      <QuizPlayer quiz={quiz} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: quiz.title[locale],
            description: quiz.description[locale],
            educationalLevel: "Competitive exam preparation",
            inLanguage: locale === "kn" ? "kn-IN" : "en-IN",
          }),
        }}
      />
    </article>
  );
}
