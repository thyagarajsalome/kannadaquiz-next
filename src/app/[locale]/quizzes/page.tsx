import type { Metadata } from "next";
import Link from "next/link";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicQuizzes } from "@/lib/public-content";

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
    title: lang === "kn" ? "ಕನ್ನಡ ಕ್ವಿಜ್‌ಗಳು" : "Exam Quizzes",
    description:
      "Static, fast-loading quiz pages for Karnataka exam preparation in Kannada and English.",
    alternates: {
      canonical: `/${lang}/quizzes`,
      languages: { kn: "/kn/quizzes", en: "/en/quizzes" },
    },
  };
}

export default async function QuizzesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const text = siteText[locale];
  const quizzes = await getPublicQuizzes(locale);

  return (
    <section className="kq-container py-10">
      <h1 className="font-serif text-4xl font-bold text-[var(--primary)]">{text.featuredQuizzes}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Link key={quiz.slug} href={`/${locale}/quizzes/${quiz.slug}`} className="kq-card p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
              {quiz.exam} • {quiz.subject} • {quiz.timeLimitMinutes} {text.minutes}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--primary)]">
              {quiz.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{quiz.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 rounded-md bg-[var(--secondary)] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--secondary)]/90 transition-colors shadow-sm select-none">
              {text.quizStart} ➔
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
