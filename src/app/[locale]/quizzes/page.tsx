import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicQuizzes } from "@/lib/public-content";

export const revalidate = 86400;

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

  const title =
    lang === "kn"
      ? "ಕನ್ನಡ ರಸಪ್ರಶ್ನೆಗಳು - KPSC, Police, FDA, SDA ಪರೀಕ್ಷಾ ತಯಾರಿ | KannadaQuiz"
      : "Karnataka Competitive Exam Quizzes - KPSC, Police, FDA, SDA | KannadaQuiz";

  const description =
    lang === "kn"
      ? "KPSC KAS, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, PSI, FDA, SDA, ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನಕ್ಕಾಗಿ ಉಚಿತ ಕನ್ನಡ ಆನ್‌ಲೈನ್ ಮಾಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ವಿಷಯವಾರು ರಸಪ್ರಶ್ನೆಗಳು."
      : "Free online quizzes and practice mock tests for Karnataka competitive exams including KPSC, Police, FDA, SDA, and general knowledge.";

  return {
    title,
    description,
    keywords: [
      "ಕನ್ನಡ ಕ್ವಿಜ್",
      "KPSC quiz Kannada",
      "Karnataka Police mock test",
      "Kannada GK quiz",
      "FDA SDA practice test",
      "General science quiz Kannada",
    ],
    alternates: {
      canonical: `https://kannadaquiz.in/${lang}/quizzes`,
      languages: {
        kn: "https://kannadaquiz.in/kn/quizzes",
        en: "https://kannadaquiz.in/en/quizzes",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kannadaquiz.in/${lang}/quizzes`,
      siteName: "KannadaQuiz",
      images: [
        {
          url: "https://kannadaquiz.in/images/quizzes/general.webp",
          width: 800,
          height: 600,
          alt: "Kannada Quizzes",
        },
      ],
    },
  };
}

export default async function QuizzesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const text = siteText[locale];
  const quizzes = await getPublicQuizzes(locale, 50);

  const pageTitle =
    locale === "kn"
      ? "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ರಸಪ್ರಶ್ನೆಗಳು"
      : "Karnataka Competitive Exam Quizzes";

  const pageSubtitle =
    locale === "kn"
      ? "KPSC, ಪೊಲೀಸ್, FDA, SDA, ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ ಮತ್ತು ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ವಿಷಯವಾರು ಉಚಿತ ಅಭ್ಯಾಸ ರಸಪ್ರಶ್ನೆಗಳು."
      : "Subject-wise free practice quizzes and mock tests for KPSC, Police, FDA, SDA, and Karnataka state exams.";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    description: pageSubtitle,
    itemListElement: quizzes.map((quiz, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Quiz",
        name: quiz.title,
        description: quiz.description,
        url: `https://kannadaquiz.in/${locale}/quizzes/${quiz.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[var(--surface-soft)] to-white border-b border-[var(--border)] py-10 md:py-14">
        <div className="kq-container">
          <div className="max-w-3xl">
            <span className="inline-block bg-[var(--secondary)] text-white text-[10px] md:text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest select-none mb-3">
              {locale === "kn" ? "ಉಚಿತ ಆನ್‌ಲೈನ್ ಪರೀಕ್ಷಾ ಸರಣಿ" : "FREE ONLINE PRACTICE SERIES"}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--primary)] leading-tight">
              {pageTitle}
            </h1>
            <p className="mt-3 text-base md:text-lg text-[var(--muted)] leading-relaxed">
              {pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Quizzes Grid */}
      <section className="kq-container py-10">
        <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-8">
          <h2 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
            {text.featuredQuizzes} ({quizzes.length})
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/${locale}/quizzes/${quiz.slug}`}
              className="kq-card group overflow-hidden flex flex-col justify-between hover:border-[var(--secondary)] hover:shadow-lg transition-all duration-300 rounded-2xl border border-[var(--border)] bg-white"
            >
              <div>
                {quiz.featuredImageUrl && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-[var(--border)]/70">
                    <Image
                      src={quiz.featuredImageUrl}
                      alt={quiz.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      {quiz.difficulty}
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
                    {quiz.exam && quiz.exam.toLowerCase() !== "general" ? `${quiz.exam} • ` : ""}
                    {quiz.subject}
                  </p>

                  <h3 className="mt-2.5 font-serif text-xl font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors leading-snug line-clamp-2">
                    {quiz.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
                    {quiz.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[var(--border)]/60 bg-[var(--surface-soft)]/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-[var(--secondary)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {quiz.timeLimitMinutes} {text.minutes}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--secondary)] px-4 py-2 text-xs font-black uppercase tracking-wider text-white group-hover:bg-[var(--secondary)]/90 transition-all shadow-sm select-none">
                  {text.quizStart}
                  <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
