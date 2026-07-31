import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { QuizPlayer } from "@/components/QuizPlayer";
import { quizzes } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicQuizzes, getPublicQuizBySlug } from "@/lib/public-content";

export async function generateStaticParams() {
  const knQuizzes = await getPublicQuizzes("kn", 20);
  const enQuizzes = await getPublicQuizzes("en", 20);
  const knParams = knQuizzes.map((q) => ({ locale: "kn", slug: q.slug }));
  const enParams = enQuizzes.map((q) => ({ locale: "en", slug: q.slug }));
  const combined = [...knParams, ...enParams];
  if (combined.length === 0) {
    return [{ locale: "kn", slug: "default-quiz" }, { locale: "en", slug: "default-quiz" }];
  }
  return combined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  let quiz = await getPublicQuizBySlug(locale, slug);

  if (!quiz) {
    const alternativeLocale: Locale = locale === "kn" ? "en" : "kn";
    quiz = await getPublicQuizBySlug(alternativeLocale, slug);
  }

  if (!quiz) {
    return {};
  }

  return {
    title: quiz.title,
    description: quiz.description,
    alternates: {
      canonical: `/${locale}/quizzes/${quiz.slug}`,
      languages: {
        kn: `/kn/quizzes/${quiz.slug}`,
        en: `/en/quizzes/${quiz.slug}`,
      },
    },
    openGraph: {
      title: quiz.title,
      description: quiz.description,
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
  const quiz = await getPublicQuizBySlug(locale, slug);

  if (!quiz) {
    // Try fallback locale and redirect if found
    const alternativeLocale: Locale = locale === "kn" ? "en" : "kn";
    const fallbackQuiz = await getPublicQuizBySlug(alternativeLocale, slug);
    if (fallbackQuiz) {
      redirect(`/${alternativeLocale}/quizzes/${slug}`);
    }
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": quiz.title,
    "description": quiz.description,
    "educationalLevel": quiz.difficulty,
    "assesses": `${quiz.exam} - ${quiz.subject}`,
    "hasPart": quiz.questions.map((q, idx) => ({
      "@type": "Question",
      "name": q.question,
      "position": idx + 1,
      "suggestedAnswer": q.options.map((opt, oIdx) => ({
        "@type": "Answer",
        "text": opt,
        "isCorrect": oIdx === q.correctOptionIndex
      }))
    }))
  };

  return (
    <article className="kq-container grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
          {quiz.exam && quiz.exam.toLowerCase() !== "general" ? `${quiz.exam} • ` : ""}
          {quiz.subject} • {quiz.difficulty}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
          {quiz.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{quiz.description}</p>
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
            name: quiz.title,
            description: quiz.description,
            educationalLevel: "Competitive exam preparation",
            inLanguage: locale === "kn" ? "kn-IN" : "en-IN",
          }),
        }}
      />
    </article>
  );
}
